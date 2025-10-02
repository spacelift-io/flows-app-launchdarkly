import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Integration Configurations
const inputSchema: Record<string, AppBlockConfigField> = {
  integrationConfigurationId: {
    name: "Integration Configuration Id",
    description: "The ID of the integration configuration to be deleted",
    type: "string",
    required: true,
  },
};

// Output schema for Delete Integration Configurations
const outputSchema = {};

export default {
  name: "Delete Integration Configurations",
  description: "Deletes delete integration configurations in LaunchDarkly",
  category: "Integrations",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { integrationConfigurationId } = input.event.inputConfig;
        const endpoint = `/api/v2/integration-configurations/${integrationConfigurationId}`;

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
