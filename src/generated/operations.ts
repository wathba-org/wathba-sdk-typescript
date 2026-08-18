/* This file is generated from the pinned Wathba OpenAPI artifact. */
import type { IdempotencyKey } from '../idempotency.js';
import type { operations } from './schema.js';

export const operationSpecs = {
  "cancelPaymentIntent": {
    "operationId": "cancelPaymentIntent",
    "method": "POST",
    "path": "/v1/platform/projects/{projectId}/payment-intents/{paymentIntentId}/cancel",
    "capability": "payments.checkout",
    "idempotency": "required",
    "safeProbe": "none",
    "requiredScopes": [
      "payments:intents:cancel"
    ],
    "pathParameters": {
      "paymentIntentId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      },
      "projectId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      }
    },
    "queryParameters": {},
    "requestSchema": "Catalog017CancelPaymentIntentRequest",
    "successResponses": {
      "200": {
        "contentType": "application/json",
        "schema": "Catalog017PaymentIntent"
      }
    }
  },
  "createCheckoutSession": {
    "operationId": "createCheckoutSession",
    "method": "POST",
    "path": "/v1/platform/projects/{projectId}/payment-intents/{paymentIntentId}/checkout-sessions",
    "capability": "payments.checkout",
    "idempotency": "required",
    "safeProbe": "none",
    "requiredScopes": [
      "payments:checkout:create"
    ],
    "pathParameters": {
      "paymentIntentId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      },
      "projectId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      }
    },
    "queryParameters": {},
    "requestSchema": "Catalog017CreateCheckoutSessionRequest",
    "successResponses": {
      "201": {
        "contentType": "application/json",
        "schema": "Catalog017PaymentIntent"
      }
    }
  },
  "createPaymentIntent": {
    "operationId": "createPaymentIntent",
    "method": "POST",
    "path": "/v1/platform/projects/{projectId}/payment-intents",
    "capability": "payments.checkout",
    "idempotency": "required",
    "safeProbe": "none",
    "requiredScopes": [
      "payments:intents:create"
    ],
    "pathParameters": {
      "projectId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      }
    },
    "queryParameters": {},
    "requestSchema": "Catalog017CreatePaymentIntentRequest",
    "successResponses": {
      "201": {
        "contentType": "application/json",
        "schema": "Catalog017PaymentIntent"
      }
    }
  },
  "createPaymentLink": {
    "operationId": "createPaymentLink",
    "method": "POST",
    "path": "/v1/platform/projects/{projectId}/payment-links",
    "capability": "payments.checkout",
    "idempotency": "required",
    "safeProbe": "none",
    "requiredScopes": [
      "payments:links:create"
    ],
    "pathParameters": {
      "projectId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      }
    },
    "queryParameters": {},
    "requestSchema": "Catalog016CreatePaymentLinkRequest",
    "successResponses": {
      "201": {
        "contentType": "application/json",
        "schema": "Catalog016PaymentLink"
      }
    }
  },
  "createShipment": {
    "operationId": "createShipment",
    "method": "POST",
    "path": "/v1/platform/projects/{projectId}/shipments",
    "capability": "logistics.shipping",
    "idempotency": "required",
    "safeProbe": "none",
    "requiredScopes": [
      "shipments:create"
    ],
    "pathParameters": {
      "projectId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      }
    },
    "queryParameters": {},
    "requestSchema": "CreateShipmentRequest",
    "successResponses": {
      "201": {
        "contentType": "application/json",
        "schema": "OperationExecution"
      },
      "202": {
        "contentType": "application/json",
        "schema": "OperationExecution"
      }
    }
  },
  "deactivatePaymentLink": {
    "operationId": "deactivatePaymentLink",
    "method": "POST",
    "path": "/v1/platform/projects/{projectId}/payment-links/{linkId}/deactivate",
    "capability": "payments.checkout",
    "idempotency": "required",
    "safeProbe": "none",
    "requiredScopes": [
      "payments:links:deactivate"
    ],
    "pathParameters": {
      "linkId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      },
      "projectId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      }
    },
    "queryParameters": {},
    "requestSchema": null,
    "successResponses": {
      "200": {
        "contentType": "application/json",
        "schema": "Catalog016PaymentLink"
      }
    }
  },
  "getPayment": {
    "operationId": "getPayment",
    "method": "GET",
    "path": "/v1/platform/projects/{projectId}/payments/{paymentId}",
    "capability": "payments.checkout",
    "idempotency": "none",
    "safeProbe": "read_only",
    "requiredScopes": [
      "payments:records:read"
    ],
    "pathParameters": {
      "paymentId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      },
      "projectId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      }
    },
    "queryParameters": {},
    "requestSchema": null,
    "successResponses": {
      "200": {
        "contentType": "application/json",
        "schema": "Catalog016Payment"
      }
    }
  },
  "getPaymentIntent": {
    "operationId": "getPaymentIntent",
    "method": "GET",
    "path": "/v1/platform/projects/{projectId}/payment-intents/{paymentIntentId}",
    "capability": "payments.checkout",
    "idempotency": "none",
    "safeProbe": "read_only",
    "requiredScopes": [
      "payments:intents:read"
    ],
    "pathParameters": {
      "paymentIntentId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      },
      "projectId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      }
    },
    "queryParameters": {},
    "requestSchema": null,
    "successResponses": {
      "200": {
        "contentType": "application/json",
        "schema": "Catalog017PaymentIntent"
      }
    }
  },
  "getPaymentLink": {
    "operationId": "getPaymentLink",
    "method": "GET",
    "path": "/v1/platform/projects/{projectId}/payment-links/{linkId}",
    "capability": "payments.checkout",
    "idempotency": "none",
    "safeProbe": "read_only",
    "requiredScopes": [
      "payments:links:read"
    ],
    "pathParameters": {
      "linkId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      },
      "projectId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      }
    },
    "queryParameters": {},
    "requestSchema": null,
    "successResponses": {
      "200": {
        "contentType": "application/json",
        "schema": "Catalog016PaymentLink"
      }
    }
  },
  "getPaymentRefund": {
    "operationId": "getPaymentRefund",
    "method": "GET",
    "path": "/v1/platform/projects/{projectId}/refunds/{refundId}",
    "capability": "payments.checkout",
    "idempotency": "none",
    "safeProbe": "read_only",
    "requiredScopes": [
      "payments:refunds:read"
    ],
    "pathParameters": {
      "projectId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      },
      "refundId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      }
    },
    "queryParameters": {},
    "requestSchema": null,
    "successResponses": {
      "200": {
        "contentType": "application/json",
        "schema": "Catalog016Refund"
      }
    }
  },
  "getShipmentExecutionStatus": {
    "operationId": "getShipmentExecutionStatus",
    "method": "GET",
    "path": "/v1/platform/projects/{projectId}/executions/{executionId}",
    "capability": "logistics.shipping",
    "idempotency": "none",
    "safeProbe": "read_only",
    "requiredScopes": [
      "tools:execute"
    ],
    "pathParameters": {
      "executionId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      },
      "projectId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      }
    },
    "queryParameters": {},
    "requestSchema": null,
    "successResponses": {
      "200": {
        "contentType": "application/json",
        "schema": "OperationExecution"
      }
    }
  },
  "listCatalogedProviderOperations": {
    "operationId": "listCatalogedProviderOperations",
    "method": "GET",
    "path": "/v1/cli/capabilities/{serviceCode}/operations",
    "capability": "provider.catalog-runtime",
    "idempotency": "none",
    "safeProbe": "read_only",
    "requiredScopes": [
      "tools:execute"
    ],
    "pathParameters": {
      "serviceCode": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      }
    },
    "queryParameters": {},
    "requestSchema": null,
    "successResponses": {
      "200": {
        "contentType": "application/json",
        "schema": "CliProviderOperationCatalogResponse"
      }
    }
  },
  "listPaymentIntents": {
    "operationId": "listPaymentIntents",
    "method": "GET",
    "path": "/v1/platform/projects/{projectId}/payment-intents",
    "capability": "payments.checkout",
    "idempotency": "none",
    "safeProbe": "read_only",
    "requiredScopes": [
      "payments:intents:read"
    ],
    "pathParameters": {
      "projectId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      }
    },
    "queryParameters": {
      "environmentId": {
        "required": false,
        "schema": {
          "maxLength": 160,
          "minLength": 1,
          "type": "string"
        }
      },
      "status": {
        "required": false,
        "schema": {
          "maxLength": 160,
          "minLength": 1,
          "type": "string"
        }
      }
    },
    "requestSchema": null,
    "successResponses": {
      "200": {
        "contentType": "application/json",
        "schema": "Catalog017PaymentIntentList"
      }
    }
  },
  "listPaymentLinks": {
    "operationId": "listPaymentLinks",
    "method": "GET",
    "path": "/v1/platform/projects/{projectId}/payment-links",
    "capability": "payments.checkout",
    "idempotency": "none",
    "safeProbe": "read_only",
    "requiredScopes": [
      "payments:links:read"
    ],
    "pathParameters": {
      "projectId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      }
    },
    "queryParameters": {},
    "requestSchema": null,
    "successResponses": {
      "200": {
        "contentType": "application/json",
        "schema": "Catalog016PaymentLinkList"
      }
    }
  },
  "listPaymentRefunds": {
    "operationId": "listPaymentRefunds",
    "method": "GET",
    "path": "/v1/platform/projects/{projectId}/payments/{paymentId}/refunds",
    "capability": "payments.checkout",
    "idempotency": "none",
    "safeProbe": "read_only",
    "requiredScopes": [
      "payments:refunds:read"
    ],
    "pathParameters": {
      "paymentId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      },
      "projectId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      }
    },
    "queryParameters": {},
    "requestSchema": null,
    "successResponses": {
      "200": {
        "contentType": "application/json",
        "schema": "Catalog016RefundList"
      }
    }
  },
  "listPayments": {
    "operationId": "listPayments",
    "method": "GET",
    "path": "/v1/platform/projects/{projectId}/payments",
    "capability": "payments.checkout",
    "idempotency": "none",
    "safeProbe": "read_only",
    "requiredScopes": [
      "payments:records:read"
    ],
    "pathParameters": {
      "projectId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      }
    },
    "queryParameters": {},
    "requestSchema": null,
    "successResponses": {
      "200": {
        "contentType": "application/json",
        "schema": "Catalog016PaymentList"
      }
    }
  },
  "listProjectWebhookDeliveries": {
    "operationId": "listProjectWebhookDeliveries",
    "method": "GET",
    "path": "/v1/platform/projects/{projectId}/webhook-deliveries",
    "capability": "platform.member-webhooks",
    "idempotency": "none",
    "safeProbe": "read_only",
    "requiredScopes": [
      "projects:read"
    ],
    "pathParameters": {
      "projectId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      }
    },
    "queryParameters": {
      "deliveryId": {
        "required": false,
        "schema": {
          "type": "string"
        }
      },
      "endpointId": {
        "required": false,
        "schema": {
          "type": "string"
        }
      },
      "limit": {
        "required": false,
        "schema": {
          "default": 50,
          "maximum": 200,
          "minimum": 1,
          "type": "integer"
        }
      },
      "state": {
        "required": false,
        "schema": {
          "enum": [
            "scheduled",
            "dispatched",
            "retry_scheduled",
            "dead_letter",
            "replayed"
          ],
          "type": "string"
        }
      }
    },
    "requestSchema": null,
    "successResponses": {
      "200": {
        "contentType": "application/json",
        "schema": "WebhookDeliveryList"
      }
    }
  },
  "reactivatePaymentLink": {
    "operationId": "reactivatePaymentLink",
    "method": "POST",
    "path": "/v1/platform/projects/{projectId}/payment-links/{linkId}/reactivate",
    "capability": "payments.checkout",
    "idempotency": "required",
    "safeProbe": "none",
    "requiredScopes": [
      "payments:links:update"
    ],
    "pathParameters": {
      "linkId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      },
      "projectId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      }
    },
    "queryParameters": {},
    "requestSchema": "Catalog016ReactivatePaymentLinkRequest",
    "successResponses": {
      "200": {
        "contentType": "application/json",
        "schema": "Catalog016PaymentLink"
      }
    }
  },
  "requestPaymentRefund": {
    "operationId": "requestPaymentRefund",
    "method": "POST",
    "path": "/v1/platform/projects/{projectId}/payments/{paymentId}/refunds",
    "capability": "payments.checkout",
    "idempotency": "required",
    "safeProbe": "none",
    "requiredScopes": [
      "payments:refunds:create"
    ],
    "pathParameters": {
      "paymentId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      },
      "projectId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      }
    },
    "queryParameters": {},
    "requestSchema": "Catalog016RequestPaymentRefund",
    "successResponses": {
      "201": {
        "contentType": "application/json",
        "schema": "Catalog016Refund"
      }
    }
  },
  "sendOtp": {
    "operationId": "sendOtp",
    "method": "POST",
    "path": "/v1/platform/projects/{projectId}/otp/send",
    "capability": "messaging.otp",
    "idempotency": "required",
    "safeProbe": "sandbox_non_spend",
    "requiredScopes": [
      "otp:send"
    ],
    "pathParameters": {
      "projectId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      }
    },
    "queryParameters": {},
    "requestSchema": "SendOtpRequest",
    "successResponses": {
      "201": {
        "contentType": "application/json",
        "schema": "OperationExecution"
      },
      "202": {
        "contentType": "application/json",
        "schema": "OperationExecution"
      }
    }
  },
  "updatePaymentLink": {
    "operationId": "updatePaymentLink",
    "method": "PATCH",
    "path": "/v1/platform/projects/{projectId}/payment-links/{linkId}",
    "capability": "payments.checkout",
    "idempotency": "required",
    "safeProbe": "none",
    "requiredScopes": [
      "payments:links:update"
    ],
    "pathParameters": {
      "linkId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      },
      "projectId": {
        "required": true,
        "schema": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        }
      }
    },
    "queryParameters": {},
    "requestSchema": "Catalog016UpdatePaymentLinkRequest",
    "successResponses": {
      "200": {
        "contentType": "application/json",
        "schema": "Catalog016PaymentLink"
      }
    }
  }
} as const;

