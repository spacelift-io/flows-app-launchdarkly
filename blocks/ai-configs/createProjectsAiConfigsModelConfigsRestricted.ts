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

// Input schema for Create Projects Ai Configs Model Configs Restricted
const inputSchema: Record<string, AppBlockConfigField> = {
  keys: {
    name: "Keys",
    description: "",
    type: ["string"],
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "",
    type: "string",
    required: true,
  },
};

// Output schema for Create Projects Ai Configs Model Configs Restricted
const outputSchema = {
  type: "object",
  properties: {
    successes: {
      type: "array",
      items: {
        type: "string",
      },
    },
    errors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: {
            type: "string",
          },
          message: {
            type: "string",
          },
          code: {
            type: "integer",
          },
        },
        required: ["code", "key", "message"],
      },
    },
  },
  required: ["errors", "successes"],
};

export default {
  name: "Create Projects Ai Configs Model Configs Restricted",
  description:
    "Creates create projects ai configs model configs restricted in LaunchDarkly",
  category: "AI Configs",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, ...inputData } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/ai-configs/model-configs/restricted`;

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
