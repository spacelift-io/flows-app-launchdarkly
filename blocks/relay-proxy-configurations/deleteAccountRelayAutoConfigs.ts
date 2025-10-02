import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Account Relay Auto Configs
const inputSchema: Record<string, AppBlockConfigField> = {
  id: {
    name: "Id",
    description: "The relay auto config id",
    type: "string",
    required: true,
  },
};

// Output schema for Delete Account Relay Auto Configs
const outputSchema = {};

export default {
  name: "Delete Account Relay Auto Configs",
  description: "Deletes delete account relay auto configs in LaunchDarkly",
  category: "Relay Proxy configurations",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { id } = input.event.inputConfig;
        const endpoint = `/api/v2/account/relay-auto-configs/${id}`;

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
