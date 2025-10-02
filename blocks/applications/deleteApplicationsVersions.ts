import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Applications Versions
const inputSchema: Record<string, AppBlockConfigField> = {
  applicationKey: {
    name: "Application Key",
    description: "The application key",
    type: "string",
    required: true,
  },
  versionKey: {
    name: "Version Key",
    description: "The application version key",
    type: "string",
    required: true,
  },
};

// Output schema for Delete Applications Versions
const outputSchema = {};

export default {
  name: "Delete Applications Versions",
  description: "Deletes delete applications versions in LaunchDarkly",
  category: "Applications",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { applicationKey, versionKey } = input.event.inputConfig;
        const endpoint = `/api/v2/applications/${applicationKey}/versions/${versionKey}`;

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
