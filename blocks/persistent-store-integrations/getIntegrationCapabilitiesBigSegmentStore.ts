import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Integration Capabilities Big Segment Store
const inputSchema: Record<string, AppBlockConfigField> = {};

// Output schema for Get Integration Capabilities Big Segment Store
const outputSchema = {
  type: "object",
  properties: {
    _links: {
      type: "object",
      properties: {
        self: {
          type: "object",
          properties: {
            href: {
              type: "string",
            },
            type: {
              type: "string",
            },
          },
        },
      },
      required: ["self"],
      description: "The location and content type of related resources",
    },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _links: {
            type: "object",
            description: "The location and content type of related resources",
          },
          _id: {
            type: "string",
            description: "The integration ID",
          },
          integrationKey: {
            type: "string",
            enum: ["redis", "dynamodb"],
            description: "The integration key",
          },
          projectKey: {
            type: "string",
            description: "The project key",
          },
          environmentKey: {
            type: "string",
            description: "The environment key",
          },
          config: {
            type: "object",
            description:
              "The delivery configuration for the given integration provider. Only included when requesting a single integration by ID. Refer to the <code>formVariables</code> field in the corresponding <code>manifest.json</code> for a full list of fields for each integration.",
            additionalProperties: true,
          },
          on: {
            type: "boolean",
            description: "Whether the configuration is turned on",
          },
          tags: {
            type: "array",
            items: {
              type: "string",
            },
            description: "List of tags for this configuration",
          },
          name: {
            type: "string",
            description: "Name of the configuration",
          },
          version: {
            type: "integer",
            description: "Version of the current configuration",
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
              "Details on the allowed and denied actions for this configuration",
          },
          _status: {
            type: "object",
            properties: {
              available: {
                type: "boolean",
                description:
                  "Whether the persistent store integration is fully synchronized with the LaunchDarkly environment, and the <code>lastSync</code> occurred within a few minutes",
              },
              potentiallyStale: {
                type: "boolean",
                description:
                  "Whether the persistent store integration may not be fully synchronized with the LaunchDarkly environment. <code>true</code> if the integration could be stale.",
              },
              lastSync: {
                type: "integer",
                description:
                  "Timestamp of when the most recent successful sync occurred between the persistent store integration and the LaunchDarkly environment.",
              },
              lastError: {
                type: "integer",
                description:
                  "Timestamp of when the most recent synchronization error occurred, if any",
              },
              errors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    statusCode: {
                      type: "integer",
                    },
                    message: {
                      type: "string",
                    },
                    timestamp: {
                      type: "integer",
                    },
                  },
                },
              },
            },
            description:
              "Details on the connection status of the persistent store integration",
          },
        },
        required: [
          "_links",
          "_id",
          "integrationKey",
          "projectKey",
          "environmentKey",
          "config",
          "on",
          "tags",
          "name",
          "version",
          "_status",
        ],
      },
      description: "An array of persistent store integration configurations",
    },
  },
  required: ["_links", "items"],
};

export default {
  name: "Get Integration Capabilities Big Segment Store",
  description:
    "Retrieves get integration capabilities big segment store in LaunchDarkly",
  category: "Persistent store integrations",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const endpoint = `/api/v2/integration-capabilities/big-segment-store`;

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
