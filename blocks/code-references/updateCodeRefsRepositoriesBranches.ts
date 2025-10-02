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

// Input schema for Update Code Refs Repositories Branches
const inputSchema: Record<string, AppBlockConfigField> = {
  branch: {
    name: "Branch",
    description: "The URL-encoded branch name",
    type: "string",
    required: true,
  },
  head: {
    name: "Head",
    description:
      "An ID representing the branch HEAD. For example, a commit SHA.",
    type: "string",
    required: true,
  },
  name: {
    name: "Name",
    description: "The branch name",
    type: "string",
    required: true,
  },
  repo: {
    name: "Repo",
    description: "The repository name",
    type: "string",
    required: true,
  },
  syncTime: {
    name: "Sync Time",
    description: "A timestamp indicating when the branch was last synced",
    type: "number",
    required: true,
  },
  commitTime: {
    name: "Commit Time",
    description: "A timestamp of the current commit",
    type: "number",
    required: false,
  },
  references: {
    name: "References",
    description: "An array of flag references found on the branch",
    type: {
      type: "array",
      items: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "File path of the reference",
          },
          hint: {
            type: "string",
            description: "Programming language used in the file",
          },
          hunks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                startingLineNumber: {
                  type: "integer",
                  description:
                    "Line number of beginning of code reference hunk",
                },
                lines: {
                  type: "string",
                  description:
                    "Contextual lines of code that include the referenced feature flag",
                },
                projKey: {
                  type: "string",
                  description: "The project key",
                },
                flagKey: {
                  type: "string",
                  description: "The feature flag key",
                },
                aliases: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "An array of flag key aliases",
                },
              },
              required: ["startingLineNumber"],
            },
          },
        },
        required: ["path", "hunks"],
      },
    },
    required: false,
  },
  updateSequenceId: {
    name: "Update Sequence Id",
    description:
      "An optional ID used to prevent older data from overwriting newer data. If no sequence ID is included, the newly submitted data will always be saved.",
    type: "number",
    required: false,
  },
};

// Output schema for Update Code Refs Repositories Branches
const outputSchema = {};

export default {
  name: "Update Code Refs Repositories Branches",
  description: "Updates update code refs repositories branches in LaunchDarkly",
  category: "Code references",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { repo, branch, ...inputData } = input.event.inputConfig;
        const endpoint = `/api/v2/code-refs/repositories/${repo}/branches/${branch}`;

        const apiKey = input.app.config.apiKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        await events.emit(
          await makeLaunchDarklyApiRequest(apiKey, baseUrl, endpoint, {
            method: "PUT",
            body: filterDefinedParams(inputData),
          }),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
