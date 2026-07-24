/* This file is generated from the pinned Wathba OpenAPI artifact. */
export const runtimeSchemas = {
  "CreatePaymentLinkRequest": {
    "additionalProperties": false,
    "properties": {
      "amountMinor": {
        "exclusiveMinimum": 0,
        "maximum": 9007199254740991,
        "type": "integer"
      },
      "checkoutDescription": {
        "maxLength": 2000,
        "type": "string"
      },
      "checkoutTitle": {
        "maxLength": 240,
        "type": "string"
      },
      "currency": {
        "maxLength": 3,
        "minLength": 3,
        "pattern": "^[A-Z]{3}$",
        "type": "string"
      },
      "description": {
        "maxLength": 2000,
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
      "items": {
        "items": {
          "anyOf": [
            {
              "additionalProperties": false,
              "properties": {
                "productId": {
                  "maxLength": 160,
                  "minLength": 3,
                  "type": "string"
                },
                "quantity": {
                  "exclusiveMinimum": 0,
                  "maximum": 9007199254740991,
                  "type": "integer"
                }
              },
              "required": [
                "productId",
                "quantity"
              ],
              "type": "object"
            },
            {
              "additionalProperties": false,
              "properties": {
                "inlineProduct": {
                  "additionalProperties": false,
                  "properties": {
                    "amountMinor": {
                      "exclusiveMinimum": 0,
                      "maximum": 9007199254740991,
                      "type": "integer"
                    },
                    "currency": {
                      "maxLength": 3,
                      "minLength": 3,
                      "pattern": "^[A-Z]{3}$",
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
                    "metadata": {
                      "additionalProperties": {
                        "type": "string"
                      },
                      "propertyNames": {
                        "type": "string"
                      },
                      "type": "object"
                    },
                    "name": {
                      "maxLength": 240,
                      "minLength": 1,
                      "type": "string"
                    },
                    "price": {
                      "additionalProperties": false,
                      "properties": {
                        "amountMinor": {
                          "exclusiveMinimum": 0,
                          "maximum": 9007199254740991,
                          "type": "integer"
                        },
                        "currency": {
                          "maxLength": 3,
                          "minLength": 3,
                          "pattern": "^[A-Z]{3}$",
                          "type": "string"
                        },
                        "taxBehavior": {
                          "enum": [
                            "inclusive",
                            "exclusive",
                            "exempt"
                          ],
                          "type": "string"
                        }
                      },
                      "required": [
                        "amountMinor",
                        "currency"
                      ],
                      "type": "object"
                    },
                    "unitAmountMinor": {
                      "exclusiveMinimum": 0,
                      "maximum": 9007199254740991,
                      "type": "integer"
                    }
                  },
                  "required": [
                    "name"
                  ],
                  "type": "object"
                },
                "quantity": {
                  "exclusiveMinimum": 0,
                  "maximum": 9007199254740991,
                  "type": "integer"
                },
                "saveToCatalog": {
                  "type": "boolean"
                }
              },
              "required": [
                "inlineProduct",
                "quantity"
              ],
              "type": "object"
            }
          ]
        },
        "minItems": 1,
        "type": "array"
      },
      "maxSuccessfulPayments": {
        "exclusiveMinimum": 0,
        "maximum": 9007199254740991,
        "type": "integer"
      },
      "merchantDisplayName": {
        "maxLength": 240,
        "type": "string"
      },
      "merchantLogoUrl": {
        "format": "uri",
        "type": "string"
      },
      "orderReference": {
        "maxLength": 160,
        "type": "string"
      },
      "productName": {
        "maxLength": 240,
        "type": "string"
      },
      "successRedirectUrl": {
        "format": "uri",
        "type": "string"
      },
      "validUntil": {
        "format": "date-time",
        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
        "type": "string"
      }
    },
    "required": [
      "environmentId"
    ],
    "type": "object"
  },
  "CreatePaymentProductRequest": {
    "additionalProperties": false,
    "properties": {
      "currency": {
        "maxLength": 3,
        "minLength": 3,
        "pattern": "^[A-Z]{3}$",
        "type": "string"
      },
      "description": {
        "maxLength": 2000,
        "type": "string"
      },
      "environmentId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "metadata": {
        "additionalProperties": {
          "type": "string"
        },
        "propertyNames": {
          "type": "string"
        },
        "type": "object"
      },
      "name": {
        "maxLength": 240,
        "minLength": 1,
        "type": "string"
      },
      "prices": {
        "items": {
          "additionalProperties": false,
          "properties": {
            "amountMinor": {
              "exclusiveMinimum": 0,
              "maximum": 9007199254740991,
              "type": "integer"
            },
            "currency": {
              "maxLength": 3,
              "minLength": 3,
              "pattern": "^[A-Z]{3}$",
              "type": "string"
            },
            "taxBehavior": {
              "enum": [
                "inclusive",
                "exclusive",
                "exempt"
              ],
              "type": "string"
            }
          },
          "required": [
            "amountMinor",
            "currency"
          ],
          "type": "object"
        },
        "minItems": 1,
        "type": "array"
      },
      "taxBehavior": {
        "enum": [
          "inclusive",
          "exclusive",
          "exempt"
        ],
        "type": "string"
      },
      "type": {
        "const": "one_off",
        "type": "string"
      },
      "unitAmountMinor": {
        "exclusiveMinimum": 0,
        "maximum": 9007199254740991,
        "type": "integer"
      },
      "visibility": {
        "enum": [
          "catalog",
          "link_only"
        ],
        "type": "string"
      }
    },
    "required": [
      "name"
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
  "PaymentLink": {
    "additionalProperties": false,
    "properties": {
      "amountMinor": {
        "exclusiveMinimum": 0,
        "maximum": 9007199254740991,
        "type": "integer"
      },
      "attempts": {
        "items": {
          "additionalProperties": false,
          "properties": {
            "amountMinor": {
              "exclusiveMinimum": 0,
              "maximum": 9007199254740991,
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
              "maxLength": 3,
              "minLength": 3,
              "pattern": "^[A-Z]{3}$",
              "type": "string"
            },
            "executionId": {
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
            "failureReason": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
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
            "executionId",
            "paymentUrl",
            "amountMinor",
            "currency",
            "failureReason",
            "createdAt",
            "updatedAt",
            "paidAt"
          ],
          "type": "object"
        },
        "type": "array"
      },
      "createdAt": {
        "format": "date-time",
        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
        "type": "string"
      },
      "currency": {
        "maxLength": 3,
        "minLength": 3,
        "pattern": "^[A-Z]{3}$",
        "type": "string"
      },
      "description": {
        "anyOf": [
          {
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
                "type": "string"
              },
              {
                "type": "null"
              }
            ]
          },
          "checkoutTitle": {
            "type": "string"
          },
          "merchantDisplayName": {
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
      "embedUrl": {
        "format": "uri",
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
            "currency": {
              "maxLength": 3,
              "minLength": 3,
              "pattern": "^[A-Z]{3}$",
              "type": "string"
            },
            "description": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "itemId": {
              "maxLength": 160,
              "minLength": 3,
              "type": "string"
            },
            "lineTotalMinor": {
              "exclusiveMinimum": 0,
              "maximum": 9007199254740991,
              "type": "integer"
            },
            "metadata": {
              "additionalProperties": {
                "type": "string"
              },
              "propertyNames": {
                "type": "string"
              },
              "type": "object"
            },
            "name": {
              "type": "string"
            },
            "priceId": {
              "maxLength": 160,
              "minLength": 3,
              "type": "string"
            },
            "productId": {
              "maxLength": 160,
              "minLength": 3,
              "type": "string"
            },
            "productOrigin": {
              "enum": [
                "member_created",
                "inline_payment_link"
              ],
              "type": "string"
            },
            "productVersion": {
              "exclusiveMinimum": 0,
              "maximum": 9007199254740991,
              "type": "integer"
            },
            "productVisibility": {
              "enum": [
                "catalog",
                "link_only"
              ],
              "type": "string"
            },
            "quantity": {
              "exclusiveMinimum": 0,
              "maximum": 9007199254740991,
              "type": "integer"
            },
            "taxBehavior": {
              "enum": [
                "inclusive",
                "exclusive",
                "exempt"
              ],
              "type": "string"
            },
            "unitAmountMinor": {
              "exclusiveMinimum": 0,
              "maximum": 9007199254740991,
              "type": "integer"
            }
          },
          "required": [
            "itemId",
            "productId",
            "productOrigin",
            "productVisibility",
            "productVersion",
            "priceId",
            "name",
            "description",
            "quantity",
            "unitAmountMinor",
            "currency",
            "taxBehavior",
            "lineTotalMinor",
            "metadata"
          ],
          "type": "object"
        },
        "type": "array"
      },
      "linkId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "maxSuccessfulPayments": {
        "exclusiveMinimum": 0,
        "maximum": 9007199254740991,
        "type": "integer"
      },
      "projectId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "publicUrl": {
        "format": "uri",
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
        "const": "payments.wathba",
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
        "maximum": 9007199254740991,
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
      "embedUrl",
      "validUntil",
      "maxSuccessfulPayments",
      "successfulPaymentCount",
      "createdAt",
      "updatedAt",
      "attempts"
    ],
    "type": "object"
  },
  "PaymentLinkList": {
    "items": {
      "additionalProperties": false,
      "properties": {
        "amountMinor": {
          "exclusiveMinimum": 0,
          "maximum": 9007199254740991,
          "type": "integer"
        },
        "attempts": {
          "items": {
            "additionalProperties": false,
            "properties": {
              "amountMinor": {
                "exclusiveMinimum": 0,
                "maximum": 9007199254740991,
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
                "maxLength": 3,
                "minLength": 3,
                "pattern": "^[A-Z]{3}$",
                "type": "string"
              },
              "executionId": {
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
              "failureReason": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ]
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
              "executionId",
              "paymentUrl",
              "amountMinor",
              "currency",
              "failureReason",
              "createdAt",
              "updatedAt",
              "paidAt"
            ],
            "type": "object"
          },
          "type": "array"
        },
        "createdAt": {
          "format": "date-time",
          "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
          "type": "string"
        },
        "currency": {
          "maxLength": 3,
          "minLength": 3,
          "pattern": "^[A-Z]{3}$",
          "type": "string"
        },
        "description": {
          "anyOf": [
            {
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
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "checkoutTitle": {
              "type": "string"
            },
            "merchantDisplayName": {
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
        "embedUrl": {
          "format": "uri",
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
              "currency": {
                "maxLength": 3,
                "minLength": 3,
                "pattern": "^[A-Z]{3}$",
                "type": "string"
              },
              "description": {
                "anyOf": [
                  {
                    "type": "string"
                  },
                  {
                    "type": "null"
                  }
                ]
              },
              "itemId": {
                "maxLength": 160,
                "minLength": 3,
                "type": "string"
              },
              "lineTotalMinor": {
                "exclusiveMinimum": 0,
                "maximum": 9007199254740991,
                "type": "integer"
              },
              "metadata": {
                "additionalProperties": {
                  "type": "string"
                },
                "propertyNames": {
                  "type": "string"
                },
                "type": "object"
              },
              "name": {
                "type": "string"
              },
              "priceId": {
                "maxLength": 160,
                "minLength": 3,
                "type": "string"
              },
              "productId": {
                "maxLength": 160,
                "minLength": 3,
                "type": "string"
              },
              "productOrigin": {
                "enum": [
                  "member_created",
                  "inline_payment_link"
                ],
                "type": "string"
              },
              "productVersion": {
                "exclusiveMinimum": 0,
                "maximum": 9007199254740991,
                "type": "integer"
              },
              "productVisibility": {
                "enum": [
                  "catalog",
                  "link_only"
                ],
                "type": "string"
              },
              "quantity": {
                "exclusiveMinimum": 0,
                "maximum": 9007199254740991,
                "type": "integer"
              },
              "taxBehavior": {
                "enum": [
                  "inclusive",
                  "exclusive",
                  "exempt"
                ],
                "type": "string"
              },
              "unitAmountMinor": {
                "exclusiveMinimum": 0,
                "maximum": 9007199254740991,
                "type": "integer"
              }
            },
            "required": [
              "itemId",
              "productId",
              "productOrigin",
              "productVisibility",
              "productVersion",
              "priceId",
              "name",
              "description",
              "quantity",
              "unitAmountMinor",
              "currency",
              "taxBehavior",
              "lineTotalMinor",
              "metadata"
            ],
            "type": "object"
          },
          "type": "array"
        },
        "linkId": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        },
        "maxSuccessfulPayments": {
          "exclusiveMinimum": 0,
          "maximum": 9007199254740991,
          "type": "integer"
        },
        "projectId": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        },
        "publicUrl": {
          "format": "uri",
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
          "const": "payments.wathba",
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
          "maximum": 9007199254740991,
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
        "embedUrl",
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
  "PaymentProduct": {
    "additionalProperties": false,
    "properties": {
      "archivedAt": {
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
      "autoCreatedForLinkId": {
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
      "createdAt": {
        "format": "date-time",
        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
        "type": "string"
      },
      "currency": {
        "maxLength": 3,
        "minLength": 3,
        "pattern": "^[A-Z]{3}$",
        "type": "string"
      },
      "description": {
        "anyOf": [
          {
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
      "id": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "linkedPaymentLinkId": {
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
      "metadata": {
        "additionalProperties": {
          "type": "string"
        },
        "propertyNames": {
          "type": "string"
        },
        "type": "object"
      },
      "name": {
        "type": "string"
      },
      "origin": {
        "enum": [
          "member_created",
          "inline_payment_link"
        ],
        "type": "string"
      },
      "prices": {
        "items": {
          "additionalProperties": false,
          "properties": {
            "amountMinor": {
              "exclusiveMinimum": 0,
              "maximum": 9007199254740991,
              "type": "integer"
            },
            "currency": {
              "maxLength": 3,
              "minLength": 3,
              "pattern": "^[A-Z]{3}$",
              "type": "string"
            },
            "id": {
              "maxLength": 160,
              "minLength": 3,
              "type": "string"
            },
            "priceId": {
              "maxLength": 160,
              "minLength": 3,
              "type": "string"
            },
            "status": {
              "enum": [
                "active",
                "archived"
              ],
              "type": "string"
            },
            "taxBehavior": {
              "enum": [
                "inclusive",
                "exclusive",
                "exempt"
              ],
              "type": "string"
            }
          },
          "required": [
            "id",
            "priceId",
            "currency",
            "amountMinor",
            "taxBehavior",
            "status"
          ],
          "type": "object"
        },
        "type": "array"
      },
      "productId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "projectId": {
        "maxLength": 160,
        "minLength": 3,
        "type": "string"
      },
      "status": {
        "enum": [
          "active",
          "archived"
        ],
        "type": "string"
      },
      "type": {
        "const": "one_off",
        "type": "string"
      },
      "unitAmountMinor": {
        "exclusiveMinimum": 0,
        "maximum": 9007199254740991,
        "type": "integer"
      },
      "updatedAt": {
        "format": "date-time",
        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
        "type": "string"
      },
      "version": {
        "exclusiveMinimum": 0,
        "maximum": 9007199254740991,
        "type": "integer"
      },
      "visibility": {
        "enum": [
          "catalog",
          "link_only"
        ],
        "type": "string"
      }
    },
    "required": [
      "id",
      "productId",
      "projectId",
      "environmentId",
      "status",
      "visibility",
      "origin",
      "autoCreatedForLinkId",
      "name",
      "description",
      "type",
      "prices",
      "unitAmountMinor",
      "currency",
      "metadata",
      "linkedPaymentLinkId",
      "createdAt",
      "updatedAt",
      "archivedAt",
      "version"
    ],
    "type": "object"
  },
  "PaymentProductList": {
    "items": {
      "additionalProperties": false,
      "properties": {
        "archivedAt": {
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
        "autoCreatedForLinkId": {
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
        "createdAt": {
          "format": "date-time",
          "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
          "type": "string"
        },
        "currency": {
          "maxLength": 3,
          "minLength": 3,
          "pattern": "^[A-Z]{3}$",
          "type": "string"
        },
        "description": {
          "anyOf": [
            {
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
        "id": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        },
        "linkedPaymentLinkId": {
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
        "metadata": {
          "additionalProperties": {
            "type": "string"
          },
          "propertyNames": {
            "type": "string"
          },
          "type": "object"
        },
        "name": {
          "type": "string"
        },
        "origin": {
          "enum": [
            "member_created",
            "inline_payment_link"
          ],
          "type": "string"
        },
        "prices": {
          "items": {
            "additionalProperties": false,
            "properties": {
              "amountMinor": {
                "exclusiveMinimum": 0,
                "maximum": 9007199254740991,
                "type": "integer"
              },
              "currency": {
                "maxLength": 3,
                "minLength": 3,
                "pattern": "^[A-Z]{3}$",
                "type": "string"
              },
              "id": {
                "maxLength": 160,
                "minLength": 3,
                "type": "string"
              },
              "priceId": {
                "maxLength": 160,
                "minLength": 3,
                "type": "string"
              },
              "status": {
                "enum": [
                  "active",
                  "archived"
                ],
                "type": "string"
              },
              "taxBehavior": {
                "enum": [
                  "inclusive",
                  "exclusive",
                  "exempt"
                ],
                "type": "string"
              }
            },
            "required": [
              "id",
              "priceId",
              "currency",
              "amountMinor",
              "taxBehavior",
              "status"
            ],
            "type": "object"
          },
          "type": "array"
        },
        "productId": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        },
        "projectId": {
          "maxLength": 160,
          "minLength": 3,
          "type": "string"
        },
        "status": {
          "enum": [
            "active",
            "archived"
          ],
          "type": "string"
        },
        "type": {
          "const": "one_off",
          "type": "string"
        },
        "unitAmountMinor": {
          "exclusiveMinimum": 0,
          "maximum": 9007199254740991,
          "type": "integer"
        },
        "updatedAt": {
          "format": "date-time",
          "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
          "type": "string"
        },
        "version": {
          "exclusiveMinimum": 0,
          "maximum": 9007199254740991,
          "type": "integer"
        },
        "visibility": {
          "enum": [
            "catalog",
            "link_only"
          ],
          "type": "string"
        }
      },
      "required": [
        "id",
        "productId",
        "projectId",
        "environmentId",
        "status",
        "visibility",
        "origin",
        "autoCreatedForLinkId",
        "name",
        "description",
        "type",
        "prices",
        "unitAmountMinor",
        "currency",
        "metadata",
        "linkedPaymentLinkId",
        "createdAt",
        "updatedAt",
        "archivedAt",
        "version"
      ],
      "type": "object"
    },
    "type": "array"
  },
  "PaymentRefund": {
    "additionalProperties": false,
    "properties": {
      "amountMinor": {
        "exclusiveMinimum": 0,
        "maximum": 9007199254740991,
        "type": "integer"
      },
      "createdAt": {
        "format": "date-time",
        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
        "type": "string"
      },
      "currency": {
        "maxLength": 3,
        "minLength": 3,
        "pattern": "^[A-Z]{3}$",
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
  "PaymentRefundList": {
    "items": {
      "additionalProperties": false,
      "properties": {
        "amountMinor": {
          "exclusiveMinimum": 0,
          "maximum": 9007199254740991,
          "type": "integer"
        },
        "createdAt": {
          "format": "date-time",
          "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
          "type": "string"
        },
        "currency": {
          "maxLength": 3,
          "minLength": 3,
          "pattern": "^[A-Z]{3}$",
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
  "RequestPaymentRefund": {
    "additionalProperties": false,
    "properties": {
      "reason": {
        "maxLength": 1000,
        "type": "string"
      }
    },
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
  "UpdatePaymentLinkRequest": {
    "additionalProperties": false,
    "properties": {
      "checkoutDescription": {
        "maxLength": 2000,
        "type": "string"
      },
      "checkoutTitle": {
        "maxLength": 240,
        "type": "string"
      },
      "failureRedirectUrl": {
        "format": "uri",
        "type": "string"
      },
      "maxSuccessfulPayments": {
        "exclusiveMinimum": 0,
        "maximum": 9007199254740991,
        "type": "integer"
      },
      "merchantDisplayName": {
        "maxLength": 240,
        "type": "string"
      },
      "merchantLogoUrl": {
        "format": "uri",
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
        "format": "date-time",
        "pattern": "^(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))T(?:(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d(?:\\.\\d+)?)?(?:Z|([+-](?:[01]\\d|2[0-3]):[0-5]\\d)))$",
        "type": "string"
      }
    },
    "type": "object"
  },
  "UpdatePaymentProductRequest": {
    "additionalProperties": false,
    "properties": {
      "currency": {
        "maxLength": 3,
        "minLength": 3,
        "pattern": "^[A-Z]{3}$",
        "type": "string"
      },
      "description": {
        "maxLength": 2000,
        "type": "string"
      },
      "metadata": {
        "additionalProperties": {
          "type": "string"
        },
        "propertyNames": {
          "type": "string"
        },
        "type": "object"
      },
      "name": {
        "maxLength": 240,
        "minLength": 1,
        "type": "string"
      },
      "prices": {
        "items": {
          "additionalProperties": false,
          "properties": {
            "amountMinor": {
              "exclusiveMinimum": 0,
              "maximum": 9007199254740991,
              "type": "integer"
            },
            "currency": {
              "maxLength": 3,
              "minLength": 3,
              "pattern": "^[A-Z]{3}$",
              "type": "string"
            },
            "taxBehavior": {
              "enum": [
                "inclusive",
                "exclusive",
                "exempt"
              ],
              "type": "string"
            }
          },
          "required": [
            "amountMinor",
            "currency"
          ],
          "type": "object"
        },
        "minItems": 1,
        "type": "array"
      },
      "taxBehavior": {
        "enum": [
          "inclusive",
          "exclusive",
          "exempt"
        ],
        "type": "string"
      },
      "unitAmountMinor": {
        "exclusiveMinimum": 0,
        "maximum": 9007199254740991,
        "type": "integer"
      }
    },
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
        "maxLength": 12,
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
  "WathbaPayment": {
    "additionalProperties": false,
    "properties": {
      "amountMinor": {
        "exclusiveMinimum": 0,
        "maximum": 9007199254740991,
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
        "maxLength": 3,
        "minLength": 3,
        "pattern": "^[A-Z]{3}$",
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
  "WathbaPaymentList": {
    "items": {
      "additionalProperties": false,
      "properties": {
        "amountMinor": {
          "exclusiveMinimum": 0,
          "maximum": 9007199254740991,
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
          "maxLength": 3,
          "minLength": 3,
          "pattern": "^[A-Z]{3}$",
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
  }
} as const;
