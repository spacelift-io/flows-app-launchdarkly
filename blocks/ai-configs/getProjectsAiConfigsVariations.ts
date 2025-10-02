import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Projects Ai Configs Variations
const inputSchema: Record<string, AppBlockConfigField> = {
  configKey: {
    name: "Config Key",
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
  variationKey: {
    name: "Variation Key",
    description: "",
    type: "string",
    required: true,
  },
};

// Output schema for Get Projects Ai Configs Variations
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
      },
    },
    totalCount: {
      type: "integer",
    },
  },
  required: ["items", "totalCount"],
};

export default {
  name: "Get Projects Ai Configs Variations",
  description: "Retrieves get projects ai configs variations in LaunchDarkly",
  category: "AI Configs",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, configKey, variationKey } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/ai-configs/${configKey}/variations/${variationKey}`;

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