export type OperationId = keyof typeof operationSpecs;

export interface OperationInputMap {
  "cancelPaymentIntent": { path: operations["cancelPaymentIntent"]["parameters"]["path"]; body: NonNullable<operations["cancelPaymentIntent"]["requestBody"]>["content"]["application/json"]; idempotencyKey: IdempotencyKey };
  "createCheckoutSession": { path: operations["createCheckoutSession"]["parameters"]["path"]; body: NonNullable<operations["createCheckoutSession"]["requestBody"]>["content"]["application/json"]; idempotencyKey: IdempotencyKey };
  "createPaymentIntent": { path: operations["createPaymentIntent"]["parameters"]["path"]; body: NonNullable<operations["createPaymentIntent"]["requestBody"]>["content"]["application/json"]; idempotencyKey: IdempotencyKey };
  "createPaymentLink": { path: operations["createPaymentLink"]["parameters"]["path"]; body: NonNullable<operations["createPaymentLink"]["requestBody"]>["content"]["application/json"]; idempotencyKey: IdempotencyKey };
  "createShipment": { path: operations["createShipment"]["parameters"]["path"]; body: NonNullable<operations["createShipment"]["requestBody"]>["content"]["application/json"]; idempotencyKey: IdempotencyKey };
  "deactivatePaymentLink": { path: operations["deactivatePaymentLink"]["parameters"]["path"]; idempotencyKey: IdempotencyKey };
  "getPayment": { path: operations["getPayment"]["parameters"]["path"] };
  "getPaymentIntent": { path: operations["getPaymentIntent"]["parameters"]["path"] };
  "getPaymentLink": { path: operations["getPaymentLink"]["parameters"]["path"] };
  "getPaymentRefund": { path: operations["getPaymentRefund"]["parameters"]["path"] };
  "getShipmentExecutionStatus": { path: operations["getShipmentExecutionStatus"]["parameters"]["path"] };
  "listCatalogedProviderOperations": { path: operations["listCatalogedProviderOperations"]["parameters"]["path"] };
  "listPaymentIntents": { path: operations["listPaymentIntents"]["parameters"]["path"]; query?: operations["listPaymentIntents"]["parameters"]["query"] };
  "listPaymentLinks": { path: operations["listPaymentLinks"]["parameters"]["path"] };
  "listPaymentRefunds": { path: operations["listPaymentRefunds"]["parameters"]["path"] };
  "listPayments": { path: operations["listPayments"]["parameters"]["path"] };
  "listProjectWebhookDeliveries": { path: operations["listProjectWebhookDeliveries"]["parameters"]["path"]; query?: operations["listProjectWebhookDeliveries"]["parameters"]["query"] };
  "reactivatePaymentLink": { path: operations["reactivatePaymentLink"]["parameters"]["path"]; body: NonNullable<operations["reactivatePaymentLink"]["requestBody"]>["content"]["application/json"]; idempotencyKey: IdempotencyKey };
  "requestPaymentRefund": { path: operations["requestPaymentRefund"]["parameters"]["path"]; body: NonNullable<operations["requestPaymentRefund"]["requestBody"]>["content"]["application/json"]; idempotencyKey: IdempotencyKey };
  "sendOtp": { path: operations["sendOtp"]["parameters"]["path"]; body: NonNullable<operations["sendOtp"]["requestBody"]>["content"]["application/json"]; idempotencyKey: IdempotencyKey };
  "updatePaymentLink": { path: operations["updatePaymentLink"]["parameters"]["path"]; body: NonNullable<operations["updatePaymentLink"]["requestBody"]>["content"]["application/json"]; idempotencyKey: IdempotencyKey };
}

