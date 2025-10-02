import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Usage Mau Sdks
const inputSchema: Record<string, AppBlockConfigField> = {
  from: {
    name: "From",
    description:
      "The data returned starts from this timestamp. Defaults to seven days ago. The timestamp is in Unix milliseconds, for example, 1656694800000.",
    type: "string",
    required: false,
  },
  sdktype: {
    name: "Sdktype",
    description:
      "The type of SDK with monthly active users (MAU) to list. Must be either `client` or `server`.",
    type: "string",
    required: false,
  },
  to: {
    name: "To",
    description:
      "The data returned ends at this timestamp. Defaults to the current time. The timestamp is in Unix milliseconds, for example, 1657904400000.",
    type: "string",
    required: false,
  },
};

// Output schema for Get Usage Mau Sdks
const outputSchema = {
  type: "object",
  properties: {
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    sdks: {
      type: "array",
      items: {
        type: "string",
      },
      description: "The list of SDK names",
    },
  },
  required: ["_links", "sdks"],
};

export default {
  name: "Get Usage Mau Sdks",
  description: "Retrieves get usage mau sdks in LaunchDarkly",
  category: "Account usage",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const endpoint = `/api/v2/usage/mau/sdks`;

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
