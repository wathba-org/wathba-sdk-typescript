/* This file is generated from the pinned Wathba OpenAPI artifact. */
export const runtimeSchemas = {
  "AuthentaOtpResult": {
    "additionalProperties": false,
    "properties": {
      "deliveryMethod": {
        "const": "email",
        "type": "string"
      }
    },
    "required": [
      "deliveryMethod"
    ],
    "type": "object"
  },
  "Catalog016CreatePaymentLinkRequest": {
    "additionalProperties": false,
    "properties": {
      "amountMinor": {
        "maximum": 1000000,
        "minimum": 1,
        "type": "integer"
      },
      "checkoutDescription": {
        "maxLength": 2000,
        "type": "string"
      },
      "checkoutTitle": {
        "maxLength": 240,
        "minLength": 1,
        "type": "string"
      },
      "currency": {
        "const": "SAR",
        "type": "string"
      },
      "environmentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "failureRedirectUrl": {
        "format": "uri",
        "type": "string"
      },
      "humanApprovalGrantId": {
        "maxLength": 160,
        "pattern": "^supg_[A-Za-z0-9_-]{1,155}$",
        "type": "string"
      },
      "items": {
        "items": {
          "additionalProperties": false,
          "properties": {
            "currency": {
              "const": "SAR",
              "type": "string"
            },
            "description": {
              "anyOf": [
                {
                  "maxLength": 2000,
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "name": {
              "maxLength": 240,
              "minLength": 1,
              "type": "string"
            },
            "quantity": {
              "maximum": 100,
              "minimum": 1,
              "type": "integer"
            },
            "unitAmountMinor": {
              "maximum": 1000000,
              "minimum": 1,
              "type": "integer"
            }
          },
          "required": [
            "name",
            "quantity",
            "unitAmountMinor",
            "currency"
          ],
          "type": "object"
        },
        "maxItems": 20,
        "minItems": 1,
        "type": "array"
      },
      "merchantDisplayName": {
        "maxLength": 240,
        "minLength": 1,
        "type": "string"
      },
      "orderReference": {
        "maxLength": 160,
        "type": "string"
      },
      "successRedirectUrl": {
        "format": "uri",
        "type": "string"
      },
      "validUntil": {
        "anyOf": [
          {
            "format": "date-time",
            "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      }
    },
    "required": [
      "environmentId",
      "amountMinor",
      "currency",
      "items",
      "humanApprovalGrantId"
    ],
    "type": "object"
  },
  "Catalog016Payment": {
    "additionalProperties": false,
    "properties": {
      "amountMinor": {
        "maximum": 1000000,
        "minimum": 1,
        "type": "integer"
      },
      "attemptId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "createdAt": {
        "format": "date-time",
        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
        "type": "string"
      },
      "currency": {
        "const": "SAR",
        "type": "string"
      },
      "environmentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "failedAt": {
        "anyOf": [
          {
            "format": "date-time",
            "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "linkId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "methodFamily": {
        "anyOf": [
          {
            "maxLength": 80,
            "minLength": 1,
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "orderReference": {
        "anyOf": [
          {
            "maxLength": 160,
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "paymentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "projectId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "refundedAt": {
        "anyOf": [
          {
            "format": "date-time",
            "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "status": {
        "enum": [
          "created",
          "provider_pending",
          "succeeded",
          "failed",
          "unknown",
          "refunded"
        ],
        "type": "string"
      },
      "succeededAt": {
        "anyOf": [
          {
            "format": "date-time",
            "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "updatedAt": {
        "format": "date-time",
        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
        "type": "string"
      }
    },
    "required": [
      "paymentId",
      "projectId",
      "environmentId",
      "linkId",
      "attemptId",
      "status",
      "amountMinor",
      "currency",
      "methodFamily",
      "orderReference",
      "createdAt",
      "updatedAt",
      "succeededAt",
      "failedAt",
      "refundedAt"
    ],
    "type": "object"
  },
  "Catalog016PaymentLink": {
    "additionalProperties": false,
    "properties": {
      "amountMinor": {
        "maximum": 1000000,
        "minimum": 1,
        "type": "integer"
      },
      "attempts": {
        "items": {
          "additionalProperties": false,
          "properties": {
            "amountMinor": {
              "maximum": 1000000,
              "minimum": 1,
              "type": "integer"
            },
            "attemptId": {
              "maxLength": 160,
              "minLength": 3,
              "type": "string"
            },
            "createdAt": {
              "format": "date-time",
              "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
              "type": "string"
            },
            "currency": {
              "const": "SAR",
              "type": "string"
            },
            "paidAt": {
              "anyOf": [
                {
                  "format": "date-time",
                  "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "status": {
              "enum": [
                "created",
                "checkout_started",
                "provider_pending",
                "paid",
                "failed",
                "unknown",
                "cancelled"
              ],
              "type": "string"
            },
            "updatedAt": {
              "format": "date-time",
              "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
              "type": "string"
            }
          },
          "required": [
            "attemptId",
            "status",
            "amountMinor",
            "currency",
            "createdAt",
            "updatedAt",
            "paidAt"
          ],
          "type": "object"
        },
        "maxItems": 20,
        "type": "array"
      },
      "createdAt": {
        "format": "date-time",
        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
        "type": "string"
      },
      "currency": {
        "const": "SAR",
        "type": "string"
      },
      "description": {
        "anyOf": [
          {
            "maxLength": 2000,
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "display": {
        "additionalProperties": false,
        "properties": {
          "checkoutDescription": {
            "anyOf": [
              {
                "maxLength": 2000,
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "checkoutTitle": {
            "maxLength": 240,
            "minLength": 1,
            "type": "string"
          },
          "merchantDisplayName": {
            "maxLength": 240,
            "minLength": 1,
            "type": "string"
          },
          "merchantLogoUrl": {
            "anyOf": [
              {
                "format": "uri",
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "orderReference": {
            "anyOf": [
              {
                "maxLength": 160,
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          }
        },
        "required": [
          "merchantDisplayName",
          "merchantLogoUrl",
          "checkoutTitle",
          "checkoutDescription",
          "orderReference"
        ],
        "type": "object"
      },
      "environmentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "items": {
        "items": {
          "additionalProperties": false,
          "properties": {
            "currency": {
              "const": "SAR",
              "type": "string"
            },
            "description": {
              "anyOf": [
                {
                  "maxLength": 2000,
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "lineTotalMinor": {
              "maximum": 1000000,
              "minimum": 1,
              "type": "integer"
            },
            "name": {
              "maxLength": 240,
              "minLength": 1,
              "type": "string"
            },
            "quantity": {
              "maximum": 100,
              "minimum": 1,
              "type": "integer"
            },
            "unitAmountMinor": {
              "maximum": 1000000,
              "minimum": 1,
              "type": "integer"
            }
          },
          "required": [
            "name",
            "description",
            "quantity",
            "unitAmountMinor",
            "currency",
            "lineTotalMinor"
          ],
          "type": "object"
        },
        "maxItems": 20,
        "minItems": 1,
        "type": "array"
      },
      "linkId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "maxSuccessfulPayments": {
        "const": 1,
        "type": "number"
      },
      "projectId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "publicUrl": {
        "maxLength": 512,
        "minLength": 6,
        "pattern": "^\\/pay\\/[^/?#]+$",
        "type": "string"
      },
      "redirects": {
        "additionalProperties": false,
        "properties": {
          "failureRedirectUrl": {
            "anyOf": [
              {
                "format": "uri",
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "successRedirectUrl": {
            "anyOf": [
              {
                "format": "uri",
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          }
        },
        "required": [
          "successRedirectUrl",
          "failureRedirectUrl"
        ],
        "type": "object"
      },
      "serviceCode": {
        "const": "payments.moyasar",
        "type": "string"
      },
      "status": {
        "enum": [
          "draft",
          "active",
          "inactive",
          "expired",
          "completed"
        ],
        "type": "string"
      },
      "successfulPaymentCount": {
        "maximum": 1,
        "minimum": 0,
        "type": "integer"
      },
      "updatedAt": {
        "format": "date-time",
        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
        "type": "string"
      },
      "validUntil": {
        "anyOf": [
          {
            "format": "date-time",
            "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      }
    },
    "required": [
      "linkId",
      "projectId",
      "environmentId",
      "serviceCode",
      "status",
      "amountMinor",
      "currency",
      "description",
      "display",
      "redirects",
      "items",
      "publicUrl",
      "validUntil",
      "maxSuccessfulPayments",
      "successfulPaymentCount",
      "createdAt",
      "updatedAt",
      "attempts"
    ],
    "type": "object"
  },
  "Catalog016PaymentLinkList": {
    "items": {
      "additionalProperties": false,
      "properties": {
        "amountMinor": {
          "maximum": 1000000,
          "minimum": 1,
          "type": "integer"
        },
        "attempts": {
          "items": {
            "additionalProperties": false,
            "properties": {
              "amountMinor": {
                "maximum": 1000000,
                "minimum": 1,
                "type": "integer"
              },
              "attemptId": {
                "maxLength": 160,
                "minLength": 3,
                "type": "string"
              },
              "createdAt": {
                "format": "date-time",
                "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
                "type": "string"
              },
              "currency": {
                "const": "SAR",
                "type": "string"
              },
              "paidAt": {
                "anyOf": [
                  {
                    "format": "date-time",
                    "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "status": {
                "enum": [
                  "created",
                  "checkout_started",
                  "provider_pending",
                  "paid",
                  "failed",
                  "unknown",
                  "cancelled"
                ],
                "type": "string"
              },
              "updatedAt": {
                "format": "date-time",
                "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
                "type": "string"
              }
            },
            "required": [
              "attemptId",
              "status",
              "amountMinor",
              "currency",
              "createdAt",
              "updatedAt",
              "paidAt"
            ],
            "type": "object"
          },
          "maxItems": 20,
          "type": "array"
        },
        "createdAt": {
          "format": "date-time",
          "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
          "type": "string"
        },
        "currency": {
          "const": "SAR",
          "type": "string"
        },
        "description": {
          "anyOf": [
            {
              "maxLength": 2000,
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "display": {
          "additionalProperties": false,
          "properties": {
            "checkoutDescription": {
              "anyOf": [
                {
                  "maxLength": 2000,
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "checkoutTitle": {
              "maxLength": 240,
              "minLength": 1,
              "type": "string"
            },
            "merchantDisplayName": {
              "maxLength": 240,
              "minLength": 1,
              "type": "string"
            },
            "merchantLogoUrl": {
              "anyOf": [
                {
                  "format": "uri",
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "orderReference": {
              "anyOf": [
                {
                  "maxLength": 160,
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "merchantDisplayName",
            "merchantLogoUrl",
            "checkoutTitle",
            "checkoutDescription",
            "orderReference"
          ],
          "type": "object"
        },
        "environmentId": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        },
        "items": {
          "items": {
            "additionalProperties": false,
            "properties": {
              "currency": {
                "const": "SAR",
                "type": "string"
              },
              "description": {
                "anyOf": [
                  {
                    "maxLength": 2000,
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "lineTotalMinor": {
                "maximum": 1000000,
                "minimum": 1,
                "type": "integer"
              },
              "name": {
                "maxLength": 240,
                "minLength": 1,
                "type": "string"
              },
              "quantity": {
                "maximum": 100,
                "minimum": 1,
                "type": "integer"
              },
              "unitAmountMinor": {
                "maximum": 1000000,
                "minimum": 1,
                "type": "integer"
              }
            },
            "required": [
              "name",
              "description",
              "quantity",
              "unitAmountMinor",
              "currency",
              "lineTotalMinor"
            ],
            "type": "object"
          },
          "maxItems": 20,
          "minItems": 1,
          "type": "array"
        },
        "linkId": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        },
        "maxSuccessfulPayments": {
          "const": 1,
          "type": "number"
        },
        "projectId": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        },
        "publicUrl": {
          "maxLength": 512,
          "minLength": 6,
          "pattern": "^\\/pay\\/[^/?#]+$",
          "type": "string"
        },
        "redirects": {
          "additionalProperties": false,
          "properties": {
            "failureRedirectUrl": {
              "anyOf": [
                {
                  "format": "uri",
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "successRedirectUrl": {
              "anyOf": [
                {
                  "format": "uri",
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "successRedirectUrl",
            "failureRedirectUrl"
          ],
          "type": "object"
        },
        "serviceCode": {
          "const": "payments.moyasar",
          "type": "string"
        },
        "status": {
          "enum": [
            "draft",
            "active",
            "inactive",
            "expired",
            "completed"
          ],
          "type": "string"
        },
        "successfulPaymentCount": {
          "maximum": 1,
          "minimum": 0,
          "type": "integer"
        },
        "updatedAt": {
          "format": "date-time",
          "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
          "type": "string"
        },
        "validUntil": {
          "anyOf": [
            {
              "format": "date-time",
              "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        }
      },
      "required": [
        "linkId",
        "projectId",
        "environmentId",
        "serviceCode",
        "status",
        "amountMinor",
        "currency",
        "description",
        "display",
        "redirects",
        "items",
        "publicUrl",
        "validUntil",
        "maxSuccessfulPayments",
        "successfulPaymentCount",
        "createdAt",
        "updatedAt",
        "attempts"
      ],
      "type": "object"
    },
    "type": "array"
  },
  "Catalog016PaymentList": {
    "items": {
      "additionalProperties": false,
      "properties": {
        "amountMinor": {
          "maximum": 1000000,
          "minimum": 1,
          "type": "integer"
        },
        "attemptId": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        },
        "createdAt": {
          "format": "date-time",
          "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
          "type": "string"
        },
        "currency": {
          "const": "SAR",
          "type": "string"
        },
        "environmentId": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        },
        "failedAt": {
          "anyOf": [
            {
              "format": "date-time",
              "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "linkId": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        },
        "methodFamily": {
          "anyOf": [
            {
              "maxLength": 80,
              "minLength": 1,
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "orderReference": {
          "anyOf": [
            {
              "maxLength": 160,
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "paymentId": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        },
        "projectId": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        },
        "refundedAt": {
          "anyOf": [
            {
              "format": "date-time",
              "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "status": {
          "enum": [
            "created",
            "provider_pending",
            "succeeded",
            "failed",
            "unknown",
            "refunded"
          ],
          "type": "string"
        },
        "succeededAt": {
          "anyOf": [
            {
              "format": "date-time",
              "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "updatedAt": {
          "format": "date-time",
          "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
          "type": "string"
        }
      },
      "required": [
        "paymentId",
        "projectId",
        "environmentId",
        "linkId",
        "attemptId",
        "status",
        "amountMinor",
        "currency",
        "methodFamily",
        "orderReference",
        "createdAt",
        "updatedAt",
        "succeededAt",
        "failedAt",
        "refundedAt"
      ],
      "type": "object"
    },
    "type": "array"
  },
  "Catalog016PaymentPageHtml": {
    "type": "string"
  },
  "Catalog016PublicAttemptStatus": {
    "additionalProperties": false,
    "properties": {
      "amountMinor": {
        "maximum": 1000000,
        "minimum": 1,
        "type": "integer"
      },
      "attemptId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "attemptStatus": {
        "enum": [
          "created",
          "checkout_started",
          "provider_pending",
          "paid",
          "failed",
          "unknown",
          "cancelled"
        ],
        "type": "string"
      },
      "currency": {
        "const": "SAR",
        "type": "string"
      },
      "failed": {
        "type": "boolean"
      },
      "linkId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "linkStatus": {
        "enum": [
          "draft",
          "active",
          "inactive",
          "expired",
          "completed"
        ],
        "type": "string"
      },
      "message": {
        "maxLength": 240,
        "minLength": 1,
        "type": "string"
      },
      "paid": {
        "type": "boolean"
      },
      "redirect": {
        "additionalProperties": false,
        "properties": {
          "kind": {
            "anyOf": [
              {
                "enum": [
                  "success",
                  "failure"
                ],
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "url": {
            "anyOf": [
              {
                "format": "uri",
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          }
        },
        "required": [
          "kind",
          "url"
        ],
        "type": "object"
      }
    },
    "required": [
      "linkId",
      "attemptId",
      "linkStatus",
      "attemptStatus",
      "amountMinor",
      "currency",
      "paid",
      "failed",
      "redirect",
      "message"
    ],
    "type": "object"
  },
  "Catalog016PublicCheckout": {
    "additionalProperties": false,
    "properties": {
      "attemptId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "message": {
        "maxLength": 240,
        "minLength": 1,
        "type": "string"
      },
      "paymentUrl": {
        "anyOf": [
          {
            "format": "uri",
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "status": {
        "enum": [
          "provider_pending",
          "unknown",
          "failed",
          "blocked"
        ],
        "type": "string"
      }
    },
    "required": [
      "attemptId",
      "status",
      "paymentUrl",
      "message"
    ],
    "type": "object"
  },
  "Catalog016PublicCheckoutRequest": {
    "additionalProperties": false,
    "properties": {
      "token": {
        "maxLength": 206,
        "pattern": "^token_[A-Za-z0-9_-]{8,200}$",
        "type": "string"
      }
    },
    "required": [
      "token"
    ],
    "type": "object"
  },
  "Catalog016ReactivatePaymentLinkRequest": {
    "additionalProperties": false,
    "properties": {
      "humanApprovalGrantId": {
        "maxLength": 160,
        "pattern": "^supg_[A-Za-z0-9_-]{1,155}$",
        "type": "string"
      }
    },
    "type": "object"
  },
  "Catalog016Refund": {
    "additionalProperties": false,
    "properties": {
      "amountMinor": {
        "maximum": 1000000,
        "minimum": 1,
        "type": "integer"
      },
      "createdAt": {
        "format": "date-time",
        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
        "type": "string"
      },
      "currency": {
        "const": "SAR",
        "type": "string"
      },
      "environmentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "failedAt": {
        "anyOf": [
          {
            "format": "date-time",
            "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "paymentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "projectId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "reason": {
        "anyOf": [
          {
            "maxLength": 1000,
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "refundId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "status": {
        "enum": [
          "requested",
          "provider_pending",
          "succeeded",
          "failed",
          "unknown",
          "cancelled"
        ],
        "type": "string"
      },
      "succeededAt": {
        "anyOf": [
          {
            "format": "date-time",
            "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "unknownAt": {
        "anyOf": [
          {
            "format": "date-time",
            "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "updatedAt": {
        "format": "date-time",
        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
        "type": "string"
      }
    },
    "required": [
      "refundId",
      "projectId",
      "environmentId",
      "paymentId",
      "status",
      "amountMinor",
      "currency",
      "reason",
      "createdAt",
      "updatedAt",
      "succeededAt",
      "failedAt",
      "unknownAt"
    ],
    "type": "object"
  },
  "Catalog016RefundList": {
    "items": {
      "additionalProperties": false,
      "properties": {
        "amountMinor": {
          "maximum": 1000000,
          "minimum": 1,
          "type": "integer"
        },
        "createdAt": {
          "format": "date-time",
          "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
          "type": "string"
        },
        "currency": {
          "const": "SAR",
          "type": "string"
        },
        "environmentId": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        },
        "failedAt": {
          "anyOf": [
            {
              "format": "date-time",
              "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "paymentId": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        },
        "projectId": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        },
        "reason": {
          "anyOf": [
            {
              "maxLength": 1000,
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "refundId": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        },
        "status": {
          "enum": [
            "requested",
            "provider_pending",
            "succeeded",
            "failed",
            "unknown",
            "cancelled"
          ],
          "type": "string"
        },
        "succeededAt": {
          "anyOf": [
            {
              "format": "date-time",
              "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "unknownAt": {
          "anyOf": [
            {
              "format": "date-time",
              "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "updatedAt": {
          "format": "date-time",
          "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
          "type": "string"
        }
      },
      "required": [
        "refundId",
        "projectId",
        "environmentId",
        "paymentId",
        "status",
        "amountMinor",
        "currency",
        "reason",
        "createdAt",
        "updatedAt",
        "succeededAt",
        "failedAt",
        "unknownAt"
      ],
      "type": "object"
    },
    "type": "array"
  },
  "Catalog016RequestPaymentRefund": {
    "additionalProperties": false,
    "properties": {
      "humanApprovalGrantId": {
        "description": "Required for a fresh refund request. It may be omitted only when replaying the exact same logical refund with the same Idempotency-Key and Wathba has persisted historical approval evidence.",
        "maxLength": 160,
        "pattern": "^supg_[A-Za-z0-9_-]{1,155}$",
        "type": "string"
      },
      "reason": {
        "maxLength": 1000,
        "type": "string"
      }
    },
    "type": "object"
  },
  "Catalog016UpdatePaymentLinkRequest": {
    "additionalProperties": false,
    "properties": {
      "checkoutDescription": {
        "anyOf": [
          {
            "maxLength": 2000,
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "checkoutTitle": {
        "anyOf": [
          {
            "maxLength": 240,
            "minLength": 1,
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "failureRedirectUrl": {
        "anyOf": [
          {
            "format": "uri",
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "merchantDisplayName": {
        "anyOf": [
          {
            "maxLength": 240,
            "minLength": 1,
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "orderReference": {
        "anyOf": [
          {
            "maxLength": 160,
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "successRedirectUrl": {
        "anyOf": [
          {
            "format": "uri",
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      }
    },
    "type": "object"
  },
  "Catalog017ApplePayMerchantSession": {
    "additionalProperties": true,
    "description": "Opaque Apple merchant-session payload returned only to the same-origin Wathba payer page.",
    "type": "object"
  },
  "Catalog017ApplePayMerchantSessionRequest": {
    "additionalProperties": false,
    "properties": {
      "validationUrl": {
        "maxLength": 512,
        "minLength": 1,
        "type": "string"
      }
    },
    "required": [
      "validationUrl"
    ],
    "type": "object"
  },
  "Catalog017CancelPaymentIntentRequest": {
    "additionalProperties": false,
    "properties": {
      "reason": {
        "anyOf": [
          {
            "maxLength": 500,
            "minLength": 1,
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      }
    },
    "type": "object"
  },
  "Catalog017CheckoutHtml": {
    "type": "string"
  },
  "Catalog017CheckoutSessionExchange": {
    "additionalProperties": false,
    "properties": {
      "expiresAt": {
        "format": "date-time",
        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
        "type": "string"
      },
      "sessionId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "status": {
        "const": "ready",
        "type": "string"
      }
    },
    "required": [
      "sessionId",
      "status",
      "expiresAt"
    ],
    "type": "object"
  },
  "Catalog017CheckoutSubmission": {
    "additionalProperties": false,
    "properties": {
      "action": {
        "anyOf": [
          {
            "anyOf": [
              {
                "additionalProperties": false,
                "properties": {
                  "kind": {
                    "const": "redirect",
                    "type": "string"
                  },
                  "url": {
                    "format": "uri",
                    "type": "string"
                  }
                },
                "required": [
                  "kind",
                  "url"
                ],
                "type": "object"
              },
              {
                "additionalProperties": false,
                "properties": {
                  "kind": {
                    "const": "stc_pay_otp",
                    "type": "string"
                  }
                },
                "required": [
                  "kind"
                ],
                "type": "object"
              }
            ]
          },
          {
            "type": "null"
          }
        ]
      },
      "message": {
        "maxLength": 240,
        "minLength": 1,
        "type": "string"
      },
      "paymentIntentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "sessionId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "status": {
        "enum": [
          "processing",
          "requires_action",
          "succeeded",
          "failed",
          "unknown"
        ],
        "type": "string"
      }
    },
    "required": [
      "sessionId",
      "paymentIntentId",
      "status",
      "action",
      "message"
    ],
    "type": "object"
  },
  "Catalog017ConfirmCheckoutStcPayRequest": {
    "additionalProperties": false,
    "properties": {
      "otp": {
        "pattern": "^\\d{4,8}$",
        "type": "string"
      }
    },
    "required": [
      "otp"
    ],
    "type": "object"
  },
  "Catalog017CreateCheckoutSessionRequest": {
    "additionalProperties": false,
    "properties": {
      "clientBinding": {
        "oneOf": [
          {
            "additionalProperties": false,
            "properties": {
              "kind": {
                "const": "web_origin",
                "type": "string"
              },
              "value": {
                "format": "uri",
                "maxLength": 255,
                "type": "string"
              }
            },
            "required": [
              "kind",
              "value"
            ],
            "type": "object"
          },
          {
            "additionalProperties": false,
            "properties": {
              "kind": {
                "const": "ios_app",
                "type": "string"
              },
              "value": {
                "maxLength": 255,
                "minLength": 3,
                "type": "string"
              }
            },
            "required": [
              "kind",
              "value"
            ],
            "type": "object"
          },
          {
            "additionalProperties": false,
            "properties": {
              "kind": {
                "const": "android_app",
                "type": "string"
              },
              "value": {
                "maxLength": 255,
                "minLength": 3,
                "type": "string"
              }
            },
            "required": [
              "kind",
              "value"
            ],
            "type": "object"
          }
        ]
      }
    },
    "required": [
      "clientBinding"
    ],
    "type": "object"
  },
  "Catalog017CreatePaymentIntentRequest": {
    "additionalProperties": false,
    "properties": {
      "allowedPaymentMethods": {
        "items": {
          "enum": [
            "card",
            "apple_pay",
            "stc_pay",
            "samsung_pay"
          ],
          "type": "string"
        },
        "maxItems": 4,
        "minItems": 1,
        "type": "array"
      },
      "amountMinor": {
        "maximum": 100000000,
        "minimum": 100,
        "type": "integer"
      },
      "clientBinding": {
        "oneOf": [
          {
            "additionalProperties": false,
            "properties": {
              "kind": {
                "const": "web_origin",
                "type": "string"
              },
              "value": {
                "format": "uri",
                "maxLength": 255,
                "type": "string"
              }
            },
            "required": [
              "kind",
              "value"
            ],
            "type": "object"
          },
          {
            "additionalProperties": false,
            "properties": {
              "kind": {
                "const": "ios_app",
                "type": "string"
              },
              "value": {
                "maxLength": 255,
                "minLength": 3,
                "type": "string"
              }
            },
            "required": [
              "kind",
              "value"
            ],
            "type": "object"
          },
          {
            "additionalProperties": false,
            "properties": {
              "kind": {
                "const": "android_app",
                "type": "string"
              },
              "value": {
                "maxLength": 255,
                "minLength": 3,
                "type": "string"
              }
            },
            "required": [
              "kind",
              "value"
            ],
            "type": "object"
          }
        ]
      },
      "currency": {
        "const": "SAR",
        "type": "string"
      },
      "description": {
        "anyOf": [
          {
            "maxLength": 2000,
            "minLength": 1,
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "environmentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "metadata": {
        "additionalProperties": {
          "maxLength": 500,
          "type": "string"
        },
        "propertyNames": {
          "maxLength": 80,
          "minLength": 1,
          "type": "string"
        },
        "type": "object"
      },
      "orderReference": {
        "anyOf": [
          {
            "maxLength": 160,
            "minLength": 1,
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "returnUrl": {
        "anyOf": [
          {
            "format": "uri",
            "maxLength": 2048,
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      }
    },
    "required": [
      "environmentId",
      "amountMinor",
      "currency",
      "clientBinding"
    ],
    "type": "object"
  },
  "Catalog017ExchangeCheckoutTokenRequest": {
    "additionalProperties": false,
    "properties": {
      "token": {
        "pattern": "^wct_[A-Za-z0-9_-]{40,80}$",
        "type": "string"
      }
    },
    "required": [
      "token"
    ],
    "type": "object"
  },
  "Catalog017PaymentIntent": {
    "additionalProperties": false,
    "properties": {
      "amountMinor": {
        "maximum": 100000000,
        "minimum": 100,
        "type": "integer"
      },
      "availablePaymentMethods": {
        "items": {
          "enum": [
            "card",
            "apple_pay",
            "stc_pay",
            "samsung_pay"
          ],
          "type": "string"
        },
        "maxItems": 4,
        "type": "array"
      },
      "cancelledAt": {
        "anyOf": [
          {
            "format": "date-time",
            "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "checkout": {
        "anyOf": [
          {
            "additionalProperties": false,
            "properties": {
              "expiresAt": {
                "format": "date-time",
                "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
                "type": "string"
              },
              "sessionId": {
                "maxLength": 160,
                "minLength": 3,
                "type": "string"
              },
              "token": {
                "anyOf": [
                  {
                    "pattern": "^wct_[A-Za-z0-9_-]{40,80}$",
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "url": {
                "format": "uri",
                "type": "string"
              }
            },
            "required": [
              "sessionId",
              "token",
              "url",
              "expiresAt"
            ],
            "type": "object"
          },
          {
            "type": "null"
          }
        ]
      },
      "createdAt": {
        "format": "date-time",
        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
        "type": "string"
      },
      "currency": {
        "const": "SAR",
        "type": "string"
      },
      "description": {
        "anyOf": [
          {
            "maxLength": 2000,
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "environmentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "failedAt": {
        "anyOf": [
          {
            "format": "date-time",
            "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "metadata": {
        "additionalProperties": {
          "maxLength": 500,
          "type": "string"
        },
        "propertyNames": {
          "maxLength": 80,
          "minLength": 1,
          "type": "string"
        },
        "type": "object"
      },
      "orderReference": {
        "anyOf": [
          {
            "maxLength": 160,
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "paymentId": {
        "anyOf": [
          {
            "maxLength": 160,
            "minLength": 3,
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "paymentIntentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "paymentLinkId": {
        "anyOf": [
          {
            "maxLength": 160,
            "minLength": 3,
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "projectId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "requestedPaymentMethods": {
        "items": {
          "enum": [
            "card",
            "apple_pay",
            "stc_pay",
            "samsung_pay"
          ],
          "type": "string"
        },
        "maxItems": 4,
        "minItems": 1,
        "type": "array"
      },
      "returnUrl": {
        "anyOf": [
          {
            "format": "uri",
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "status": {
        "enum": [
          "requires_payment_method",
          "processing",
          "requires_action",
          "succeeded",
          "failed",
          "cancelled",
          "unknown",
          "reconciliation"
        ],
        "type": "string"
      },
      "succeededAt": {
        "anyOf": [
          {
            "format": "date-time",
            "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "updatedAt": {
        "format": "date-time",
        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
        "type": "string"
      }
    },
    "required": [
      "paymentIntentId",
      "paymentLinkId",
      "projectId",
      "environmentId",
      "status",
      "amountMinor",
      "currency",
      "orderReference",
      "description",
      "requestedPaymentMethods",
      "availablePaymentMethods",
      "returnUrl",
      "metadata",
      "checkout",
      "paymentId",
      "createdAt",
      "updatedAt",
      "succeededAt",
      "failedAt",
      "cancelledAt"
    ],
    "type": "object"
  },
  "Catalog017PaymentIntentList": {
    "items": {
      "additionalProperties": false,
      "properties": {
        "amountMinor": {
          "maximum": 100000000,
          "minimum": 100,
          "type": "integer"
        },
        "availablePaymentMethods": {
          "items": {
            "enum": [
              "card",
              "apple_pay",
              "stc_pay",
              "samsung_pay"
            ],
            "type": "string"
          },
          "maxItems": 4,
          "type": "array"
        },
        "cancelledAt": {
          "anyOf": [
            {
              "format": "date-time",
              "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "checkout": {
          "anyOf": [
            {
              "additionalProperties": false,
              "properties": {
                "expiresAt": {
                  "format": "date-time",
                  "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
                  "type": "string"
                },
                "sessionId": {
                  "maxLength": 160,
                  "minLength": 3,
                  "type": "string"
                },
                "token": {
                  "anyOf": [
                    {
                      "pattern": "^wct_[A-Za-z0-9_-]{40,80}$",
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ]
                },
                "url": {
                  "format": "uri",
                  "type": "string"
                }
              },
              "required": [
                "sessionId",
                "token",
                "url",
                "expiresAt"
              ],
              "type": "object"
            },
            {
              "type": "null"
            }
          ]
        },
        "createdAt": {
          "format": "date-time",
          "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
          "type": "string"
        },
        "currency": {
          "const": "SAR",
          "type": "string"
        },
        "description": {
          "anyOf": [
            {
              "maxLength": 2000,
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "environmentId": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        },
        "failedAt": {
          "anyOf": [
            {
              "format": "date-time",
              "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "metadata": {
          "additionalProperties": {
            "maxLength": 500,
            "type": "string"
          },
          "propertyNames": {
            "maxLength": 80,
            "minLength": 1,
            "type": "string"
          },
          "type": "object"
        },
        "orderReference": {
          "anyOf": [
            {
              "maxLength": 160,
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "paymentId": {
          "anyOf": [
            {
              "maxLength": 160,
              "minLength": 3,
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "paymentIntentId": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        },
        "paymentLinkId": {
          "anyOf": [
            {
              "maxLength": 160,
              "minLength": 3,
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "projectId": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        },
        "requestedPaymentMethods": {
          "items": {
            "enum": [
              "card",
              "apple_pay",
              "stc_pay",
              "samsung_pay"
            ],
            "type": "string"
          },
          "maxItems": 4,
          "minItems": 1,
          "type": "array"
        },
        "returnUrl": {
          "anyOf": [
            {
              "format": "uri",
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "status": {
          "enum": [
            "requires_payment_method",
            "processing",
            "requires_action",
            "succeeded",
            "failed",
            "cancelled",
            "unknown",
            "reconciliation"
          ],
          "type": "string"
        },
        "succeededAt": {
          "anyOf": [
            {
              "format": "date-time",
              "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "updatedAt": {
          "format": "date-time",
          "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
          "type": "string"
        }
      },
      "required": [
        "paymentIntentId",
        "paymentLinkId",
        "projectId",
        "environmentId",
        "status",
        "amountMinor",
        "currency",
        "orderReference",
        "description",
        "requestedPaymentMethods",
        "availablePaymentMethods",
        "returnUrl",
        "metadata",
        "checkout",
        "paymentId",
        "createdAt",
        "updatedAt",
        "succeededAt",
        "failedAt",
        "cancelledAt"
      ],
      "type": "object"
    },
    "type": "array"
  },
  "Catalog017PublicCheckoutSession": {
    "additionalProperties": false,
    "properties": {
      "amountMinor": {
        "maximum": 100000000,
        "minimum": 100,
        "type": "integer"
      },
      "currency": {
        "const": "SAR",
        "type": "string"
      },
      "description": {
        "anyOf": [
          {
            "maxLength": 2000,
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "expiresAt": {
        "format": "date-time",
        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
        "type": "string"
      },
      "methods": {
        "items": {
          "additionalProperties": false,
          "properties": {
            "networks": {
              "items": {
                "enum": [
                  "mada",
                  "visa",
                  "mastercard",
                  "amex",
                  "unionpay"
                ],
                "type": "string"
              },
              "type": "array"
            },
            "reason": {
              "enum": [
                "ready",
                "not_requested",
                "provider_activation_required",
                "domain_registration_required",
                "application_registration_required",
                "unsupported_device",
                "unsupported_browser",
                "readiness_unknown"
              ],
              "type": "string"
            },
            "status": {
              "enum": [
                "available",
                "unavailable"
              ],
              "type": "string"
            },
            "type": {
              "enum": [
                "card",
                "apple_pay",
                "stc_pay",
                "samsung_pay"
              ],
              "type": "string"
            }
          },
          "required": [
            "type",
            "status",
            "reason"
          ],
          "type": "object"
        },
        "maxItems": 4,
        "minItems": 1,
        "type": "array"
      },
      "orderReference": {
        "anyOf": [
          {
            "maxLength": 160,
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "paymentIntentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "returnUrl": {
        "anyOf": [
          {
            "format": "uri",
            "type": "string"
          },
          {
            "type": "null"
          }
        ]
      },
      "sessionId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "status": {
        "enum": [
          "requires_payment_method",
          "processing",
          "requires_action",
          "succeeded",
          "failed",
          "cancelled",
          "unknown",
          "reconciliation"
        ],
        "type": "string"
      }
    },
    "required": [
      "sessionId",
      "paymentIntentId",
      "status",
      "amountMinor",
      "currency",
      "description",
      "orderReference",
      "methods",
      "expiresAt",
      "returnUrl"
    ],
    "type": "object"
  },
  "Catalog017SubmitCheckoutSessionRequest": {
    "additionalProperties": false,
    "properties": {
      "providerInput": {
        "oneOf": [
          {
            "additionalProperties": false,
            "properties": {
              "kind": {
                "const": "card_token",
                "type": "string"
              },
              "token": {
                "pattern": "^token_[A-Za-z0-9_-]{8,200}$",
                "type": "string"
              }
            },
            "required": [
              "kind",
              "token"
            ],
            "type": "object"
          },
          {
            "additionalProperties": false,
            "properties": {
              "kind": {
                "const": "apple_pay",
                "type": "string"
              },
              "token": {}
            },
            "required": [
              "kind",
              "token"
            ],
            "type": "object"
          },
          {
            "additionalProperties": false,
            "properties": {
              "kind": {
                "const": "stc_pay",
                "type": "string"
              },
              "mobile": {
                "type": "string"
              }
            },
            "required": [
              "kind",
              "mobile"
            ],
            "type": "object"
          },
          {
            "additionalProperties": false,
            "properties": {
              "kind": {
                "const": "samsung_pay",
                "type": "string"
              },
              "token": {}
            },
            "required": [
              "kind",
              "token"
            ],
            "type": "object"
          }
        ]
      }
    },
    "required": [
      "providerInput"
    ],
    "type": "object"
  },
  "CatalogedProviderOperation": {
    "additionalProperties": false,
    "properties": {
      "adapter": {
        "enum": [
          "AuthentaOtpAdapter",
          "WathbaOtpAdapter",
          "TorodShippingAdapter"
        ],
        "type": "string"
      },
      "capabilityCode": {
        "enum": [
          "messaging.otp",
          "logistics.shipping"
        ],
        "type": "string"
      },
      "capCodes": {
        "items": {
          "minLength": 1,
          "type": "string"
        },
        "type": "array",
        "uniqueItems": true
      },
      "certification": {
        "enum": [
          "certified",
          "development_preview"
        ],
        "type": "string"
      },
      "doorwayRequiredScopes": {
        "const": [
          "tools:execute"
        ],
        "items": {
          "type": "string"
        },
        "type": "array"
      },
      "eventType": {
        "minLength": 1,
        "type": "string"
      },
      "executionAvailability": {
        "additionalProperties": false,
        "properties": {
          "allowedEnvironmentKinds": {
            "items": {
              "enum": [
                "sandbox",
                "production"
              ],
              "type": "string"
            },
            "minItems": 1,
            "type": "array",
            "uniqueItems": true
          },
          "enablementFlag": {
            "type": [
              "string",
              "null"
            ]
          },
          "failClosedReason": {
            "type": [
              "string",
              "null"
            ]
          },
          "requiresExplicitEnablement": {
            "type": "boolean"
          },
          "stage": {
            "enum": [
              "general",
              "dev_preview"
            ],
            "type": "string"
          }
        },
        "required": [
          "stage",
          "allowedEnvironmentKinds",
          "requiresExplicitEnablement",
          "enablementFlag",
          "failClosedReason"
        ],
        "type": "object"
      },
      "executionPathTemplate": {
        "const": "/v1/platform/projects/{projectId}/services/{serviceCode}/operations/{operationCode}",
        "type": "string"
      },
      "exposure": {
        "const": "catalog_runtime",
        "type": "string"
      },
      "humanApproval": {
        "enum": [
          "none",
          "required"
        ],
        "type": "string"
      },
      "humanApprovalBinding": {
        "oneOf": [
          {
            "additionalProperties": false,
            "properties": {
              "action": {
                "type": "string"
              },
              "grantField": {
                "const": "humanApprovalGrantId",
                "type": "string"
              },
              "target": {
                "additionalProperties": false,
                "properties": {
                  "canonicalization": {
                    "type": "string"
                  },
                  "digest": {
                    "const": "sha256",
                    "type": "string"
                  },
                  "fields": {
                    "items": {
                      "minLength": 1,
                      "type": "string"
                    },
                    "type": "array",
                    "uniqueItems": true
                  },
                  "prefix": {
                    "type": "string"
                  },
                  "version": {
                    "type": "string"
                  }
                },
                "required": [
                  "version",
                  "prefix",
                  "digest",
                  "canonicalization",
                  "fields"
                ],
                "type": "object"
              }
            },
            "required": [
              "action",
              "grantField",
              "target"
            ],
            "type": "object"
          },
          {
            "type": "null"
          }
        ]
      },
      "idempotency": {
        "enum": [
          "none",
          "required"
        ],
        "type": "string"
      },
      "invocation": {
        "const": "operation_execution_adapter",
        "type": "string"
      },
      "memberSafeResultFields": {
        "items": {
          "minLength": 1,
          "type": "string"
        },
        "type": "array",
        "uniqueItems": true
      },
      "operationCode": {
        "enum": [
          "sendOtp",
          "verifyOtp",
          "getRate",
          "createShipment",
          "getShipmentStatus",
          "cancelShipment"
        ],
        "type": "string"
      },
      "operationRequiredScopes": {
        "items": {
          "minLength": 1,
          "type": "string"
        },
        "type": "array",
        "uniqueItems": true
      },
      "provider": {
        "enum": [
          "authenta",
          "wathba",
          "torod"
        ],
        "type": "string"
      },
      "requestBody": {
        "additionalProperties": false,
        "properties": {
          "example": {},
          "jsonSchema": {
            "additionalProperties": true,
            "type": "object"
          },
          "schemaId": {
            "minLength": 1,
            "type": "string"
          }
        },
        "required": [
          "schemaId",
          "jsonSchema",
          "example"
        ],
        "type": "object"
      },
      "requiredScopes": {
        "items": {
          "minLength": 1,
          "type": "string"
        },
        "type": "array",
        "uniqueItems": true
      },
      "responseBody": {
        "additionalProperties": false,
        "properties": {
          "example": {},
          "jsonSchema": {
            "additionalProperties": true,
            "type": "object"
          },
          "schemaId": {
            "minLength": 1,
            "type": "string"
          }
        },
        "required": [
          "schemaId",
          "jsonSchema",
          "example"
        ],
        "type": "object"
      },
      "riskClassification": {
        "enum": [
          "read_only",
          "cost_bearing_write",
          "status_changing_write",
          "financial_reversal"
        ],
        "type": "string"
      },
      "serviceCode": {
        "enum": [
          "messaging.otp.authenta",
          "messaging.otp.wathba",
          "shipping.torod"
        ],
        "type": "string"
      }
    },
    "required": [
      "operationCode",
      "serviceCode",
      "capabilityCode",
      "provider",
      "adapter",
      "exposure",
      "certification",
      "invocation",
      "doorwayRequiredScopes",
      "operationRequiredScopes",
      "requiredScopes",
      "idempotency",
      "riskClassification",
      "humanApproval",
      "humanApprovalBinding",
      "capCodes",
      "eventType",
      "executionPathTemplate",
      "requestBody",
      "responseBody",
      "memberSafeResultFields",
      "executionAvailability"
    ],
    "type": "object"
  },
  "CatalogOperation_messaging_otp_authenta_sendOtp": {
    "additionalProperties": false,
    "properties": {
      "environmentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "input": {
        "additionalProperties": false,
        "properties": {
          "email": {
            "format": "email",
            "pattern": "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$",
            "type": "string"
          },
          "purpose": {
            "maxLength": 160,
            "minLength": 1,
            "type": "string"
          }
        },
        "required": [
          "email"
        ],
        "type": "object"
      }
    },
    "required": [
      "environmentId",
      "input"
    ],
    "type": "object",
    "x-wathba-operation-code": "sendOtp",
    "x-wathba-service-code": "messaging.otp.authenta"
  },
  "CatalogOperation_messaging_otp_wathba_sendOtp": {
    "additionalProperties": false,
    "properties": {
      "environmentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "input": {
        "additionalProperties": false,
        "properties": {
          "email": {
            "format": "email",
            "pattern": "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$",
            "type": "string"
          },
          "purpose": {
            "maxLength": 160,
            "minLength": 1,
            "type": "string"
          }
        },
        "required": [
          "email"
        ],
        "type": "object"
      }
    },
    "required": [
      "environmentId",
      "input"
    ],
    "type": "object",
    "x-wathba-operation-code": "sendOtp",
    "x-wathba-service-code": "messaging.otp.wathba"
  },
  "CatalogOperation_messaging_otp_wathba_verifyOtp": {
    "additionalProperties": false,
    "properties": {
      "environmentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "input": {
        "additionalProperties": false,
        "properties": {
          "email": {
            "format": "email",
            "pattern": "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$",
            "type": "string"
          },
          "otp": {
            "maxLength": 16,
            "minLength": 4,
            "type": "string"
          }
        },
        "required": [
          "email",
          "otp"
        ],
        "type": "object"
      }
    },
    "required": [
      "environmentId",
      "input"
    ],
    "type": "object",
    "x-wathba-operation-code": "verifyOtp",
    "x-wathba-service-code": "messaging.otp.wathba"
  },
  "CatalogOperation_shipping_torod_cancelShipment": {
    "additionalProperties": false,
    "properties": {
      "environmentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "input": {
        "additionalProperties": false,
        "properties": {
          "providerReference": {
            "maxLength": 160,
            "minLength": 3,
            "type": "string"
          },
          "shippingType": {
            "enum": [
              "straight",
              "reverse"
            ],
            "type": "string"
          }
        },
        "required": [
          "providerReference"
        ],
        "type": "object"
      }
    },
    "required": [
      "environmentId",
      "input"
    ],
    "type": "object",
    "x-wathba-operation-code": "cancelShipment",
    "x-wathba-service-code": "shipping.torod"
  },
  "CatalogOperation_shipping_torod_createShipment": {
    "additionalProperties": false,
    "properties": {
      "environmentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "input": {
        "additionalProperties": false,
        "properties": {
          "addressId": {
            "maxLength": 160,
            "minLength": 3,
            "type": "string"
          },
          "amountMinor": {
            "exclusiveMinimum": 0,
            "maximum": 9007199254740991,
            "type": "integer"
          },
          "courierName": {
            "maxLength": 160,
            "type": "string"
          },
          "courierPartnerId": {
            "maxLength": 160,
            "minLength": 3,
            "type": "string"
          },
          "currency": {
            "maxLength": 3,
            "minLength": 3,
            "pattern": "^[A-Z]{3}$",
            "type": "string"
          },
          "customerEmail": {
            "format": "email",
            "pattern": "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$",
            "type": "string"
          },
          "customerName": {
            "maxLength": 240,
            "type": "string"
          },
          "customerPhone": {
            "maxLength": 40,
            "type": "string"
          },
          "destinationAddressLine": {
            "maxLength": 500,
            "type": "string"
          },
          "destinationCityId": {
            "maxLength": 160,
            "type": "string"
          },
          "items": {
            "items": {
              "additionalProperties": false,
              "properties": {
                "amountMinor": {
                  "maximum": 9007199254740991,
                  "minimum": 0,
                  "type": "integer"
                },
                "name": {
                  "maxLength": 240,
                  "minLength": 1,
                  "type": "string"
                },
                "quantity": {
                  "exclusiveMinimum": 0,
                  "maximum": 9007199254740991,
                  "type": "integer"
                },
                "sku": {
                  "maxLength": 160,
                  "type": "string"
                },
                "weightGrams": {
                  "exclusiveMinimum": 0,
                  "maximum": 9007199254740991,
                  "type": "integer"
                }
              },
              "required": [
                "name",
                "quantity"
              ],
              "type": "object"
            },
            "minItems": 1,
            "type": "array"
          },
          "mode": {
            "const": "order_first",
            "type": "string"
          },
          "orderReference": {
            "maxLength": 160,
            "type": "string"
          },
          "parcel": {
            "additionalProperties": false,
            "properties": {
              "heightCm": {
                "exclusiveMinimum": 0,
                "type": "number"
              },
              "lengthCm": {
                "exclusiveMinimum": 0,
                "type": "number"
              },
              "weightGrams": {
                "exclusiveMinimum": 0,
                "maximum": 9007199254740991,
                "type": "integer"
              },
              "widthCm": {
                "exclusiveMinimum": 0,
                "type": "number"
              }
            },
            "required": [
              "weightGrams"
            ],
            "type": "object"
          },
          "paymentType": {
            "maxLength": 80,
            "type": "string"
          },
          "recipient": {
            "additionalProperties": false,
            "properties": {
              "address": {
                "additionalProperties": false,
                "properties": {
                  "cityId": {
                    "maxLength": 160,
                    "minLength": 1,
                    "type": "string"
                  },
                  "line": {
                    "maxLength": 500,
                    "minLength": 1,
                    "type": "string"
                  },
                  "shortAddress": {
                    "maxLength": 160,
                    "type": "string"
                  }
                },
                "required": [
                  "line",
                  "cityId"
                ],
                "type": "object"
              },
              "email": {
                "format": "email",
                "pattern": "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$",
                "type": "string"
              },
              "name": {
                "maxLength": 240,
                "minLength": 1,
                "type": "string"
              },
              "phone": {
                "maxLength": 40,
                "minLength": 5,
                "type": "string"
              }
            },
            "required": [
              "name",
              "email",
              "phone",
              "address"
            ],
            "type": "object"
          },
          "shipmentType": {
            "enum": [
              "normal",
              "cold",
              "quick"
            ],
            "type": "string"
          },
          "warehouseCode": {
            "maxLength": 160,
            "type": "string"
          },
          "warehouseName": {
            "maxLength": 160,
            "type": "string"
          }
        },
        "required": [
          "mode",
          "amountMinor",
          "recipient",
          "items",
          "parcel"
        ],
        "type": "object"
      }
    },
    "required": [
      "environmentId",
      "input"
    ],
    "type": "object",
    "x-wathba-operation-code": "createShipment",
    "x-wathba-service-code": "shipping.torod"
  },
  "CatalogOperation_shipping_torod_getRate": {
    "additionalProperties": false,
    "properties": {
      "environmentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "input": {
        "additionalProperties": false,
        "properties": {
          "amountMinor": {
            "maximum": 9007199254740991,
            "minimum": 0,
            "type": "integer"
          },
          "destinationCityId": {
            "maxLength": 160,
            "minLength": 3,
            "type": "string"
          },
          "filterBy": {
            "enum": [
              "cheapest",
              "fastest"
            ],
            "type": "string"
          },
          "isInsurance": {
            "anyOf": [
              {
                "const": 0,
                "type": "number"
              },
              {
                "const": 1,
                "type": "number"
              },
              {
                "type": "boolean"
              }
            ]
          },
          "parcel": {
            "additionalProperties": false,
            "properties": {
              "boxes": {
                "exclusiveMinimum": 0,
                "maximum": 9007199254740991,
                "type": "integer"
              },
              "heightCm": {
                "exclusiveMinimum": 0,
                "type": "number"
              },
              "lengthCm": {
                "exclusiveMinimum": 0,
                "type": "number"
              },
              "weightGrams": {
                "exclusiveMinimum": 0,
                "type": "number"
              },
              "weightKg": {
                "exclusiveMinimum": 0,
                "type": "number"
              },
              "widthCm": {
                "exclusiveMinimum": 0,
                "type": "number"
              }
            },
            "type": "object"
          },
          "paymentType": {
            "enum": [
              "COD",
              "cash_on_delivery",
              "Prepaid",
              "paid",
              "Bank"
            ],
            "type": "string"
          },
          "shipmentType": {
            "enum": [
              "normal",
              "cold",
              "quick",
              "pudo"
            ],
            "type": "string"
          },
          "shipperCityId": {
            "maxLength": 160,
            "minLength": 3,
            "type": "string"
          },
          "shippingType": {
            "enum": [
              "straight",
              "reverse"
            ],
            "type": "string"
          },
          "warehouseCode": {
            "maxLength": 160,
            "minLength": 1,
            "type": "string"
          }
        },
        "required": [
          "destinationCityId",
          "amountMinor",
          "parcel"
        ],
        "type": "object"
      }
    },
    "required": [
      "environmentId",
      "input"
    ],
    "type": "object",
    "x-wathba-operation-code": "getRate",
    "x-wathba-service-code": "shipping.torod"
  },
  "CatalogOperation_shipping_torod_getShipmentStatus": {
    "additionalProperties": false,
    "properties": {
      "environmentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "input": {
        "additionalProperties": false,
        "properties": {
          "providerReference": {
            "maxLength": 160,
            "minLength": 3,
            "type": "string"
          },
          "shippingType": {
            "enum": [
              "straight",
              "reverse"
            ],
            "type": "string"
          }
        },
        "required": [
          "providerReference"
        ],
        "type": "object"
      }
    },
    "required": [
      "environmentId",
      "input"
    ],
    "type": "object",
    "x-wathba-operation-code": "getShipmentStatus",
    "x-wathba-service-code": "shipping.torod"
  },
  "CatalogProviderOperationExecution": {
    "additionalProperties": false,
    "properties": {
      "amountMinor": {
        "maximum": 9007199254740991,
        "minimum": 0,
        "type": "integer"
      },
      "capability": {
        "type": "string"
      },
      "currency": {
        "maxLength": 3,
        "minLength": 3,
        "pattern": "^[A-Z]{3}$",
        "type": "string"
      },
      "executionId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "operationCode": {
        "type": "string"
      },
      "paymentUrl": {
        "format": "uri",
        "type": "string"
      },
      "result": {
        "oneOf": [
          {
            "$ref": "#/components/schemas/AuthentaOtpResult"
          },
          {
            "$ref": "#/components/schemas/WathbaSendOtpResult"
          },
          {
            "$ref": "#/components/schemas/WathbaVerifyOtpResult"
          },
          {
            "$ref": "#/components/schemas/TorodRateResult"
          },
          {
            "$ref": "#/components/schemas/TorodShipmentResult"
          },
          {
            "$ref": "#/components/schemas/TorodShipmentStatusResult"
          },
          {
            "$ref": "#/components/schemas/TorodCancellationResult"
          }
        ]
      },
      "shipmentReference": {
        "type": "string"
      },
      "state": {
        "enum": [
          "succeeded",
          "failed",
          "pending",
          "blocked",
          "closed"
        ],
        "type": "string"
      },
      "statusCode": {
        "maximum": 599,
        "minimum": 100,
        "type": "integer"
      },
      "trackingStatus": {
        "type": "string"
      }
    },
    "required": [
      "executionId",
      "state",
      "statusCode",
      "message",
      "capability",
      "operationCode",
      "amountMinor",
      "currency"
    ],
    "type": "object"
  },
  "CatalogProviderOperationRequest": {
    "oneOf": [
      {
        "$ref": "#/components/schemas/CatalogOperation_messaging_otp_authenta_sendOtp"
      },
      {
        "$ref": "#/components/schemas/CatalogOperation_messaging_otp_wathba_sendOtp"
      },
      {
        "$ref": "#/components/schemas/CatalogOperation_messaging_otp_wathba_verifyOtp"
      },
      {
        "$ref": "#/components/schemas/CatalogOperation_shipping_torod_getRate"
      },
      {
        "$ref": "#/components/schemas/CatalogOperation_shipping_torod_createShipment"
      },
      {
        "$ref": "#/components/schemas/CatalogOperation_shipping_torod_getShipmentStatus"
      },
      {
        "$ref": "#/components/schemas/CatalogOperation_shipping_torod_cancelShipment"
      }
    ],
    "x-wathba-discriminator": {
      "operationCodeParameter": "operationCode",
      "serviceCodeParameter": "serviceCode"
    }
  },
  "CliProviderOperationCatalogResponse": {
    "additionalProperties": false,
    "properties": {
      "contractVersion": {
        "const": "2026.07.mvp.010",
        "type": "string"
      },
      "executionPathTemplate": {
        "const": "/v1/platform/projects/{projectId}/services/{serviceCode}/operations/{operationCode}",
        "type": "string"
      },
      "operations": {
        "items": {
          "$ref": "#/components/schemas/CatalogedProviderOperation"
        },
        "minItems": 1,
        "type": "array"
      },
      "schemaVersion": {
        "const": "wathba.cli.provider-operations.v1",
        "type": "string"
      },
      "serviceCode": {
        "enum": [
          "messaging.otp.authenta",
          "messaging.otp.wathba",
          "shipping.torod"
        ],
        "type": "string"
      }
    },
    "required": [
      "schemaVersion",
      "contractVersion",
      "serviceCode",
      "executionPathTemplate",
      "operations"
    ],
    "type": "object"
  },
  "CreateShipmentRequest": {
    "additionalProperties": false,
    "properties": {
      "addressId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "amountMinor": {
        "exclusiveMinimum": 0,
        "maximum": 9007199254740991,
        "type": "integer"
      },
      "courierName": {
        "maxLength": 160,
        "type": "string"
      },
      "courierPartnerId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "currency": {
        "maxLength": 3,
        "minLength": 3,
        "pattern": "^[A-Z]{3}$",
        "type": "string"
      },
      "customerEmail": {
        "format": "email",
        "pattern": "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$",
        "type": "string"
      },
      "customerName": {
        "maxLength": 240,
        "type": "string"
      },
      "customerPhone": {
        "maxLength": 40,
        "type": "string"
      },
      "destinationAddressLine": {
        "maxLength": 500,
        "type": "string"
      },
      "destinationCityId": {
        "maxLength": 160,
        "type": "string"
      },
      "environmentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "items": {
        "items": {
          "additionalProperties": false,
          "properties": {
            "amountMinor": {
              "maximum": 9007199254740991,
              "minimum": 0,
              "type": "integer"
            },
            "name": {
              "maxLength": 240,
              "minLength": 1,
              "type": "string"
            },
            "quantity": {
              "exclusiveMinimum": 0,
              "maximum": 9007199254740991,
              "type": "integer"
            },
            "sku": {
              "maxLength": 160,
              "type": "string"
            },
            "weightGrams": {
              "exclusiveMinimum": 0,
              "maximum": 9007199254740991,
              "type": "integer"
            }
          },
          "required": [
            "name",
            "quantity"
          ],
          "type": "object"
        },
        "minItems": 1,
        "type": "array"
      },
      "mode": {
        "const": "order_first",
        "type": "string"
      },
      "orderReference": {
        "maxLength": 160,
        "type": "string"
      },
      "parcel": {
        "additionalProperties": false,
        "properties": {
          "heightCm": {
            "exclusiveMinimum": 0,
            "type": "number"
          },
          "lengthCm": {
            "exclusiveMinimum": 0,
            "type": "number"
          },
          "weightGrams": {
            "exclusiveMinimum": 0,
            "maximum": 9007199254740991,
            "type": "integer"
          },
          "widthCm": {
            "exclusiveMinimum": 0,
            "type": "number"
          }
        },
        "required": [
          "weightGrams"
        ],
        "type": "object"
      },
      "paymentType": {
        "maxLength": 80,
        "type": "string"
      },
      "recipient": {
        "additionalProperties": false,
        "properties": {
          "address": {
            "additionalProperties": false,
            "properties": {
              "cityId": {
                "maxLength": 160,
                "minLength": 1,
                "type": "string"
              },
              "line": {
                "maxLength": 500,
                "minLength": 1,
                "type": "string"
              },
              "shortAddress": {
                "maxLength": 160,
                "type": "string"
              }
            },
            "required": [
              "line",
              "cityId"
            ],
            "type": "object"
          },
          "email": {
            "format": "email",
            "pattern": "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$",
            "type": "string"
          },
          "name": {
            "maxLength": 240,
            "minLength": 1,
            "type": "string"
          },
          "phone": {
            "maxLength": 40,
            "minLength": 5,
            "type": "string"
          }
        },
        "required": [
          "name",
          "email",
          "phone",
          "address"
        ],
        "type": "object"
      },
      "shipmentType": {
        "enum": [
          "normal",
          "cold",
          "quick"
        ],
        "type": "string"
      },
      "warehouseCode": {
        "maxLength": 160,
        "type": "string"
      },
      "warehouseName": {
        "maxLength": 160,
        "type": "string"
      }
    },
    "required": [
      "environmentId",
      "mode",
      "amountMinor",
      "recipient",
      "items",
      "parcel"
    ],
    "type": "object"
  },
  "MemberWebhookEvent": {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "additionalProperties": false,
    "properties": {
      "alertKey": {
        "pattern": "^[a-z][a-z0-9_]{2,159}$",
        "type": "string"
      },
      "eventId": {
        "pattern": "^evt_[A-Za-z0-9._:-]+$",
        "type": "string"
      },
      "eventType": {
        "pattern": "^[A-Z][A-Za-z0-9]{2,159}$",
        "type": "string"
      },
      "payload": {
        "additionalProperties": {
          "anyOf": [
            {
              "maxLength": 2000,
              "type": "string"
            },
            {
              "type": "number"
            },
            {
              "type": "boolean"
            },
            {
              "type": "null"
            },
            {
              "additionalProperties": {
                "maxLength": 1000,
                "type": "string"
              },
              "propertyNames": {
                "maxLength": 160,
                "minLength": 1,
                "type": "string"
              },
              "type": "object"
            }
          ]
        },
        "propertyNames": {
          "maxLength": 160,
          "minLength": 1,
          "type": "string"
        },
        "type": "object"
      },
      "payloadVersion": {
        "exclusiveMinimum": 0,
        "maximum": 9007199254740991,
        "type": "integer"
      }
    },
    "required": [
      "eventId",
      "eventType",
      "alertKey",
      "payloadVersion",
      "payload"
    ],
    "type": "object"
  },
  "OperationExecution": {
    "additionalProperties": false,
    "properties": {
      "amountMinor": {
        "maximum": 9007199254740991,
        "minimum": 0,
        "type": "integer"
      },
      "capability": {
        "type": "string"
      },
      "currency": {
        "maxLength": 3,
        "minLength": 3,
        "pattern": "^[A-Z]{3}$",
        "type": "string"
      },
      "executionId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "operationCode": {
        "type": "string"
      },
      "paymentUrl": {
        "format": "uri",
        "type": "string"
      },
      "shipmentReference": {
        "type": "string"
      },
      "state": {
        "enum": [
          "succeeded",
          "failed",
          "pending",
          "blocked",
          "closed"
        ],
        "type": "string"
      },
      "statusCode": {
        "maximum": 599,
        "minimum": 100,
        "type": "integer"
      },
      "trackingStatus": {
        "type": "string"
      }
    },
    "required": [
      "executionId",
      "state",
      "statusCode",
      "message",
      "capability",
      "operationCode",
      "amountMinor",
      "currency"
    ],
    "type": "object"
  },
  "SendOtpRequest": {
    "additionalProperties": false,
    "properties": {
      "email": {
        "format": "email",
        "pattern": "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$",
        "type": "string"
      },
      "environmentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "purpose": {
        "maxLength": 160,
        "minLength": 1,
        "type": "string"
      }
    },
    "required": [
      "environmentId",
      "email"
    ],
    "type": "object"
  },
  "TorodCancellationResult": {
    "additionalProperties": false,
    "properties": {
      "trackingStatus": {
        "const": "cancelled",
        "type": "string"
      }
    },
    "required": [
      "trackingStatus"
    ],
    "type": "object"
  },
  "TorodCancelShipmentRequest": {
    "additionalProperties": false,
    "properties": {
      "environmentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "providerReference": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "shippingType": {
        "enum": [
          "straight",
          "reverse"
        ],
        "type": "string"
      }
    },
    "required": [
      "environmentId",
      "providerReference"
    ],
    "type": "object"
  },
  "TorodGetRateRequest": {
    "additionalProperties": false,
    "properties": {
      "amountMinor": {
        "maximum": 9007199254740991,
        "minimum": 0,
        "type": "integer"
      },
      "destinationCityId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "environmentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "filterBy": {
        "enum": [
          "cheapest",
          "fastest"
        ],
        "type": "string"
      },
      "isInsurance": {
        "anyOf": [
          {
            "const": 0,
            "type": "number"
          },
          {
            "const": 1,
            "type": "number"
          },
          {
            "type": "boolean"
          }
        ]
      },
      "parcel": {
        "additionalProperties": false,
        "properties": {
          "boxes": {
            "exclusiveMinimum": 0,
            "maximum": 9007199254740991,
            "type": "integer"
          },
          "heightCm": {
            "exclusiveMinimum": 0,
            "type": "number"
          },
          "lengthCm": {
            "exclusiveMinimum": 0,
            "type": "number"
          },
          "weightGrams": {
            "exclusiveMinimum": 0,
            "type": "number"
          },
          "weightKg": {
            "exclusiveMinimum": 0,
            "type": "number"
          },
          "widthCm": {
            "exclusiveMinimum": 0,
            "type": "number"
          }
        },
        "type": "object"
      },
      "paymentType": {
        "enum": [
          "COD",
          "cash_on_delivery",
          "Prepaid",
          "paid",
          "Bank"
        ],
        "type": "string"
      },
      "shipmentType": {
        "enum": [
          "normal",
          "cold",
          "quick",
          "pudo"
        ],
        "type": "string"
      },
      "shipperCityId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "shippingType": {
        "enum": [
          "straight",
          "reverse"
        ],
        "type": "string"
      },
      "warehouseCode": {
        "maxLength": 160,
        "minLength": 1,
        "type": "string"
      }
    },
    "required": [
      "environmentId",
      "destinationCityId",
      "amountMinor",
      "parcel"
    ],
    "type": "object"
  },
  "TorodGetShipmentStatusRequest": {
    "additionalProperties": false,
    "properties": {
      "environmentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "providerReference": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "shippingType": {
        "enum": [
          "straight",
          "reverse"
        ],
        "type": "string"
      }
    },
    "required": [
      "environmentId",
      "providerReference"
    ],
    "type": "object"
  },
  "TorodRateResult": {
    "additionalProperties": false,
    "properties": {
      "courierOptions": {
        "items": {
          "additionalProperties": false,
          "properties": {
            "costMinor": {
              "anyOf": [
                {
                  "maximum": 9007199254740991,
                  "minimum": 0,
                  "type": "integer"
                },
                {
                  "type": "null"
                }
              ]
            },
            "courierPartnerId": {
              "maxLength": 160,
              "minLength": 3,
              "type": "string"
            },
            "currency": {
              "anyOf": [
                {
                  "maxLength": 3,
                  "minLength": 3,
                  "pattern": "^[A-Z]{3}$",
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "isOwn": {
              "anyOf": [
                {
                  "const": 0,
                  "type": "number"
                },
                {
                  "const": 1,
                  "type": "number"
                }
              ]
            },
            "name": {
              "maxLength": 240,
              "minLength": 1,
              "type": "string"
            },
            "serviceType": {
              "maxLength": 160,
              "minLength": 1,
              "type": "string"
            }
          },
          "required": [
            "courierPartnerId",
            "isOwn",
            "name",
            "serviceType",
            "costMinor",
            "currency"
          ],
          "type": "object"
        },
        "type": "array"
      }
    },
    "required": [
      "courierOptions"
    ],
    "type": "object"
  },
  "TorodShipmentResult": {
    "additionalProperties": false,
    "properties": {
      "shipmentReference": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "trackingStatus": {
        "maxLength": 160,
        "minLength": 1,
        "type": "string"
      }
    },
    "required": [
      "trackingStatus"
    ],
    "type": "object"
  },
  "TorodShipmentStatusResult": {
    "additionalProperties": false,
    "properties": {
      "shipmentReference": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "trackingStatus": {
        "maxLength": 160,
        "minLength": 1,
        "type": "string"
      }
    },
    "required": [
      "trackingStatus"
    ],
    "type": "object"
  },
  "VerifyOtpRequest": {
    "additionalProperties": false,
    "properties": {
      "email": {
        "format": "email",
        "pattern": "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$",
        "type": "string"
      },
      "environmentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "otp": {
        "maxLength": 16,
        "minLength": 4,
        "type": "string"
      }
    },
    "required": [
      "environmentId",
      "email",
      "otp"
    ],
    "type": "object"
  },
  "WathbaProblem": {
    "additionalProperties": false,
    "properties": {
      "actionRef": {
        "additionalProperties": false,
        "properties": {
          "actionCode": {
            "pattern": "^[a-z][a-z0-9_]{2,127}$",
            "type": "string"
          },
          "actionId": {
            "maxLength": 160,
            "minLength": 3,
            "type": "string"
          },
          "allowedDecisions": {
            "items": {
              "enum": [
                "approve",
                "deny",
                "cancel",
                "acknowledge",
                "submit"
              ],
              "type": "string"
            },
            "maxItems": 5,
            "type": "array"
          },
          "browserUrl": {
            "format": "uri",
            "pattern": "^https:\\/\\/.*",
            "type": "string"
          },
          "cancellation": {
            "enum": [
              "not_allowed",
              "allowed_before_decision",
              "allowed_before_delivery",
              "owner_specific"
            ],
            "type": "string"
          },
          "capabilityCode": {
            "pattern": "^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)+$",
            "type": "string"
          },
          "copyKeys": {
            "additionalProperties": false,
            "properties": {
              "consequence": {
                "maxLength": 160,
                "minLength": 3,
                "type": "string"
              },
              "summary": {
                "maxLength": 160,
                "minLength": 3,
                "type": "string"
              },
              "title": {
                "maxLength": 160,
                "minLength": 3,
                "type": "string"
              }
            },
            "required": [
              "title",
              "summary",
              "consequence"
            ],
            "type": "object"
          },
          "decideOperationId": {
            "maxLength": 160,
            "minLength": 3,
            "type": "string"
          },
          "environmentId": {
            "maxLength": 160,
            "minLength": 3,
            "type": "string"
          },
          "expiresAt": {
            "format": "date-time",
            "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
            "type": "string"
          },
          "freshness": {
            "enum": [
              "current_session",
              "browser_fresh",
              "step_up_required"
            ],
            "type": "string"
          },
          "inputClassification": {
            "enum": [
              "member_safe",
              "protected_handle",
              "classified_input_required"
            ],
            "type": "string"
          },
          "owner": {
            "enum": [
              "member_accounts",
              "application_access_and_keys",
              "provider_connections",
              "projects",
              "verification",
              "billing_wallet",
              "budget_controls",
              "member_notifications",
              "service_catalog"
            ],
            "type": "string"
          },
          "ownerState": {
            "enum": [
              "pending_external",
              "completed",
              "denied",
              "expired",
              "cancelled",
              "unknown_delivery"
            ],
            "type": "string"
          },
          "projectId": {
            "maxLength": 160,
            "minLength": 3,
            "type": "string"
          },
          "protocolVersion": {
            "const": "1.0",
            "type": "string"
          },
          "readOperationId": {
            "maxLength": 160,
            "minLength": 3,
            "type": "string"
          },
          "reasonCode": {
            "pattern": "^[a-z][a-z0-9_]{2,127}$",
            "type": "string"
          },
          "resumeRef": {
            "maxLength": 240,
            "minLength": 3,
            "pattern": "^[A-Za-z0-9][A-Za-z0-9._:/-]+$",
            "type": "string"
          },
          "safeCostCapSummary": {
            "additionalProperties": false,
            "properties": {
              "capCode": {
                "pattern": "^[a-z][a-z0-9_]{2,127}$",
                "type": "string"
              },
              "capUnit": {
                "maxLength": 64,
                "minLength": 1,
                "type": "string"
              },
              "capValue": {
                "minimum": 0,
                "type": "number"
              },
              "costClass": {
                "enum": [
                  "free",
                  "capped",
                  "spend_possible"
                ],
                "type": "string"
              },
              "summaryKey": {
                "maxLength": 160,
                "minLength": 3,
                "type": "string"
              }
            },
            "required": [
              "costClass",
              "summaryKey"
            ],
            "type": "object"
          },
          "sourceRef": {
            "maxLength": 240,
            "minLength": 3,
            "pattern": "^[A-Za-z0-9][A-Za-z0-9._:/-]+$",
            "type": "string"
          },
          "sourceVersion": {
            "exclusiveMinimum": 0,
            "maximum": 9007199254740991,
            "type": "integer"
          },
          "statusOperationId": {
            "maxLength": 160,
            "minLength": 3,
            "type": "string"
          }
        },
        "required": [
          "protocolVersion",
          "owner",
          "actionCode",
          "actionId",
          "projectId",
          "environmentId",
          "capabilityCode",
          "sourceRef",
          "sourceVersion",
          "ownerState",
          "reasonCode",
          "allowedDecisions",
          "copyKeys",
          "inputClassification",
          "freshness",
          "expiresAt",
          "readOperationId",
          "decideOperationId",
          "statusOperationId",
          "browserUrl",
          "resumeRef",
          "cancellation"
        ],
        "type": "object"
      },
      "billingEffect": {
        "enum": [
          "none",
          "reserved",
          "charged",
          "released",
          "unknown"
        ],
        "type": "string"
      },
      "code": {
        "pattern": "^[a-z][a-z0-9_]{1,127}$",
        "type": "string"
      },
      "correlationId": {
        "pattern": "^corr_[A-Za-z0-9._:-]+$",
        "type": "string"
      },
      "detail": {
        "maxLength": 2000,
        "type": "string"
      },
      "instance": {
        "maxLength": 500,
        "type": "string"
      },
      "retryable": {
        "type": "boolean"
      },
      "status": {
        "maximum": 599,
        "minimum": 400,
        "type": "integer"
      },
      "title": {
        "maxLength": 240,
        "minLength": 1,
        "type": "string"
      },
      "type": {
        "format": "uri",
        "type": "string"
      },
      "violations": {
        "items": {
          "additionalProperties": false,
          "properties": {
            "message": {
              "maxLength": 1000,
              "minLength": 1,
              "type": "string"
            },
            "path": {
              "maxLength": 500,
              "type": "string"
            }
          },
          "required": [
            "message"
          ],
          "type": "object"
        },
        "type": "array"
      }
    },
    "required": [
      "type",
      "title",
      "status",
      "code",
      "correlationId",
      "retryable",
      "billingEffect"
    ],
    "type": "object"
  },
  "WathbaSendOtpResult": {
    "additionalProperties": false,
    "properties": {
      "deliveryMethod": {
        "const": "email",
        "type": "string"
      }
    },
    "required": [
      "deliveryMethod"
    ],
    "type": "object"
  },
  "WathbaVerifyOtpResult": {
    "additionalProperties": false,
    "properties": {
      "verified": {
        "const": true,
        "type": "boolean"
      }
    },
    "required": [
      "verified"
    ],
    "type": "object"
  },
  "WebhookDeliveryList": {
    "items": {
      "$ref": "#/components/schemas/WebhookDeliveryStatus"
    },
    "type": "array"
  },
  "WebhookDeliveryStatus": {
    "additionalProperties": false,
    "properties": {
      "attemptCount": {
        "minimum": 0,
        "type": "integer"
      },
      "attempts": {
        "items": {
          "additionalProperties": false,
          "properties": {
            "attemptedAt": {
              "format": "date-time",
              "type": "string"
            },
            "attemptId": {
              "type": "string"
            },
            "attemptOrdinal": {
              "type": [
                "integer",
                "null"
              ]
            },
            "channel": {
              "type": "string"
            },
            "deliveryId": {
              "type": [
                "string",
                "null"
              ]
            },
            "responseClass": {
              "type": [
                "string",
                "null"
              ]
            },
            "responseStatus": {
              "type": [
                "integer",
                "null"
              ]
            },
            "result": {
              "type": [
                "string",
                "null"
              ]
            },
            "state": {
              "type": "string"
            },
            "trafficDecisionId": {
              "type": [
                "string",
                "null"
              ]
            }
          },
          "required": [
            "attemptId",
            "deliveryId",
            "attemptOrdinal",
            "channel",
            "state",
            "attemptedAt",
            "result",
            "responseStatus",
            "responseClass",
            "trafficDecisionId"
          ],
          "type": "object"
        },
        "type": "array"
      },
      "createdAt": {
        "format": "date-time",
        "type": "string"
      },
      "deliveryId": {
        "pattern": "^wdl_[A-Za-z0-9_-]{1,156}$",
        "type": "string"
      },
      "endpointId": {
        "type": [
          "string",
          "null"
        ]
      },
      "eventId": {
        "pattern": "^evt_[A-Za-z0-9._:-]+$",
        "type": "string"
      },
      "eventType": {
        "type": "string"
      },
      "lastAttemptAt": {
        "format": "date-time",
        "type": [
          "string",
          "null"
        ]
      },
      "lastResponseClass": {
        "type": [
          "string",
          "null"
        ]
      },
      "nextAttemptAt": {
        "format": "date-time",
        "type": [
          "string",
          "null"
        ]
      },
      "notificationId": {
        "type": "string"
      },
      "state": {
        "enum": [
          "scheduled",
          "dispatched",
          "retry_scheduled",
          "dead_letter",
          "replayed"
        ],
        "type": "string"
      }
    },
    "required": [
      "deliveryId",
      "endpointId",
      "eventId",
      "eventType",
      "notificationId",
      "state",
      "attemptCount",
      "createdAt",
      "nextAttemptAt",
      "lastAttemptAt",
      "lastResponseClass",
      "attempts"
    ],
    "type": "object"
  }
} as const;
