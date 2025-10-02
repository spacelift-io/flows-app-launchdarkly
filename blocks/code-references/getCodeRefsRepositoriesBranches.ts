import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Code Refs Repositories Branches
const inputSchema: Record<string, AppBlockConfigField> = {
  repo: {
    name: "Repo",
    description: "The repository name",
    type: "string",
    required: true,
  },
};

// Output schema for Get Code Refs Repositories Branches
const outputSchema = {
  type: "object",
  properties: {
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The branch name",
          },
          head: {
            type: "string",
            description:
              "An ID representing the branch HEAD. For example, a commit SHA.",
          },
          updateSequenceId: {
            type: "integer",
            description:
              "An optional ID used to prevent older data from overwriting newer data",
          },
          syncTime: {
            type: "integer",
            description:
              "A timestamp indicating when the branch was last synced",
          },
          references: {
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
            description: "An array of flag references found on the branch",
          },
          _links: {
            type: "object",
            description: "The location and content type of related resources",
            additionalProperties: true,
          },
        },
        required: ["name", "head", "syncTime", "_links"],
      },
      description: "An array of branches",
    },
  },
  required: ["_links", "items"],
};

export default {
  name: "Get Code Refs Repositories Branches",
  description: "Retrieves get code refs repositories branches in LaunchDarkly",
  category: "Code references",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { repo } = input.event.inputConfig;
        const endpoint = `/api/v2/code-refs/repositories/${repo}/branches`;

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
