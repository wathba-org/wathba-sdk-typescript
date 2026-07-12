export type WathbaSdkErrorCode =
  | 'wathba_credential_unavailable'
  | 'wathba_invalid_json_response'
  | 'wathba_invalid_request'
  | 'wathba_invalid_problem_response'
  | 'wathba_invalid_success_response'
  | 'wathba_poll_aborted'
  | 'wathba_unexpected_content_type'
  | 'wathba_undeclared_success_status'
  | 'wathba_transport_unavailable';

export type WathbaSdkBillingEffect = 'none' | 'unknown';

const errorFacts: Readonly<Record<WathbaSdkErrorCode, {
  readonly billingEffect: WathbaSdkBillingEffect;
  readonly retryable: boolean;
}>> = {
  wathba_credential_unavailable: { billingEffect: 'none', retryable: true },
  wathba_invalid_json_response: { billingEffect: 'unknown', retryable: false },
  wathba_invalid_problem_response: { billingEffect: 'unknown', retryable: false },
  wathba_invalid_request: { billingEffect: 'none', retryable: false },
  wathba_invalid_success_response: { billingEffect: 'unknown', retryable: false },
  wathba_poll_aborted: { billingEffect: 'none', retryable: false },
  wathba_transport_unavailable: { billingEffect: 'unknown', retryable: true },
  wathba_undeclared_success_status: { billingEffect: 'unknown', retryable: false },
  wathba_unexpected_content_type: { billingEffect: 'unknown', retryable: false },
};

export class WathbaSdkError extends Error {
  readonly name = 'WathbaSdkError';
  readonly billingEffect: WathbaSdkBillingEffect;
  readonly retryable: boolean;

  constructor(readonly code: WathbaSdkErrorCode) {
    super(code);
    this.billingEffect = errorFacts[code].billingEffect;
    this.retryable = errorFacts[code].retryable;
  }
}
