import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Oauth Clients
const inputSchema: Record<string, AppBlockConfigField> = {
  clientId: {
    name: "Client Id",
    description: "The client ID",
    type: "string",
    required: true,
  },
};

// Output schema for Delete Oauth Clients
const outputSchema = {};

export default {
  name: "Delete Oauth Clients",
  description: "Deletes delete oauth clients in LaunchDarkly",
  category: "OAuth2 Clients",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { clientId } = input.event.inputConfig;
        const endpoint = `/api/v2/oauth/clients/${clientId}`;

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
