import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Metrics
const inputSchema: Record<string, AppBlockConfigField> = {
  metricKey: {
    name: "Metric Key",
    description: "The metric key",
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

// Output schema for Delete Metrics
const outputSchema = {};

export default {
  name: "Delete Metrics",
  description: "Deletes delete metrics in LaunchDarkly",
  category: "Metrics",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, metricKey } = input.event.inputConfig;
        const endpoint = `/api/v2/metrics/${projectKey}/${metricKey}`;

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
