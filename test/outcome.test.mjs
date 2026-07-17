import assert from 'node:assert/strict';
import test from 'node:test';
import {
  WathbaApiError,
  captureWathbaOutcome,
  classifyOperationExecution,
  pollWathbaOutcome,
} from '@wathba/sdk';

const actionRef = {
  protocolVersion: '1.0',
  owner: 'billing_wallet',
  actionCode: 'approve_spend_cap',
  actionId: 'act_sdk_001',
  projectId: 'prj_sdk_001',
  environmentId: 'env_sdk_001',
  capabilityCode: 'payments.checkout',
  sourceRef: 'cap_sdk_001',
  sourceVersion: 1,
  ownerState: 'pending_external',
  reasonCode: 'spend_cap_approval_required',
  allowedDecisions: ['approve', 'deny'],
  copyKeys: {
    title: 'payments.cap.title',
    summary: 'payments.cap.summary',
    consequence: 'payments.cap.consequence',
  },
  safeCostCapSummary: {
    costClass: 'spend_possible',
    summaryKey: 'payments.cap.cost',
    capCode: 'payment_monthly_sar',
    capValue: 500,
    capUnit: 'SAR',
  },
  inputClassification: 'member_safe',
  freshness: 'browser_fresh',
  expiresAt: '2027-07-12T10:00:00.000Z',
  readOperationId: 'getSpendCapAction',
  decideOperationId: 'decideSpendCapAction',
  statusOperationId: 'getSpendCapActionStatus',
  browserUrl:
    'https://platformdev.wathba.info/app/projects/prj_sdk_001/integrations/actions/act_sdk_001',
  resumeRef: 'resume_sdk_001',
  cancellation: 'allowed_before_decision',
};

test('captureWathbaOutcome returns a typed action without retrying a mutation', async () => {
  let attempts = 0;
  const outcome = await captureWathbaOutcome(async () => {
    attempts += 1;
    throw new WathbaApiError({
      type: 'https://api.wathba.info/problems/action-required',
      title: 'Member action required',
      status: 409,
      code: 'action_required',
      correlationId: 'corr_sdk_action_001',
      retryable: false,
      billingEffect: 'none',
      actionRef,
    });
  });

  assert.equal(attempts, 1);
  assert.equal(outcome.kind, 'action_required');
  assert.deepEqual(outcome.actionRef, actionRef);
  assert.equal(outcome.correlationId, 'corr_sdk_action_001');
});

test('operation execution classification polls only genuinely pending work', () => {
  assert.equal(
    classifyOperationExecution({ state: 'pending' }),
    'pending',
  );
  assert.equal(
    classifyOperationExecution({ state: 'blocked' }),
    'final',
  );
  assert.equal(
    classifyOperationExecution({ state: 'succeeded' }),
    'final',
  );
});

test('a globally disabled execution is a terminal blocked outcome', async () => {
  const execution = {
    state: 'blocked',
    message: 'service_globally_disabled',
  };

  const outcome = await captureWathbaOutcome(
    async () => execution,
    classifyOperationExecution,
  );

  assert.deepEqual(outcome, { kind: 'final', value: execution });
});

test('safe polling repeats only pending reads and stops on the first final result', async () => {
  let reads = 0;
  const result = await pollWathbaOutcome(
    async () => {
      reads += 1;
      return reads === 1
        ? { kind: 'pending', value: { state: 'provider_pending' } }
        : { kind: 'final', value: { state: 'succeeded' } };
    },
    { maximumAttempts: 3, delayMs: 0 },
  );

  assert.equal(reads, 2);
  assert.deepEqual(result, { kind: 'final', value: { state: 'succeeded' } });
});
