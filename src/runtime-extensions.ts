import type { IdempotencyKey } from './idempotency.js';
import type { OperationResponseMap } from './generated/operations.js';

/**
 * Runtime operations released after the frozen public OpenAPI contract.
 *
 * These stay explicit and typed instead of mutating the 2026.07.mvp.005
 * artifact. The owning capability bundle remains the authority for exposing
 * the operation, while the SDK validates the dedicated compatibility doorway
 * used by member applications.
 */
export const runtimeExtensionOperationSpecs = {
  verifyOtp: {
    operationId: 'verifyOtp',
    method: 'POST',
    path: '/v1/platform/projects/{projectId}/otp/verify',
    capability: 'messaging.otp',
    idempotency: 'required',
    safeProbe: 'sandbox_non_spend',
    requiredScopes: ['otp:verify'],
    pathParameters: {
      projectId: {
        required: true,
        schema: {
          maxLength: 160,
          minLength: 3,
          type: 'string',
        },
      },
    },
    queryParameters: {},
    requestSchema: null,
    requestJsonSchema: {
      additionalProperties: false,
      properties: {
        environmentId: {
          maxLength: 160,
          minLength: 3,
          type: 'string',
        },
        email: {
          format: 'email',
          type: 'string',
        },
        otp: {
          maxLength: 16,
          minLength: 4,
          type: 'string',
        },
      },
      required: ['environmentId', 'email', 'otp'],
      type: 'object',
    },
    successResponses: {
      '201': {
        contentType: 'application/json',
        schema: 'OperationExecution',
      },
      '202': {
        contentType: 'application/json',
        schema: 'OperationExecution',
      },
    },
  },
} as const;

export type RuntimeExtensionOperationId =
  keyof typeof runtimeExtensionOperationSpecs;

export interface RuntimeExtensionOperationInputMap {
  readonly verifyOtp: {
    readonly path: {
      readonly projectId: string;
    };
    readonly body: {
      readonly environmentId: string;
      readonly email: string;
      readonly otp: string;
    };
    readonly idempotencyKey: IdempotencyKey;
  };
}

export interface RuntimeExtensionOperationResponseMap {
  readonly verifyOtp: OperationResponseMap['sendOtp'];
}
