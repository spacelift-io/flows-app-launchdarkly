import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Projects Ai Configs Model Configs2
const inputSchema: Record<string, AppBlockConfigField> = {
  modelConfigKey: {
    name: "Model Config Key",
    description: "",
    type: "string",
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "",
    type: "string",
    required: true,
  },
};

// Output schema for Get Projects Ai Configs Model Configs2
const outputSchema = {
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
    name: {
      type: "string",
      description: "Human readable name of the model",
    },
    key: {
      type: "string",
      description: "Unique key for the model",
    },
    id: {
      type: "string",
      description:
        "Identifier for the model, for use with third party providers",
    },
    icon: {
      type: "string",
      description: "Icon for the model",
    },
    provider: {
      type: "string",
      description: "Provider for the model",
    },
    global: {
      type: "boolean",
      description: "Whether the model is global",
    },
    params: {
      type: "object",
    },
    customParams: {
      type: "object",
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
    costPerInputToken: {
      type: "number",
      description: "Cost per input token in USD",
    },
    costPerOutputToken: {
      type: "number",
      description: "Cost per output token in USD",
    },
    isRestricted: {
      type: "boolean",
      description: "Whether the model is restricted",
    },
  },
  required: ["global", "id", "isRestricted", "key", "name", "tags", "version"],
};

export default {
  name: "Get Projects Ai Configs Model Configs2",
  description:
    "Retrieves get projects ai configs model configs2 in LaunchDarkly",
  category: "AI Configs",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, modelConfigKey } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/ai-configs/model-configs/${modelConfigKey}`;

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
