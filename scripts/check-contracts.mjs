import { createHmac } from 'node:crypto';
import { resolve } from 'node:path';
import {
  readVerifiedFixtureSet,
  readVerifiedOpenApi,
  readVerifiedProtocolSet,
} from './lib/contract-artifacts.mjs';

const [{ release, document }, { fixtureSet, fixtures }, protocolSet] = await Promise.all([
  readVerifiedOpenApi(),
  readVerifiedFixtureSet(resolve('fixtures/v1')),
  readVerifiedProtocolSet(),
]);
if (release.contractVersion !== fixtureSet.contractVersion) {
  throw new Error('fixture_openapi_contract_version_mismatch');
}

const protocolContracts = Object.fromEntries(
  protocolSet.contracts.map(({ name, document: contract }) => [name, contract]),
);
assertSchemaEquivalent(
  document.components?.schemas?.WathbaProblem,
  protocolContracts['wathba-problem.schema.json'],
  'wathba_problem_openapi_protocol_mismatch',
);
assertSchemaEquivalent(
  document.components?.schemas?.WathbaProblem?.properties?.actionRef,
  protocolContracts['action-ref.schema.json'],
  'action_ref_openapi_protocol_mismatch',
);

function assertSchemaEquivalent(openApiSchema, protocolSchema, code) {
  if (openApiSchema === undefined || protocolSchema === undefined) throw new Error(code);
  const { $schema: _ignored, ...protocolComparable } = protocolSchema;
  if (JSON.stringify(sortDeep(openApiSchema)) !== JSON.stringify(sortDeep(protocolComparable))) {
    throw new Error(code);
  }
}

function sortDeep(value) {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (typeof value !== 'object' || value === null) return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => [key, sortDeep(item)]),
  );
}

for (const fixture of fixtures) {
  const value = fixture.document;
  if (value.schemaVersion !== '1.0') {
    throw new Error(`unsupported_fixture_schema:${fixture.name}`);
  }
  if (fixture.name === 'otp-webhook-round-trip.json') {
    assertWebhookFixture(value, fixture.name);
    continue;
  }
  if (typeof value.operationId !== 'string') {
    throw new Error(`unsupported_fixture_schema:${fixture.name}`);
  }
  const operations = [];
  for (const pathItem of Object.values(document.paths ?? {})) {
    for (const method of ['delete', 'get', 'patch', 'post', 'put']) {
      const operation = pathItem?.[method];
      if (operation?.operationId === value.operationId) operations.push(operation);
    }
  }
  if (operations.length !== 1) throw new Error(`fixture_operation_mismatch:${fixture.name}`);
  const operation = operations[0];
  for (const outcome of ['success', 'problem']) {
    const response = value[outcome];
    if (
      typeof response?.status !== 'number' ||
      typeof response.contentType !== 'string' ||
      operation.responses?.[String(response.status)]?.content?.[response.contentType] === undefined
    ) {
      throw new Error(`fixture_response_mismatch:${fixture.name}:${outcome}`);
    }
  }
}

function assertWebhookFixture(value, name) {
  const headers = value.headers;
  if (
    value.signature?.algorithm !== 'hmac-sha256' ||
    value.signature?.version !== 'v1' ||
    value.signature?.toleranceSeconds !== 300 ||
    typeof value.rawBody !== 'string' ||
    typeof value.testSecret !== 'string' ||
    typeof value.timestamp !== 'string' ||
    !Number.isSafeInteger(value.secretVersion) ||
    value.secretVersion <= 0 ||
    headers?.['content-type'] !== 'application/json' ||
    headers?.['user-agent'] !== 'Wathba-Webhooks/1.0' ||
    headers?.['x-wathba-timestamp'] !== value.timestamp ||
    headers?.['x-wathba-signature-version'] !== String(value.secretVersion) ||
    headers?.['x-wathba-event-id'] !== value.event?.eventId ||
    JSON.stringify(value.event) !== value.rawBody
  ) {
    throw new Error(`fixture_webhook_contract_mismatch:${name}`);
  }
  const expectedSignature = `v1=${createHmac('sha256', value.testSecret)
    .update(`${value.timestamp}.${value.rawBody}`)
    .digest('hex')}`;
  if (headers['x-wathba-signature'] !== expectedSignature) {
    throw new Error(`fixture_webhook_signature_mismatch:${name}`);
  }
}
