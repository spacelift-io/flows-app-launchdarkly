import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Integration Capabilities Flag Import
const inputSchema: Record<string, AppBlockConfigField> = {
  integrationId: {
    name: "Integration Id",
    description: "The integration ID",
    type: "string",
    required: true,
  },
  integrationKey: {
    name: "Integration Key",
    description: "The integration key",
    type: "string",
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
};

// Output schema for Delete Integration Capabilities Flag Import
const outputSchema = {};

export default {
  name: "Delete Integration Capabilities Flag Import",
  description:
    "Deletes delete integration capabilities flag import in LaunchDarkly",
  category: "Flag import configurations",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, integrationKey, integrationId } =
          input.event.inputConfig;
        const endpoint = `/api/v2/integration-capabilities/flag-import/${projectKey}/${integrationKey}/${integrationId}`;

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
