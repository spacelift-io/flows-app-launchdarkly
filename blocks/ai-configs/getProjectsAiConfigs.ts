import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Projects Ai Configs
const inputSchema: Record<string, AppBlockConfigField> = {
  projectKey: {
    name: "Project Key",
    description: "",
    type: "string",
    required: true,
  },
  filter: {
    name: "Filter",
    description: "A filter to apply to the list of AI Configs.",
    type: "string",
    required: false,
  },
  limit: {
    name: "Limit",
    description: "The number of AI Configs to return.",
    type: "number",
    required: false,
  },
  offset: {
    name: "Offset",
    description:
      "Where to start in the list. Use this with pagination. For example, an offset of 10 skips the first ten items and then returns the next items in the list, up to the query `limit`.",
    type: "number",
    required: false,
  },
  sort: {
    name: "Sort",
    description: "A sort to apply to the list of AI Configs.",
    type: "string",
    required: false,
  },
};

// Output schema for Get Projects Ai Configs
const outputSchema = {
  type: "object",
  properties: {
    _links: {
      type: "object",
      properties: {
        first: {
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
    },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
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
            },
            required: ["allowed", "denied"],
          },
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
                required: ["href", "type"],
              },
            },
            required: ["self"],
            description: "The location and content type of related resources",
          },
          description: {
            type: "string",
          },
          key: {
            type: "string",
          },
          _maintainer: {
            type: "object",
          },
          mode: {
            type: "string",
            enum: ["agent", "completion", "judge"],
          },
          name: {
            type: "string",
          },
          tags: {
            type: "array",
            items: {
              type: "string",
            },
          },
          version: {
            type: "integer",
          },
          variations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                _links: {
                  type: "object",
                },
                color: {
                  type: "string",
                },
                comment: {
                  type: "string",
                },
                description: {
                  type: "string",
                  description:
                    "Returns the description for the agent. This is only returned for agent variations.",
                },
                instructions: {
                  type: "string",
                  description:
                    "Returns the instructions for the agent. This is only returned for agent variations.",
                },
                key: {
                  type: "string",
                },
                _id: {
                  type: "string",
                },
                messages: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      content: {
                        type: "string",
                      },
                      role: {
                        type: "string",
                      },
                    },
                    required: ["content", "role"],
                  },
                },
                model: {
                  type: "object",
                },
                modelConfigKey: {
                  type: "string",
                },
                name: {
                  type: "string",
                },
                createdAt: {
                  type: "integer",
                },
                version: {
                  type: "integer",
                },
                state: {
                  type: "string",
                },
                _archivedAt: {
                  type: "integer",
                },
                _publishedAt: {
                  type: "integer",
                },
                tools: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      key: {
                        type: "string",
                        description: "The key of the tool to use.",
                      },
                      version: {
                        type: "integer",
                        description: "The version of the tool.",
                      },
                    },
                    required: ["key", "version"],
                  },
                },
              },
              required: ["_id", "createdAt", "key", "model", "name", "version"],
            },
          },
          createdAt: {
            type: "integer",
          },
          updatedAt: {
            type: "integer",
          },
        },
        required: [
          "createdAt",
          "description",
          "key",
          "name",
          "tags",
          "updatedAt",
          "variations",
          "version",
        ],
      },
    },
    totalCount: {
      type: "integer",
    },
  },
  required: ["items", "totalCount"],
};

export default {
  name: "Get Projects Ai Configs",
  description: "Retrieves get projects ai configs in LaunchDarkly",
  category: "AI Configs",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/ai-configs`;

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
