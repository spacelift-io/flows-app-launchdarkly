import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import {
  makeLaunchDarklyApiRequest,
  filterDefinedParams,
} from "../../utils/apiHelpers.ts";

// Input schema for Create Integration Capabilities Flag Import Trigger
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

// Output schema for Create Integration Capabilities Flag Import Trigger
const outputSchema = {};

export default {
  name: "Create Integration Capabilities Flag Import Trigger",
  description:
    "Creates create integration capabilities flag import trigger in LaunchDarkly",
  category: "Flag import configurations",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, integrationKey, integrationId, ...inputData } =
          input.event.inputConfig;
        const endpoint = `/api/v2/integration-capabilities/flag-import/${projectKey}/${integrationKey}/${integrationId}/trigger`;

        const apiKey = input.app.config.apiKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        await events.emit(
          await makeLaunchDarklyApiRequest(apiKey, baseUrl, endpoint, {
            method: "POST",
            body: filterDefinedParams(inputData),
          }),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
