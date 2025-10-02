import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import {
  makeLaunchDarklyApiRequest,
  filterDefinedParams,
} from "../../utils/apiHelpers.ts";

// Input schema for Create Integrations
const inputSchema: Record<string, AppBlockConfigField> = {
  config: {
    name: "Config",
    description:
      "The unique set of fields required to configure an audit log subscription integration of this type. Refer to the <code>formVariables</code> field in the corresponding <code>manifest.json</code> at https://github.com/launchdarkly/integration-framework/tree/main/integrations for a full list of fields for the integration you wish to configure.",
    type: {
      type: "object",
    },
    required: true,
  },
  integrationKey: {
    name: "Integration Key",
    description: "The integration key",
    type: "string",
    required: true,
  },
  name: {
    name: "Name",
    description: "A human-friendly name for your audit log subscription.",
    type: "string",
    required: true,
  },
  apiKey: {
    name: "Api Key",
    description:
      "Datadog API key. Only necessary for legacy Datadog webhook integrations.",
    type: "string",
    required: false,
  },
  on: {
    name: "On",
    description:
      "Whether or not you want your subscription to actively send events.",
    type: "boolean",
    required: false,
  },
  statements: {
    name: "Statements",
    description:
      "The set of resources you wish to subscribe to audit log notifications for.",
    type: {
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
              "Targeted resources are the resources NOT in this list. The <code>resources</code> field must be empty to use this field.",
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
              "Targeted actions are the actions NOT in this list. The <code>actions</code> field must be empty to use this field.",
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
    },
    required: false,
  },
  tags: {
    name: "Tags",
    description: "An array of tags for this subscription.",
    type: ["string"],
    required: false,
  },
  url: {
    name: "Url",
    description:
      "Slack webhook receiver URL. Only necessary for legacy Slack webhook integrations.",
    type: "string",
    required: false,
  },
};

// Output schema for Create Integrations
const outputSchema = {
  type: "object",
  properties: {
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    _id: {
      type: "string",
      description: "The ID for this integration audit log subscription",
    },
    kind: {
      type: "string",
      description: "The type of integration",
    },
    name: {
      type: "string",
      description: "A human-friendly name for the integration",
    },
    config: {
      type: "object",
      description:
        "Details on configuration for an integration of this type. Refer to the <code>formVariables</code> field in the corresponding <code>manifest.json</code> for a full list of fields for each integration.",
      additionalProperties: true,
    },
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
        },
        required: ["effect"],
      },
      description:
        "Represents a Custom role policy, defining a resource kinds filter the integration audit log subscription responds to.",
    },
    on: {
      type: "boolean",
      description: "Whether the integration is currently active",
    },
    tags: {
      type: "array",
      items: {
        type: "string",
      },
      description: "An array of tags for this integration",
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
        "Details on the allowed and denied actions for this subscription",
    },
    _status: {
      type: "object",
      properties: {
        successCount: {
          type: "integer",
        },
        lastSuccess: {
          type: "integer",
        },
        errorCount: {
          type: "integer",
        },
        errors: {
          type: "array",
          items: {
            type: "object",
            properties: {
              statusCode: {
                type: "integer",
              },
              responseBody: {
                type: "string",
              },
            },
          },
        },
      },
      description:
        "Details on the most recent successes and errors for this integration",
    },
    url: {
      type: "string",
      description:
        "Slack webhook receiver URL. Only used for legacy Slack webhook integrations.",
    },
    apiKey: {
      type: "string",
      description:
        "Datadog API key. Only used for legacy Datadog webhook integrations.",
    },
  },
};

export default {
  name: "Create Integrations",
  description: "Creates create integrations in LaunchDarkly",
  category: "Integration audit log subscriptions",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { integrationKey, ...inputData } = input.event.inputConfig;
        const endpoint = `/api/v2/integrations/${integrationKey}`;

        const apiKey = input.app.config.apiKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        await events.emit(
          await makeLaunchDarklyApiRequest(apiKey, baseUrl, endpoint, {
            method: "POST",
            body: filterDefinedParams(inputData),
          }),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
