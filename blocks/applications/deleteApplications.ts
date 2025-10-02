import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Applications
const inputSchema: Record<string, AppBlockConfigField> = {
  applicationKey: {
    name: "Application Key",
    description: "The application key",
    type: "string",
    required: true,
  },
};

// Output schema for Delete Applications
const outputSchema = {};

export default {
  name: "Delete Applications",
  description: "Deletes delete applications in LaunchDarkly",
  category: "Applications",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { applicationKey } = input.event.inputConfig;
        const endpoint = `/api/v2/applications/${applicationKey}`;

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
