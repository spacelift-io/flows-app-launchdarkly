import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import {
  makeLaunchDarklyApiRequest,
  filterDefinedParams,
} from "../../utils/apiHelpers.ts";

// Input schema for Update Announcements
const inputSchema: Record<string, AppBlockConfigField> = {
  announcementId: {
    name: "Announcement Id",
    description: "",
    type: "string",
    required: true,
  },
};

// Output schema for Update Announcements
const outputSchema = {
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
};

export default {
  name: "Update Announcements",
  description: "Updates update announcements in LaunchDarkly",
  category: "Announcements",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { announcementId, ...inputData } = input.event.inputConfig;
        const endpoint = `/api/v2/announcements/${announcementId}`;

        const apiKey = input.app.config.apiKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        await events.emit(
          await makeLaunchDarklyApiRequest(apiKey, baseUrl, endpoint, {
            method: "PATCH",
            body: filterDefinedParams(inputData),
          }),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