export interface OperationResponseMap {
  "cancelPaymentIntent": operations["cancelPaymentIntent"]["responses"][200]["content"]["application/json"];
  "createCheckoutSession": operations["createCheckoutSession"]["responses"][201]["content"]["application/json"];
  "createPaymentIntent": operations["createPaymentIntent"]["responses"][201]["content"]["application/json"];
  "createPaymentLink": operations["createPaymentLink"]["responses"][201]["content"]["application/json"];
  "createShipment": operations["createShipment"]["responses"][201]["content"]["application/json"] | operations["createShipment"]["responses"][202]["content"]["application/json"];
  "deactivatePaymentLink": operations["deactivatePaymentLink"]["responses"][200]["content"]["application/json"];
  "getPayment": operations["getPayment"]["responses"][200]["content"]["application/json"];
  "getPaymentIntent": operations["getPaymentIntent"]["responses"][200]["content"]["application/json"];
  "getPaymentLink": operations["getPaymentLink"]["responses"][200]["content"]["application/json"];
  "getPaymentRefund": operations["getPaymentRefund"]["responses"][200]["content"]["application/json"];
  "getShipmentExecutionStatus": operations["getShipmentExecutionStatus"]["responses"][200]["content"]["application/json"];
  "listCatalogedProviderOperations": operations["listCatalogedProviderOperations"]["responses"][200]["content"]["application/json"];
  "listPaymentIntents": operations["listPaymentIntents"]["responses"][200]["content"]["application/json"];
  "listPaymentLinks": operations["listPaymentLinks"]["responses"][200]["content"]["application/json"];
  "listPaymentRefunds": operations["listPaymentRefunds"]["responses"][200]["content"]["application/json"];
  "listPayments": operations["listPayments"]["responses"][200]["content"]["application/json"];
  "listProjectWebhookDeliveries": operations["listProjectWebhookDeliveries"]["responses"][200]["content"]["application/json"];
  "reactivatePaymentLink": operations["reactivatePaymentLink"]["responses"][200]["content"]["application/json"];
  "requestPaymentRefund": operations["requestPaymentRefund"]["responses"][201]["content"]["application/json"];
  "sendOtp": operations["sendOtp"]["responses"][201]["content"]["application/json"] | operations["sendOtp"]["responses"][202]["content"]["application/json"];
  "updatePaymentLink": operations["updatePaymentLink"]["responses"][200]["content"]["application/json"];
}
