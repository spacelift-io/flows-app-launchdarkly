import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Projects Ai Configs Metrics By Variation
const inputSchema: Record<string, AppBlockConfigField> = {
  configKey: {
    name: "Config Key",
    description: "",
    type: "string",
    required: true,
  },
  env: {
    name: "Env",
    description:
      "An environment key. Only metrics from this environment will be included.",
    type: "string",
    required: true,
  },
  from: {
    name: "From",
    description: "The starting time, as milliseconds since epoch (inclusive).",
    type: "number",
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "",
    type: "string",
    required: true,
  },
  to: {
    name: "To",
    description:
      "The ending time, as milliseconds since epoch (exclusive). May not be more than 100 days after `from`.",
    type: "number",
    required: true,
  },
};

// Output schema for Get Projects Ai Configs Metrics By Variation
const outputSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      variationKey: {
        type: "string",
      },
      metrics: {
        type: "object",
        properties: {
          inputTokens: {
            type: "integer",
          },
          outputTokens: {
            type: "integer",
          },
          totalTokens: {
            type: "integer",
          },
          generationCount: {
            type: "integer",
            description: "Number of attempted generations",
          },
          generationSuccessCount: {
            type: "integer",
            description: "Number of successful generations",
          },
          generationErrorCount: {
            type: "integer",
            description: "Number of generations with errors",
          },
          thumbsUp: {
            type: "integer",
          },
          thumbsDown: {
            type: "integer",
          },
          durationMs: {
            type: "integer",
          },
          timeToFirstTokenMs: {
            type: "integer",
          },
          satisfactionRating: {
            type: "number",
            description:
              "A value between 0 and 1 representing satisfaction rating",
          },
          inputCost: {
            type: "number",
            description: "Cost of input tokens in USD",
          },
          outputCost: {
            type: "number",
            description: "Cost of output tokens in USD",
          },
        },
      },
    },
  },
};

export default {
  name: "Get Projects Ai Configs Metrics By Variation",
  description:
    "Retrieves get projects ai configs metrics by variation in LaunchDarkly",
  category: "AI Configs",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, configKey } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/ai-configs/${configKey}/metrics-by-variation`;

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
