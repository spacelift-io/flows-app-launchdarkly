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

// Input schema for Create Code Refs Repositories Branches Extinction Events
const inputSchema: Record<string, AppBlockConfigField> = {
  branch: {
    name: "Branch",
    description: "The URL-encoded branch name",
    type: "string",
    required: true,
  },
  repo: {
    name: "Repo",
    description: "The repository name",
    type: "string",
    required: true,
  },
};

// Output schema for Create Code Refs Repositories Branches Extinction Events
const outputSchema = {};

export default {
  name: "Create Code Refs Repositories Branches Extinction Events",
  description:
    "Creates create code refs repositories branches extinction events in LaunchDarkly",
  category: "Code references",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { repo, branch, ...inputData } = input.event.inputConfig;
        const endpoint = `/api/v2/code-refs/repositories/${repo}/branches/${branch}/extinction-events`;

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
