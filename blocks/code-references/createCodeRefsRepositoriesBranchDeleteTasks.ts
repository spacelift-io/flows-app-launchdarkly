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

// Input schema for Create Code Refs Repositories Branch Delete Tasks
const inputSchema: Record<string, AppBlockConfigField> = {
  repo: {
    name: "Repo",
    description: "The repository name to delete branches for.",
    type: "string",
    required: true,
  },
};

// Output schema for Create Code Refs Repositories Branch Delete Tasks
const outputSchema = {};

export default {
  name: "Create Code Refs Repositories Branch Delete Tasks",
  description:
    "Creates create code refs repositories branch delete tasks in LaunchDarkly",
  category: "Code references",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { repo, ...inputData } = input.event.inputConfig;
        const endpoint = `/api/v2/code-refs/repositories/${repo}/branch-delete-tasks`;

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
