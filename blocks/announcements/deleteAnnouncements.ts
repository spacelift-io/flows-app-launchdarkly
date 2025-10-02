import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Announcements
const inputSchema: Record<string, AppBlockConfigField> = {
  announcementId: {
    name: "Announcement Id",
    description: "",
    type: "string",
    required: true,
  },
};

// Output schema for Delete Announcements
const outputSchema = {};

export default {
  name: "Delete Announcements",
  description: "Deletes delete announcements in LaunchDarkly",
  category: "Announcements",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { announcementId } = input.event.inputConfig;
        const endpoint = `/api/v2/announcements/${announcementId}`;

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
