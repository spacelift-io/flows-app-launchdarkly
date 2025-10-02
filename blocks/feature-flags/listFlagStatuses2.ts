import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Flag Statuses2
const inputSchema: Record<string, AppBlockConfigField> = {
  environmentKey: {
    name: "Environment Key",
    description: "The environment key",
    type: "string",
    required: true,
  },
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
};

// Output schema for List Flag Statuses2
const outputSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      enum: ["new", "inactive", "active", "launched"],
      description: "Status of the flag",
    },
    lastRequested: {
      type: "string",
      description: "Timestamp of last time flag was requested",
    },
    _links: {
      type: "object",
      additionalProperties: true,
    },
  },
  required: ["name", "_links"],
};

export default {
  name: "List Flag Statuses2",
  description: "Retrieves list flag statuses2 in LaunchDarkly",
  category: "Feature flags",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, environmentKey, featureFlagKey } =
          input.event.inputConfig;
        const endpoint = `/api/v2/flag-statuses/${projectKey}/${environmentKey}/${featureFlagKey}`;

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
