import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Webhooks
const inputSchema: Record<string, AppBlockConfigField> = {
  id: {
    name: "Id",
    description: "The ID of the webhook to delete",
    type: "string",
    required: true,
  },
};

// Output schema for Delete Webhooks
const outputSchema = {};

export default {
  name: "Delete Webhooks",
  description: "Deletes delete webhooks in LaunchDarkly",
  category: "Webhooks",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { id } = input.event.inputConfig;
        const endpoint = `/api/v2/webhooks/${id}`;

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
