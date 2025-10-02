import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Engineering Insights Insights Groups
const inputSchema: Record<string, AppBlockConfigField> = {
  insightGroupKey: {
    name: "Insight Group Key",
    description: "The insight group key",
    type: "string",
    required: true,
  },
};

// Output schema for Delete Engineering Insights Insights Groups
const outputSchema = {};

export default {
  name: "Delete Engineering Insights Insights Groups",
  description:
    "Deletes delete engineering insights insights groups in LaunchDarkly",
  category: "Insights scores",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { insightGroupKey } = input.event.inputConfig;
        const endpoint = `/api/v2/engineering-insights/insights/groups/${insightGroupKey}`;

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
