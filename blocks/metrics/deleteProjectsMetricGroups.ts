import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Projects Metric Groups
const inputSchema: Record<string, AppBlockConfigField> = {
  metricGroupKey: {
    name: "Metric Group Key",
    description: "The metric group key",
    type: "string",
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
};

// Output schema for Delete Projects Metric Groups
const outputSchema = {};

export default {
  name: "Delete Projects Metric Groups",
  description: "Deletes delete projects metric groups in LaunchDarkly",
  category: "Metrics",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, metricGroupKey } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/metric-groups/${metricGroupKey}`;

        const apiKey = input.app.config.apiKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        await events.emit(
          await makeLaunchDarklyApiRequest(apiKey, baseUrl, endpoint, {
            method: "DELETE",
          }),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
