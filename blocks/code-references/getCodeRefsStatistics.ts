import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Code Refs Statistics
const inputSchema: Record<string, AppBlockConfigField> = {};

// Output schema for Get Code Refs Statistics
const outputSchema = {
  type: "object",
  properties: {
    projects: {
      type: "array",
      items: {
        type: "object",
        properties: {
          href: {
            type: "string",
          },
          type: {
            type: "string",
          },
        },
      },
      description:
        "The location and content type of all projects that have code references",
    },
    self: {
      type: "object",
      description: "The location and content type for accessing this resource",
    },
  },
};

export default {
  name: "Get Code Refs Statistics",
  description: "Retrieves get code refs statistics in LaunchDarkly",
  category: "Code references",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const endpoint = `/api/v2/code-refs/statistics`;

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
