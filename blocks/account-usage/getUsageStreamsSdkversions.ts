import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Usage Streams Sdkversions
const inputSchema: Record<string, AppBlockConfigField> = {
  source: {
    name: "Source",
    description:
      "The source of streaming connections to describe. Must be either `client` or `server`.",
    type: "string",
    required: true,
  },
};

// Output schema for Get Usage Streams Sdkversions
const outputSchema = {
  type: "object",
  properties: {
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    sdkVersions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          sdk: {
            type: "string",
            description: 'The SDK name, or "Unknown"',
          },
          version: {
            type: "string",
            description: 'The version number, or "Unknown"',
          },
        },
        required: ["sdk", "version"],
      },
      description: "The list of SDK names and versions",
    },
  },
  required: ["_links", "sdkVersions"],
};

export default {
  name: "Get Usage Streams Sdkversions",
  description: "Retrieves get usage streams sdkversions in LaunchDarkly",
  category: "Account usage",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { source } = input.event.inputConfig;
        const endpoint = `/api/v2/usage/streams/${source}/sdkversions`;

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
