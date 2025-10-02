import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Templates
const inputSchema: Record<string, AppBlockConfigField> = {
  templateKey: {
    name: "Template Key",
    description: "The template key",
    type: "string",
    required: true,
  },
};

// Output schema for Delete Templates
const outputSchema = {};

export default {
  name: "Delete Templates",
  description: "Deletes delete templates in LaunchDarkly",
  category: "Workflow templates",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { templateKey } = input.event.inputConfig;
        const endpoint = `/api/v2/templates/${templateKey}`;

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
