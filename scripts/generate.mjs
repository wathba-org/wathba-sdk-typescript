import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  readVerifiedFixtureSet,
  readVerifiedOpenApi,
  readVerifiedProtocolSet,
} from './lib/contract-artifacts.mjs';

const checkOnly = process.argv.includes('--check');
const openApiPath = resolve('openapi/wathba-public.openapi.json');
const openapiTypescriptBin = resolve('node_modules/openapi-typescript/bin/cli.js');
const packageManifest = JSON.parse(readFileSync(resolve('package.json'), 'utf8'));
const schemaSource = execFileSync(
  process.execPath,
  [openapiTypescriptBin, openApiPath],
  { encoding: 'utf8' },
);
const [{ document, release }, { fixtureSet }, protocolSet] = await Promise.all([
  readVerifiedOpenApi(),
  readVerifiedFixtureSet(resolve('fixtures/v1')),
  readVerifiedProtocolSet(),
]);
if (release.contractVersion !== fixtureSet.contractVersion) {
  throw new Error('fixture_openapi_contract_version_mismatch');
}
const operationsSource = emitOperations(document);
const sdkRelease = releaseMetadata(packageManifest, release, fixtureSet, protocolSet);
const outputs = {
  'release.json': `${JSON.stringify(sortDeep(sdkRelease), null, 2)}\n`,
  'src/generated/schema.ts': schemaSource,
  'src/generated/operations.ts': operationsSource,
  'src/generated/release.ts': emitRelease(sdkRelease),
  'src/generated/runtime-schemas.ts': emitRuntimeSchemas(document),
};

if (!checkOnly) mkdirSync(resolve('src/generated'), { recursive: true });

const drift = [];
for (const [path, source] of Object.entries(outputs)) {
  if (checkOnly) {
    let current = '';
    try {
      current = readFileSync(resolve(path), 'utf8');
    } catch {
      // Report the missing generated file as drift below.
    }
    if (current !== source) drift.push(path);
  } else {
    writeFileSync(resolve(path), source, 'utf8');
  }
}

if (drift.length > 0) {
  throw new Error(`generated_sdk_drift:${drift.join(',')}`);
}

