/* This file is generated from the pinned Wathba OpenAPI artifact. */
import type { IdempotencyKey } from '../idempotency.js';
import type { operations } from './schema.js';

export const operationSpecs = {
  "archivePaymentProduct": {
    "operationId": "archivePaymentProduct",
    "method": "DELETE",
    "path": "/v1/platform/projects/{projectId}/payment-products/{productId}",
    "capability": "payments.checkout",
    "idempotency": "required",
    "safeProbe": "none",
    "requiredScopes": [
      "payments:products:archive"
    ],
    "pathParameters": {
      "productId": {
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
        "schema": "PaymentProduct"
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
    "requestSchema": "CreatePaymentLinkRequest",
    "successResponses": {
      "201": {
        "contentType": "application/json",
        "schema": "PaymentLink"
      }
    }
  },
  "createPaymentProduct": {
    "operationId": "createPaymentProduct",
    "method": "POST",
    "path": "/v1/platform/projects/{projectId}/payment-products",
    "capability": "payments.checkout",
    "idempotency": "required",
    "safeProbe": "none",
    "requiredScopes": [
      "payments:products:create"
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
    "requestSchema": "CreatePaymentProductRequest",
    "successResponses": {
      "201": {
        "contentType": "application/json",
        "schema": "PaymentProduct"
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
      "201": {
        "contentType": "application/json",
        "schema": "PaymentLink"
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
        "schema": "WathbaPayment"
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
        "schema": "PaymentLink"
      }
    }
  },
  "getPaymentProduct": {
    "operationId": "getPaymentProduct",
    "method": "GET",
    "path": "/v1/platform/projects/{projectId}/payment-products/{productId}",
    "capability": "payments.checkout",
    "idempotency": "none",
    "safeProbe": "read_only",
    "requiredScopes": [
      "payments:products:read"
    ],
    "pathParameters": {
      "productId": {
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
        "schema": "PaymentProduct"
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
        "schema": "PaymentRefund"
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
    "queryParameters": {
      "status": {
        "required": false,
        "schema": {
          "enum": [
            "draft",
            "active",
            "inactive",
            "expired",
            "completed",
            "all"
          ],
          "type": "string"
        }
      }
    },
    "requestSchema": null,
    "successResponses": {
      "200": {
        "contentType": "application/json",
        "schema": "PaymentLinkList"
      }
    }
  },
  "listPaymentProducts": {
    "operationId": "listPaymentProducts",
    "method": "GET",
    "path": "/v1/platform/projects/{projectId}/payment-products",
    "capability": "payments.checkout",
    "idempotency": "none",
    "safeProbe": "read_only",
    "requiredScopes": [
      "payments:products:read"
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
      "active": {
        "required": false,
        "schema": {
          "type": "boolean"
        }
      },
      "currency": {
        "required": false,
        "schema": {
          "maxLength": 3,
          "minLength": 3,
          "type": "string"
        }
      },
      "searchTerm": {
        "required": false,
        "schema": {
          "type": "string"
        }
      },
      "visibility": {
        "required": false,
        "schema": {
          "enum": [
            "catalog",
            "link_only",
            "all"
          ],
          "type": "string"
        }
      }
    },
    "requestSchema": null,
    "successResponses": {
      "200": {
        "contentType": "application/json",
        "schema": "PaymentProductList"
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
        "schema": "PaymentRefundList"
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
    "queryParameters": {
      "status": {
        "required": false,
        "schema": {
          "enum": [
            "created",
            "provider_pending",
            "succeeded",
            "failed",
            "unknown",
            "refunded",
            "all"
          ],
          "type": "string"
        }
      }
    },
    "requestSchema": null,
    "successResponses": {
      "200": {
        "contentType": "application/json",
        "schema": "WathbaPaymentList"
      }
    }
  },
  "promotePaymentProduct": {
    "operationId": "promotePaymentProduct",
    "method": "POST",
    "path": "/v1/platform/projects/{projectId}/payment-products/{productId}/promote",
    "capability": "payments.checkout",
    "idempotency": "required",
    "safeProbe": "none",
    "requiredScopes": [
      "payments:products:update"
    ],
    "pathParameters": {
      "productId": {
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
      "201": {
        "contentType": "application/json",
        "schema": "PaymentProduct"
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
    "requestSchema": null,
    "successResponses": {
      "201": {
        "contentType": "application/json",
        "schema": "PaymentLink"
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
    "requestSchema": "RequestPaymentRefund",
    "successResponses": {
      "201": {
        "contentType": "application/json",
        "schema": "PaymentRefund"
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
    "requestSchema": "UpdatePaymentLinkRequest",
    "successResponses": {
      "200": {
        "contentType": "application/json",
        "schema": "PaymentLink"
      }
    }
  },
  "updatePaymentProduct": {
    "operationId": "updatePaymentProduct",
    "method": "PATCH",
    "path": "/v1/platform/projects/{projectId}/payment-products/{productId}",
    "capability": "payments.checkout",
    "idempotency": "required",
    "safeProbe": "none",
    "requiredScopes": [
      "payments:products:update"
    ],
    "pathParameters": {
      "productId": {
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
    "requestSchema": "UpdatePaymentProductRequest",
    "successResponses": {
      "200": {
        "contentType": "application/json",
        "schema": "PaymentProduct"
      }
    }
  }
} as const;

export type OperationId = keyof typeof operationSpecs;

export interface OperationInputMap {
  "archivePaymentProduct": { path: operations["archivePaymentProduct"]["parameters"]["path"]; idempotencyKey: IdempotencyKey };
  "createPaymentLink": { path: operations["createPaymentLink"]["parameters"]["path"]; body: operations["createPaymentLink"]["requestBody"]["content"]["application/json"]; idempotencyKey: IdempotencyKey };
  "createPaymentProduct": { path: operations["createPaymentProduct"]["parameters"]["path"]; body: operations["createPaymentProduct"]["requestBody"]["content"]["application/json"]; idempotencyKey: IdempotencyKey };
  "createShipment": { path: operations["createShipment"]["parameters"]["path"]; body: operations["createShipment"]["requestBody"]["content"]["application/json"]; idempotencyKey: IdempotencyKey };
  "deactivatePaymentLink": { path: operations["deactivatePaymentLink"]["parameters"]["path"]; idempotencyKey: IdempotencyKey };
  "getPayment": { path: operations["getPayment"]["parameters"]["path"] };
  "getPaymentLink": { path: operations["getPaymentLink"]["parameters"]["path"] };
  "getPaymentProduct": { path: operations["getPaymentProduct"]["parameters"]["path"] };
  "getPaymentRefund": { path: operations["getPaymentRefund"]["parameters"]["path"] };
  "getShipmentExecutionStatus": { path: operations["getShipmentExecutionStatus"]["parameters"]["path"] };
  "listPaymentLinks": { path: operations["listPaymentLinks"]["parameters"]["path"]; query?: operations["listPaymentLinks"]["parameters"]["query"] };
  "listPaymentProducts": { path: operations["listPaymentProducts"]["parameters"]["path"]; query?: operations["listPaymentProducts"]["parameters"]["query"] };
  "listPaymentRefunds": { path: operations["listPaymentRefunds"]["parameters"]["path"] };
  "listPayments": { path: operations["listPayments"]["parameters"]["path"]; query?: operations["listPayments"]["parameters"]["query"] };
  "promotePaymentProduct": { path: operations["promotePaymentProduct"]["parameters"]["path"]; idempotencyKey: IdempotencyKey };
  "reactivatePaymentLink": { path: operations["reactivatePaymentLink"]["parameters"]["path"]; idempotencyKey: IdempotencyKey };
  "requestPaymentRefund": { path: operations["requestPaymentRefund"]["parameters"]["path"]; body: operations["requestPaymentRefund"]["requestBody"]["content"]["application/json"]; idempotencyKey: IdempotencyKey };
  "sendOtp": { path: operations["sendOtp"]["parameters"]["path"]; body: operations["sendOtp"]["requestBody"]["content"]["application/json"]; idempotencyKey: IdempotencyKey };
  "updatePaymentLink": { path: operations["updatePaymentLink"]["parameters"]["path"]; body: operations["updatePaymentLink"]["requestBody"]["content"]["application/json"]; idempotencyKey: IdempotencyKey };
  "updatePaymentProduct": { path: operations["updatePaymentProduct"]["parameters"]["path"]; body: operations["updatePaymentProduct"]["requestBody"]["content"]["application/json"]; idempotencyKey: IdempotencyKey };
}

export interface OperationResponseMap {
  "archivePaymentProduct": operations["archivePaymentProduct"]["responses"][200]["content"]["application/json"];
  "createPaymentLink": operations["createPaymentLink"]["responses"][201]["content"]["application/json"];
  "createPaymentProduct": operations["createPaymentProduct"]["responses"][201]["content"]["application/json"];
  "createShipment": operations["createShipment"]["responses"][201]["content"]["application/json"] | operations["createShipment"]["responses"][202]["content"]["application/json"];
  "deactivatePaymentLink": operations["deactivatePaymentLink"]["responses"][201]["content"]["application/json"];
  "getPayment": operations["getPayment"]["responses"][200]["content"]["application/json"];
  "getPaymentLink": operations["getPaymentLink"]["responses"][200]["content"]["application/json"];
  "getPaymentProduct": operations["getPaymentProduct"]["responses"][200]["content"]["application/json"];
  "getPaymentRefund": operations["getPaymentRefund"]["responses"][200]["content"]["application/json"];
  "getShipmentExecutionStatus": operations["getShipmentExecutionStatus"]["responses"][200]["content"]["application/json"];
  "listPaymentLinks": operations["listPaymentLinks"]["responses"][200]["content"]["application/json"];
  "listPaymentProducts": operations["listPaymentProducts"]["responses"][200]["content"]["application/json"];
  "listPaymentRefunds": operations["listPaymentRefunds"]["responses"][200]["content"]["application/json"];
  "listPayments": operations["listPayments"]["responses"][200]["content"]["application/json"];
  "promotePaymentProduct": operations["promotePaymentProduct"]["responses"][201]["content"]["application/json"];
  "reactivatePaymentLink": operations["reactivatePaymentLink"]["responses"][201]["content"]["application/json"];
  "requestPaymentRefund": operations["requestPaymentRefund"]["responses"][201]["content"]["application/json"];
  "sendOtp": operations["sendOtp"]["responses"][201]["content"]["application/json"] | operations["sendOtp"]["responses"][202]["content"]["application/json"];
  "updatePaymentLink": operations["updatePaymentLink"]["responses"][200]["content"]["application/json"];
  "updatePaymentProduct": operations["updatePaymentProduct"]["responses"][200]["content"]["application/json"];
}
