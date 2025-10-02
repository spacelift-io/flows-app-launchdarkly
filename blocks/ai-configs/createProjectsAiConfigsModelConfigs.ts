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

// Input schema for Create Projects Ai Configs Model Configs
const inputSchema: Record<string, AppBlockConfigField> = {
  id: {
    name: "Id",
    description: "Identifier for the model, for use with third party providers",
    type: "string",
    required: true,
  },
  key: {
    name: "Key",
    description: "Unique key for the model",
    type: "string",
    required: true,
  },
  name: {
    name: "Name",
    description: "Human readable name of the model",
    type: "string",
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "",
    type: "string",
    required: true,
  },
  costPerInputToken: {
    name: "Cost Per Input Token",
    description: "Cost per input token in USD",
    type: "number",
    required: false,
  },
  costPerOutputToken: {
    name: "Cost Per Output Token",
    description: "Cost per output token in USD",
    type: "number",
    required: false,
  },
  customParams: {
    name: "Custom Params",
    description: "",
    type: {
      type: "object",
    },
    required: false,
  },
  icon: {
    name: "Icon",
    description: "Icon for the model",
    type: "string",
    required: false,
  },
  params: {
    name: "Params",
    description: "",
    type: {
      type: "object",
    },
    required: false,
  },
  provider: {
    name: "Provider",
    description: "Provider for the model",
    type: "string",
    required: false,
  },
  tags: {
    name: "Tags",
    description: "",
    type: ["string"],
    required: false,
  },
};

// Output schema for Create Projects Ai Configs Model Configs
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
  name: "Create Projects Ai Configs Model Configs",
  description:
    "Creates create projects ai configs model configs in LaunchDarkly",
  category: "AI Configs",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, ...inputData } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/ai-configs/model-configs`;

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
