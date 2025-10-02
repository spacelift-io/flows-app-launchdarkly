import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Integrations
const inputSchema: Record<string, AppBlockConfigField> = {
  id: {
    name: "Id",
    description: "The subscription ID",
    type: "string",
    required: true,
  },
  integrationKey: {
    name: "Integration Key",
    description: "The integration key",
    type: "string",
    required: true,
  },
};

// Output schema for Delete Integrations
const outputSchema = {};

export default {
  name: "Delete Integrations",
  description: "Deletes delete integrations in LaunchDarkly",
  category: "Integration audit log subscriptions",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { integrationKey, id } = input.event.inputConfig;
        const endpoint = `/api/v2/integrations/${integrationKey}/${id}`;

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
