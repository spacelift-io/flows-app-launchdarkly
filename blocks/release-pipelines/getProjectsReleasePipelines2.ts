import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Projects Release Pipelines2
const inputSchema: Record<string, AppBlockConfigField> = {
  pipelineKey: {
    name: "Pipeline Key",
    description: "The release pipeline key",
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

// Output schema for Get Projects Release Pipelines2
const outputSchema = {
  type: "object",
  properties: {
    createdAt: {
      type: "string",
      description: "Timestamp of when the release pipeline was created",
    },
    description: {
      type: "string",
      description: "The release pipeline description",
    },
    key: {
      type: "string",
      description: "The release pipeline key",
    },
    name: {
      type: "string",
      description: "The release pipeline name",
    },
    phases: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The phase ID",
          },
          audiences: {
            type: "array",
            items: {
              type: "object",
              properties: {
                environment: {
                  type: "object",
                  properties: {
                    _links: {
                      type: "object",
                      description:
                        "The location and content type of related resources",
                      additionalProperties: true,
                    },
                    key: {
                      type: "string",
                      description: "A project-unique key for the environment",
                    },
                    name: {
                      type: "string",
                      description: "A human-friendly name for the environment",
                    },
                    color: {
                      type: "string",
                      description:
                        "The color used to indicate this environment in the UI",
                    },
                  },
                  required: ["_links", "key", "name", "color"],
                  description:
                    "Details about the environment. When the environment has been deleted, this field is omitted.",
                },
                name: {
                  type: "string",
                  description: "The release phase name",
                },
                configuration: {
                  type: "object",
                  properties: {
                    releaseStrategy: {
                      type: "string",
                      description: "The release strategy",
                    },
                    requireApproval: {
                      type: "boolean",
                      description:
                        "Whether or not the audience requires approval",
                    },
                    notifyMemberIds: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "An array of member IDs. These members are notified to review the approval request.",
                    },
                    notifyTeamKeys: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "An array of team keys. The members of these teams are notified to review the approval request.",
                    },
                    releaseGuardianConfiguration: {
                      type: "object",
                      properties: {
                        monitoringWindowMilliseconds: {
                          type: "integer",
                          description: "The monitoring window in milliseconds",
                        },
                        rolloutWeight: {
                          type: "integer",
                          description: "The rollout weight percentage",
                        },
                        rollbackOnRegression: {
                          type: "boolean",
                          description:
                            "Whether or not to roll back on regression",
                        },
                        randomizationUnit: {
                          type: "string",
                          description:
                            "The randomization unit for the measured rollout",
                        },
                      },
                      required: [
                        "monitoringWindowMilliseconds",
                        "rolloutWeight",
                        "rollbackOnRegression",
                      ],
                      description:
                        "The configuration for the release guardian.",
                    },
                  },
                  required: ["releaseStrategy", "requireApproval"],
                  description: "The configuration for the audience's rollout.",
                },
                segmentKeys: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "A list of segment keys",
                },
              },
              required: ["name"],
            },
            description:
              "An ordered list of the audiences for this release phase. Each audience corresponds to a LaunchDarkly environment.",
          },
          name: {
            type: "string",
            description: "The release phase name",
          },
          configuration: {
            type: "object",
            description: "The configuration for the phase's rollout.",
          },
        },
        required: ["id", "audiences", "name"],
      },
      description:
        "An ordered list of the release pipeline phases. Each phase is a logical grouping of one or more environments that share attributes for rolling out changes.",
    },
    tags: {
      type: "array",
      items: {
        type: "string",
      },
      description: "A list of the release pipeline's tags",
    },
    _version: {
      type: "integer",
      description: "The release pipeline version",
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
      description:
        "Details on the allowed and denied actions for this release pipeline",
    },
    isProjectDefault: {
      type: "boolean",
      description:
        "Whether this release pipeline is the default pipeline for the project",
    },
    _isLegacy: {
      type: "boolean",
      description: "Whether this release pipeline is a legacy pipeline",
    },
  },
  required: ["createdAt", "key", "name", "phases"],
};

export default {
  name: "Get Projects Release Pipelines2",
  description: "Retrieves get projects release pipelines2 in LaunchDarkly",
  category: "Release pipelines",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, pipelineKey } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/release-pipelines/${pipelineKey}`;

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
