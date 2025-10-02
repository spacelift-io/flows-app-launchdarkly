import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Flag Status
const inputSchema: Record<string, AppBlockConfigField> = {
  featureFlagKey: {
    name: "Feature Flag Key",
    description: "The feature flag key",
    type: "string",
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
  env: {
    name: "Env",
    description: "Optional environment filter",
    type: "string",
    required: false,
  },
};

// Output schema for List Flag Status
const outputSchema = {
  type: "object",
  properties: {
    environments: {
      type: "object",
      description: "Flag status for environment.",
      additionalProperties: true,
    },
    key: {
      type: "string",
      description: "feature flag key",
    },
    _links: {
      type: "object",
      additionalProperties: true,
    },
  },
  required: ["environments", "key", "_links"],
};

export default {
  name: "List Flag Status",
  description: "Retrieves list flag status in LaunchDarkly",
  category: "Feature flags",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, featureFlagKey } = input.event.inputConfig;
        const endpoint = `/api/v2/flag-status/${projectKey}/${featureFlagKey}`;

        const apiKey = input.app.config.apiKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        await events.emit(
          await makeLaunchDarklyApiRequest(apiKey, baseUrl, endpoint, {
            method: "GET",
          }),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
