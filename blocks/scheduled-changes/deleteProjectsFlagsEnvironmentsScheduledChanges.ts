import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Projects Flags Environments Scheduled Changes
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
  id: {
    name: "Id",
    description: "The scheduled change id",
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

// Output schema for Delete Projects Flags Environments Scheduled Changes
const outputSchema = {};

export default {
  name: "Delete Projects Flags Environments Scheduled Changes",
  description:
    "Deletes delete projects flags environments scheduled changes in LaunchDarkly",
  category: "Scheduled changes",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, featureFlagKey, environmentKey, id } =
          input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/flags/${featureFlagKey}/environments/${environmentKey}/scheduled-changes/${id}`;

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
