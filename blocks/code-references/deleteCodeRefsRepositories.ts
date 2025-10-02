import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Code Refs Repositories
const inputSchema: Record<string, AppBlockConfigField> = {
  repo: {
    name: "Repo",
    description: "The repository name",
    type: "string",
    required: true,
  },
};

// Output schema for Delete Code Refs Repositories
const outputSchema = {};

export default {
  name: "Delete Code Refs Repositories",
  description: "Deletes delete code refs repositories in LaunchDarkly",
  category: "Code references",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { repo } = input.event.inputConfig;
        const endpoint = `/api/v2/code-refs/repositories/${repo}`;

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
