import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Webhooks2
const inputSchema: Record<string, AppBlockConfigField> = {
  id: {
    name: "Id",
    description: "The ID of the webhook",
    type: "string",
    required: true,
  },
};

// Output schema for List Webhooks2
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
      description: "The ID of this webhook",
    },
    name: {
      type: "string",
      description: "A human-readable name for this webhook",
    },
    url: {
      type: "string",
      description:
        "The URL to which LaunchDarkly sends an HTTP POST payload for this webhook",
    },
    secret: {
      type: "string",
      description: "The secret for this webhook",
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
        "Represents a Custom role policy, defining a resource kinds filter the webhook responds to.",
    },
    on: {
      type: "boolean",
      description: "Whether or not this webhook is enabled",
    },
    tags: {
      type: "array",
      items: {
        type: "string",
      },
      description: "List of tags for this webhook",
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
      description: "Details on the allowed and denied actions for this webhook",
    },
  },
  required: ["_links", "_id", "url", "on", "tags"],
};

export default {
  name: "List Webhooks2",
  description: "Retrieves list webhooks2 in LaunchDarkly",
  category: "Webhooks",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { id } = input.event.inputConfig;
        const endpoint = `/api/v2/webhooks/${id}`;

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
