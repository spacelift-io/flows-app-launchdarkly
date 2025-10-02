import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Integration Configurations Keys
const inputSchema: Record<string, AppBlockConfigField> = {
  integrationKey: {
    name: "Integration Key",
    description: "Integration key",
    type: "string",
    required: true,
  },
};

// Output schema for Get Integration Configurations Keys
const outputSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _links: {
            type: "object",
            description: "The location and content type of related resources",
            additionalProperties: true,
          },
          _id: {
            type: "string",
            description:
              "The unique identifier for this integration configuration",
          },
          name: {
            type: "string",
            description: "A human-friendly name for the integration",
          },
          _createdAt: {
            type: "integer",
            description: "The time the integration configuration was created",
          },
          _integrationKey: {
            type: "string",
            description: "The type of integration",
          },
          tags: {
            type: "array",
            items: {
              type: "string",
            },
            description: "An array of tags for this integration",
          },
          enabled: {
            type: "boolean",
            description: "Whether the integration is currently active",
          },
          _access: {
            type: "object",
            properties: {
              denied: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    action: {
                      type: "string",
                    },
                    reason: {
                      type: "object",
                      properties: {
                        resources: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description: "Resource specifier strings",
                        },
                        notResources: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Targeted resources are the resources NOT in this list. The <code>resources</code> and <code>notActions</code> fields must be empty to use this field.",
                        },
                        actions: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description: "Actions to perform on a resource",
                        },
                        notActions: {
                          type: "array",
                          items: {
                            type: "object",
                          },
                          description:
                            "Targeted actions are the actions NOT in this list. The <code>actions</code> and <code>notResources</code> fields must be empty to use this field.",
                        },
                        effect: {
                          type: "string",
                          enum: ["allow", "deny"],
                          description:
                            "Whether this statement should allow or deny actions on the resources.",
                        },
                        role_name: {
                          type: "string",
                        },
                      },
                      required: ["effect"],
                    },
                  },
                  required: ["action", "reason"],
                },
              },
              allowed: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    reason: {
                      type: "object",
                      properties: {
                        resources: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description: "Resource specifier strings",
                        },
                        notResources: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Targeted resources are the resources NOT in this list. The <code>resources</code> and <code>notActions</code> fields must be empty to use this field.",
                        },
                        actions: {
                          type: "array",
                          items: {
                            type: "object",
                          },
                          description: "Actions to perform on a resource",
                        },
                        notActions: {
                          type: "array",
                          items: {
                            type: "object",
                          },
                          description:
                            "Targeted actions are the actions NOT in this list. The <code>actions</code> and <code>notResources</code> fields must be empty to use this field.",
                        },
                        effect: {
                          type: "string",
                          enum: ["allow", "deny"],
                          description:
                            "Whether this statement should allow or deny actions on the resources.",
                        },
                        role_name: {
                          type: "string",
                        },
                      },
                      required: ["effect"],
                    },
                  },
                  required: ["reason"],
                },
              },
            },
            required: ["denied", "allowed"],
            description:
              "Details on the allowed and denied actions for this integration configuration",
          },
          configValues: {
            type: "object",
            description:
              "Details on configuration for an integration of this type. Refer to the <code>formVariables</code> field in the corresponding <code>manifest.json</code> for a full list of fields for each integration.",
            additionalProperties: true,
          },
          capabilityConfig: {
            type: "object",
            properties: {
              approvals: {
                type: "object",
                properties: {
                  additionalFormVariables: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        key: {
                          type: "string",
                        },
                        name: {
                          type: "string",
                        },
                        type: {
                          type: "string",
                        },
                        description: {
                          type: "string",
                        },
                        placeholder: {
                          type: "string",
                        },
                        isOptional: {
                          type: "boolean",
                        },
                        allowedValues: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                        dynamicOptions: {
                          type: "object",
                          properties: {
                            endpoint: {
                              type: "object",
                              properties: {
                                headers: {
                                  type: "array",
                                  items: {
                                    type: "object",
                                    properties: {
                                      name: {
                                        type: "string",
                                      },
                                      value: {
                                        type: "string",
                                      },
                                    },
                                  },
                                },
                                hmacSignature: {
                                  type: "object",
                                  properties: {
                                    headerName: {
                                      type: "string",
                                    },
                                    hmacSecretFormVariableKey: {
                                      type: "string",
                                    },
                                  },
                                },
                                method: {
                                  type: "string",
                                },
                                url: {
                                  type: "string",
                                },
                              },
                            },
                            parser: {
                              type: "object",
                              properties: {
                                optionsItems: {
                                  type: "object",
                                  properties: {
                                    label: {
                                      type: "string",
                                    },
                                    value: {
                                      type: "string",
                                    },
                                  },
                                },
                                optionsPath: {
                                  type: "string",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    description:
                      "The additional form variables for the approvals capability",
                  },
                },
                description:
                  "The approvals capability configuration for this integration",
              },
              auditLogEventsHook: {
                type: "object",
                properties: {
                  statements: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        resources: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description: "Resource specifier strings",
                        },
                        notResources: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Targeted resources are the resources NOT in this list. The <code>resources</code> and <code>notActions</code> fields must be empty to use this field.",
                        },
                        actions: {
                          type: "array",
                          items: {
                            type: "object",
                          },
                          description: "Actions to perform on a resource",
                        },
                        notActions: {
                          type: "array",
                          items: {
                            type: "object",
                          },
                          description:
                            "Targeted actions are the actions NOT in this list. The <code>actions</code> and <code>notResources</code> fields must be empty to use this field.",
                        },
                        effect: {
                          type: "string",
                          enum: ["allow", "deny"],
                          description:
                            "Whether this statement should allow or deny actions on the resources.",
                        },
                      },
                      required: ["effect"],
                    },
                    description:
                      "The set of resources you wish to subscribe to audit log notifications for.",
                  },
                },
                description:
                  "The audit log events hook capability configuration for the integration",
              },
            },
            description: "The capability configuration for the integration",
          },
        },
        required: ["_links", "_id", "name"],
      },
      description: "An array of integration configurations",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
  },
  required: ["items", "_links"],
};

export default {
  name: "Get Integration Configurations Keys",
  description: "Retrieves get integration configurations keys in LaunchDarkly",
  category: "Integrations",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { integrationKey } = input.event.inputConfig;
        const endpoint = `/api/v2/integration-configurations/keys/${integrationKey}`;

        const apiKey = input.app.config.apiKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        await events.emit(
          await makeLaunchDarklyApiRequest(apiKey, baseUrl, endpoint, {
            method: "GET",
          }),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
