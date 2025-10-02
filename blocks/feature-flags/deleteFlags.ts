import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Flags
const inputSchema: Record<string, AppBlockConfigField> = {
  featureFlagKey: {
    name: "Feature Flag Key",
    description:
      "The feature flag key. The key identifies the flag in your code.",
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

// Output schema for Delete Flags
const outputSchema = {};

export default {
  name: "Delete Flags",
  description: "Deletes delete flags in LaunchDarkly",
  category: "Feature flags",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, featureFlagKey } = input.event.inputConfig;
        const endpoint = `/api/v2/flags/${projectKey}/${featureFlagKey}`;

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
