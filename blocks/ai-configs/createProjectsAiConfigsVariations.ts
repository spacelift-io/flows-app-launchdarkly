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

// Input schema for Create Projects Ai Configs Variations
const inputSchema: Record<string, AppBlockConfigField> = {
  configKey: {
    name: "Config Key",
    description: "",
    type: "string",
    required: true,
  },
  key: {
    name: "Key",
    description: "",
    type: "string",
    required: true,
  },
  messages: {
    name: "Messages",
    description: "",
    type: {
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
    required: true,
  },
  name: {
    name: "Name",
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
  comment: {
    name: "Comment",
    description: "Human-readable description of this variation",
    type: "string",
    required: false,
  },
  description: {
    name: "Description",
    description:
      "Returns the description for the agent. This is only returned for agent variations.",
    type: "string",
    required: false,
  },
  instructions: {
    name: "Instructions",
    description:
      "Returns the instructions for the agent. This is only returned for agent variations.",
    type: "string",
    required: false,
  },
  model: {
    name: "Model",
    description: "",
    type: {
      type: "object",
    },
    required: false,
  },
  modelConfigKey: {
    name: "Model Config Key",
    description: "",
    type: "string",
    required: false,
  },
  toolKeys: {
    name: "Tool Keys",
    description:
      "List of tool keys to use for this variation. The latest version of the tool will be used.",
    type: ["string"],
    required: false,
  },
  tools: {
    name: "Tools",
    description:
      "List of tools to use for this variation. The latest version of the tool will be used.",
    type: {
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
    required: false,
  },
};

// Output schema for Create Projects Ai Configs Variations
const outputSchema = {
  type: "object",
  properties: {
    _links: {
      type: "object",
      properties: {
        parent: {
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
      required: ["parent"],
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
};

export default {
  name: "Create Projects Ai Configs Variations",
  description: "Creates create projects ai configs variations in LaunchDarkly",
  category: "AI Configs",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, configKey, ...inputData } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/ai-configs/${configKey}/variations`;

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
