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

// Input schema for Create Code Refs Repositories
const inputSchema: Record<string, AppBlockConfigField> = {
  name: {
    name: "Name",
    description: "The repository name",
    type: "string",
    required: true,
  },
  commitUrlTemplate: {
    name: "Commit Url Template",
    description: "A template for constructing a valid URL to view the commit",
    type: "string",
    required: false,
  },
  defaultBranch: {
    name: "Default Branch",
    description:
      "The repository's default branch. If not specified, the default value is <code>main</code>.",
    type: "string",
    required: false,
  },
  hunkUrlTemplate: {
    name: "Hunk Url Template",
    description: "A template for constructing a valid URL to view the hunk",
    type: "string",
    required: false,
  },
  sourceLink: {
    name: "Source Link",
    description: "A URL to access the repository",
    type: "string",
    required: false,
  },
  type: {
    name: "Type",
    description:
      "The type of repository. If not specified, the default value is <code>custom</code>.",
    type: "string",
    required: false,
  },
};

// Output schema for Create Code Refs Repositories
const outputSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "The repository name",
    },
    sourceLink: {
      type: "string",
      description: "A URL to access the repository",
    },
    commitUrlTemplate: {
      type: "string",
      description: "A template for constructing a valid URL to view the commit",
    },
    hunkUrlTemplate: {
      type: "string",
      description: "A template for constructing a valid URL to view the hunk",
    },
    type: {
      type: "string",
      enum: ["bitbucket", "custom", "github", "gitlab"],
      description: "The type of repository",
    },
    defaultBranch: {
      type: "string",
      description: "The repository's default branch",
    },
    enabled: {
      type: "boolean",
      description:
        "Whether or not a repository is enabled for code reference scanning",
    },
    version: {
      type: "integer",
      description: "The version of the repository's saved information",
    },
    branches: {
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
      description:
        "An array of the repository's branches that have been scanned for code references",
    },
    _links: {
      type: "object",
      additionalProperties: true,
    },
    _access: {
      type: "object",
      properties: {
        denied: {
          type: "array",
          items: {
            type: "object",
            properties: {
              action: {
                type: "string",
              },
              reason: {
                type: "object",
                properties: {
                  resources: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Resource specifier strings",
                  },
                  notResources: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Targeted resources are the resources NOT in this list. The <code>resources</code> and <code>notActions</code> fields must be empty to use this field.",
                  },
                  actions: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Actions to perform on a resource",
                  },
                  notActions: {
                    type: "array",
                    items: {
                      type: "object",
                    },
                    description:
                      "Targeted actions are the actions NOT in this list. The <code>actions</code> and <code>notResources</code> fields must be empty to use this field.",
                  },
                  effect: {
                    type: "string",
                    enum: ["allow", "deny"],
                    description:
                      "Whether this statement should allow or deny actions on the resources.",
                  },
                  role_name: {
                    type: "string",
                  },
                },
                required: ["effect"],
              },
            },
            required: ["action", "reason"],
          },
        },
        allowed: {
          type: "array",
          items: {
            type: "object",
            properties: {
              reason: {
                type: "object",
                properties: {
                  resources: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Resource specifier strings",
                  },
                  notResources: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Targeted resources are the resources NOT in this list. The <code>resources</code> and <code>notActions</code> fields must be empty to use this field.",
                  },
                  actions: {
                    type: "array",
                    items: {
                      type: "object",
                    },
                    description: "Actions to perform on a resource",
                  },
                  notActions: {
                    type: "array",
                    items: {
                      type: "object",
                    },
                    description:
                      "Targeted actions are the actions NOT in this list. The <code>actions</code> and <code>notResources</code> fields must be empty to use this field.",
                  },
                  effect: {
                    type: "string",
                    enum: ["allow", "deny"],
                    description:
                      "Whether this statement should allow or deny actions on the resources.",
                  },
                  role_name: {
                    type: "string",
                  },
                },
                required: ["effect"],
              },
            },
            required: ["reason"],
          },
        },
      },
      required: ["denied", "allowed"],
    },
  },
  required: ["name", "type", "defaultBranch", "enabled", "version", "_links"],
};

export default {
  name: "Create Code Refs Repositories",
  description: "Creates create code refs repositories in LaunchDarkly",
  category: "Code references",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const inputData = input.event.inputConfig;
        const endpoint = `/api/v2/code-refs/repositories`;

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
