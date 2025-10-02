import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List
const inputSchema: Record<string, AppBlockConfigField> = {};

// Output schema for List
const outputSchema = {
  type: "object",
  properties: {
    links: {
      type: "object",
      additionalProperties: true,
    },
  },
  required: ["links"],
};

export default {
  name: "List",
  description: "Retrieves list in LaunchDarkly",
  category: "Other",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const endpoint = `/api/v2`;

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
