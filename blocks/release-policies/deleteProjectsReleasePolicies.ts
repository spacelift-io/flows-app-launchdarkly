import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Projects Release Policies
const inputSchema: Record<string, AppBlockConfigField> = {
  policyKey: {
    name: "Policy Key",
    description: "The human-readable key of the release policy",
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

// Output schema for Delete Projects Release Policies
const outputSchema = {};

export default {
  name: "Delete Projects Release Policies",
  description: "Deletes delete projects release policies in LaunchDarkly",
  category: "Release policies",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, policyKey } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/release-policies/${policyKey}`;

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
