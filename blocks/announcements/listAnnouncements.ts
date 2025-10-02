import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Announcements
const inputSchema: Record<string, AppBlockConfigField> = {
  limit: {
    name: "Limit",
    description: "The number of announcements to return.",
    type: "number",
    required: false,
  },
  offset: {
    name: "Offset",
    description:
      "Where to start in the list. Use this with pagination. For example, an offset of 10 skips the first ten items and then returns the next items in the list, up to the query `limit`.",
    type: "number",
    required: false,
  },
  status: {
    name: "Status",
    description: "Filter announcements by status.",
    type: "string",
    required: false,
  },
};

// Output schema for List Announcements
const outputSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "The ID of the announcement",
          },
          isDismissible: {
            type: "boolean",
            description: "true if the announcement is dismissible",
          },
          message: {
            type: "string",
            description: "The message of the announcement",
          },
          startTime: {
            type: "integer",
            description:
              "The start time of the announcement. This is a Unix timestamp in milliseconds.",
          },
          endTime: {
            type: "integer",
            description:
              "The end time of the announcement. This is a Unix timestamp in milliseconds.",
          },
          severity: {
            type: "string",
            enum: ["info", "warning", "critical"],
            description: "The severity of the announcement",
          },
          _status: {
            type: "string",
            enum: ["active", "inactive", "scheduled"],
            description: "The status of the announcement",
          },
          _links: {
            type: "object",
            properties: {
              parent: {
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
            },
            required: ["parent"],
          },
        },
        required: [
          "_id",
          "_links",
          "_status",
          "isDismissible",
          "message",
          "severity",
          "startTime",
        ],
        description: "Announcement response",
      },
    },
    _links: {
      type: "object",
    },
  },
  required: ["_links", "items"],
};

export default {
  name: "List Announcements",
  description: "Retrieves list announcements in LaunchDarkly",
  category: "Announcements",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const endpoint = `/api/v2/announcements`;

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