function emitOperations(openapi) {
  const operations = [];
  const operationIds = new Set();
  for (const path of Object.keys(openapi.paths).sort()) {
    const pathItem = openapi.paths[path];
    for (const method of ['delete', 'get', 'patch', 'post', 'put']) {
      const operation = pathItem[method];
      if (!operation) continue;
      if (typeof operation.operationId !== 'string' || operationIds.has(operation.operationId)) {
        throw new Error(`invalid_or_duplicate_operation_id:${String(operation.operationId)}`);
      }
      operationIds.add(operation.operationId);
      // Payer-public checkout routes are intentionally browser-owned. The server SDK
      // exposes only authenticated member/runtime operations and never becomes a
      // second implementation of the hosted Wathba Checkout client boundary.
      if (operation['x-wathba-audience'] === 'payer_public') continue;
      const requestRef = operation.requestBody?.content?.['application/json']?.schema?.$ref;
      if (operation.requestBody !== undefined && typeof requestRef !== 'string') {
        throw new Error(`unsupported_request_body:${operation.operationId}`);
      }
      const successResponses = Object.fromEntries(
        Object.entries(operation.responses)
          .filter(([status]) => /^2\d\d$/.test(status))
          .sort(([left], [right]) => left.localeCompare(right))
          .map(([status, response]) => {
            const contentType = Object.keys(response.content ?? {}).sort()[0];
            const responseRef = contentType === undefined
              ? undefined
              : response.content[contentType]?.schema?.$ref;
            if (!contentType || !responseRef) {
              throw new Error(`missing_success_schema:${operation.operationId}:${status}`);
            }
            return [status, { contentType, schema: schemaName(responseRef) }];
          }),
      );
      if (Object.keys(successResponses).length === 0) {
        throw new Error(`missing_success_response:${operation.operationId}`);
      }
      const parameters = operation.parameters ?? [];
      const unsupportedParameters = parameters.filter(
        (item) => item.in === 'cookie' || (item.in === 'header' && !['Idempotency-Key', 'Wathba-Version'].includes(item.name)),
      );
      if (unsupportedParameters.length > 0) {
        throw new Error(`unsupported_operation_parameter:${operation.operationId}`);
      }
      const idempotency = operation['x-wathba-idempotency'];
      // Generic catalog/provider execution keeps an operation-defined envelope
      // and is not part of the typed direct-resource SDK surface.
      if (idempotency === 'operation-defined') continue;
      if (idempotency !== 'required' && idempotency !== 'none') {
        throw new Error(`invalid_idempotency_policy:${operation.operationId}`);
      }
      const idempotencyHeader = parameters.find(
        (item) => item.in === 'header' && item.name === 'Idempotency-Key',
      );
      if ((idempotency === 'required') !== (idempotencyHeader?.required === true)) {
        throw new Error(`idempotency_header_mismatch:${operation.operationId}`);
      }
      if (typeof operation['x-wathba-capability'] !== 'string') {
        throw new Error(`missing_capability:${operation.operationId}`);
      }
      const requiredScopes = operation.security?.[0]?.wathbaApiKey;
      if (!Array.isArray(requiredScopes) || requiredScopes.length === 0) {
        throw new Error(`missing_required_scopes:${operation.operationId}`);
      }
      const pathParameters = parameterSpecs(parameters, 'path');
      const queryParameters = parameterSpecs(parameters, 'query');
      const apiVersionHeader = parameters.find(
        (item) => item.in === 'header' && item.name === 'Wathba-Version',
      );
      if (apiVersionHeader !== undefined && apiVersionHeader.schema?.type !== 'string') {
        throw new Error(`unsupported_api_version_parameter:${operation.operationId}`);
      }
      operations.push({
        operationId: operation.operationId,
        method: method.toUpperCase(),
        path,
        capability: operation['x-wathba-capability'],
        idempotency,
        ...(apiVersionHeader?.required === true ? { apiVersionRequired: true } : {}),
        safeProbe: operation['x-wathba-safe-probe'],
        requiredScopes,
        pathParameters,
        queryParameters,
        requestSchema: schemaName(requestRef),
        successResponses,
      });
    }
  }
  operations.sort((left, right) => left.operationId.localeCompare(right.operationId));

  const specs = Object.fromEntries(
    operations.map((operation) => [operation.operationId, operation]),
  );
  const inputEntries = operations.map((operation) => {
    const operationType = `operations[${JSON.stringify(operation.operationId)}]`;
    const fields = [`path: ${operationType}["parameters"]["path"]`];
    if (Object.keys(operation.queryParameters).length > 0) {
      fields.push(`query?: ${operationType}["parameters"]["query"]`);
    }
    if (operation.requestSchema) {
      fields.push(
        `body: NonNullable<${operationType}["requestBody"]>["content"]["application/json"]`,
      );
    }
    if (operation.idempotency === 'required') {
      fields.push('idempotencyKey: IdempotencyKey');
    }
    return `  ${JSON.stringify(operation.operationId)}: { ${fields.join('; ')} };`;
  });
  const responseEntries = operations.map((operation) => {
    const operationType = `operations[${JSON.stringify(operation.operationId)}]`;
    const responses = Object.entries(operation.successResponses).map(
      ([status, response]) =>
        `${operationType}["responses"][${Number(status)}]["content"][${JSON.stringify(response.contentType)}]`,
    );
    return `  ${JSON.stringify(operation.operationId)}: ${responses.join(' | ')};`;
  });

  return `/* This file is generated from the pinned Wathba OpenAPI artifact. */\n` +
    `import type { IdempotencyKey } from '../idempotency.js';\n` +
    `import type { operations } from './schema.js';\n\n` +
    `export const operationSpecs = ${JSON.stringify(specs, null, 2)} as const;\n\n` +
    `export type OperationId = keyof typeof operationSpecs;\n\n` +
    `export interface OperationInputMap {\n${inputEntries.join('\n')}\n}\n\n` +
    `export interface OperationResponseMap {\n${responseEntries.join('\n')}\n}\n`;
}

function parameterSpecs(parameters, location) {
  return Object.fromEntries(
    parameters
      .filter((item) => item.in === location)
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((item) => {
        if (!item.schema) throw new Error(`missing_parameter_schema:${location}:${item.name}`);
        return [item.name, { required: item.required === true, schema: sortDeep(item.schema) }];
      }),
  );
}

function emitRuntimeSchemas(openapi) {
  return `/* This file is generated from the pinned Wathba OpenAPI artifact. */\n` +
    `export const runtimeSchemas = ${JSON.stringify(sortDeep(openapi.components.schemas), null, 2)} as const;\n`;
}

function releaseMetadata(manifest, release, fixtureSet, protocolSet) {
  return {
    schemaVersion: 'wathba.sdk-release.v1',
    sdkPackage: manifest.name,
    sdkVersion: manifest.version,
    contractVersion: release.contractVersion,
    openApiDigest: release.digest,
    fixtureSetDigest: fixtureSet.aggregateDigest,
    protocolVersion: protocolSet.contractSet.protocolVersion,
    protocolSetDigest: protocolSet.setDigest,
    protocolAggregateDigest: protocolSet.contractSet.aggregateDigest,
    generator: {
      name: 'openapi-typescript',
      version: manifest.devDependencies['openapi-typescript'],
    },
  };
}

function emitRelease(metadata) {
  return `/* This file is generated from package and pinned OpenAPI release metadata. */\n` +
    `export const wathbaSdkRelease = ${JSON.stringify(sortDeep(metadata), null, 2)} as const;\n\n` +
    `export type WathbaSdkRelease = typeof wathbaSdkRelease;\n`;
}

function schemaName(ref) {
  return typeof ref === 'string' ? ref.split('/').at(-1) : null;
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
