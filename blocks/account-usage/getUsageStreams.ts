import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Usage Streams
const inputSchema: Record<string, AppBlockConfigField> = {
  source: {
    name: "Source",
    description:
      "The source of streaming connections to describe. Must be either `client` or `server`.",
    type: "string",
    required: true,
  },
  from: {
    name: "From",
    description:
      "The series of data returned starts from this timestamp. Defaults to 30 days ago.",
    type: "string",
    required: false,
  },
  to: {
    name: "To",
    description:
      "The series of data returned ends at this timestamp. Defaults to the current time.",
    type: "string",
    required: false,
  },
  tz: {
    name: "Tz",
    description:
      "The timezone to use for breaks between days when returning daily data.",
    type: "string",
    required: false,
  },
};

// Output schema for Get Usage Streams
const outputSchema = {
  type: "object",
  properties: {
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    metadata: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: true,
      },
      description: "Metadata about each series",
    },
    series: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: true,
      },
      description:
        "An array of data points with timestamps. Each element of the array is an object with a 'time' field, whose value is the timestamp, and one or more key fields. If there are multiple key fields, they are labeled '0', '1', and so on, and are explained in the <code>metadata</code>.",
    },
  },
  required: ["_links", "metadata", "series"],
};

export default {
  name: "Get Usage Streams",
  description: "Retrieves get usage streams in LaunchDarkly",
  category: "Account usage",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { source } = input.event.inputConfig;
        const endpoint = `/api/v2/usage/streams/${source}`;

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
