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

// Input schema for Update Flags Release
const inputSchema: Record<string, AppBlockConfigField> = {
  flagKey: {
    name: "Flag Key",
    description: "The flag key",
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

// Output schema for Update Flags Release
const outputSchema = {
  type: "object",
  properties: {
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    name: {
      type: "string",
      description: "The release pipeline name",
    },
    releasePipelineKey: {
      type: "string",
      description: "The release pipeline key",
    },
    releasePipelineDescription: {
      type: "string",
      description: "The release pipeline description",
    },
    phases: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "The phase ID",
          },
          _name: {
            type: "string",
            description: "The release phase name",
          },
          complete: {
            type: "boolean",
            description: "Whether this phase is complete",
          },
          _creationDate: {
            type: "integer",
            description: "Timestamp of when the release phase was created",
          },
          _completionDate: {
            type: "integer",
            description: "Timestamp of when the release phase was completed",
          },
          _completedBy: {
            type: "object",
            properties: {
              member: {
                type: "object",
                properties: {
                  _links: {
                    type: "object",
                    description:
                      "The location and content type of related resources",
                    additionalProperties: true,
                  },
                  _id: {
                    type: "string",
                    description: "The member's ID",
                  },
                  firstName: {
                    type: "string",
                    description: "The member's first name",
                  },
                  lastName: {
                    type: "string",
                    description: "The member's last name",
                  },
                  role: {
                    type: "string",
                    description:
                      "The member's base role. If the member has no additional roles, this role will be in effect.",
                  },
                  email: {
                    type: "string",
                    description: "The member's email address",
                  },
                },
                required: ["_links", "_id", "role", "email"],
                description:
                  "The LaunchDarkly member who marked this phase as complete",
              },
              token: {
                type: "object",
                properties: {
                  _links: {
                    type: "object",
                    additionalProperties: true,
                  },
                  _id: {
                    type: "string",
                  },
                  name: {
                    type: "string",
                    description: "The name of the token",
                  },
                  ending: {
                    type: "string",
                    description: "The last few characters of the token",
                  },
                  serviceToken: {
                    type: "boolean",
                    description: "Whether this is a service token",
                  },
                },
                description:
                  "The service token used to mark this phase as complete",
              },
            },
            description: "Details about how this phase was marked as complete",
          },
          _audiences: {
            type: "array",
            items: {
              type: "object",
              properties: {
                _id: {
                  type: "string",
                  description: "The audience ID",
                },
                _links: {
                  type: "object",
                  description:
                    "The location and content type of related resources",
                  additionalProperties: true,
                },
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
                    "Details about the environment. If the environment is deleted, this field will be omitted.",
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
                  description: "The audience configuration",
                },
                segmentKeys: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "A list of segment keys",
                },
                status: {
                  type: "string",
                  description: "The audience status",
                },
                _ruleIds: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "The rules IDs added or updated by this audience",
                },
              },
              required: ["_id", "name"],
            },
            description:
              "A logical grouping of one or more environments that share attributes for rolling out changes",
          },
          status: {
            type: "string",
            enum: [
              "NotStarted",
              "ReadyToStart",
              "Started",
              "Paused",
              "Complete",
            ],
            description: "Status of the phase",
          },
          started: {
            type: "boolean",
            description: "Whether or not this phase has started",
          },
          _startedDate: {
            type: "integer",
            description: "Timestamp of when the release phase was started",
          },
          configuration: {
            type: "object",
            description: "The phase configuration",
          },
        },
        required: ["_id", "_name", "complete", "_creationDate", "_audiences"],
      },
      description: "An ordered list of the release pipeline phases",
    },
    _version: {
      type: "integer",
      description: "The release version",
    },
    _releaseVariationId: {
      type: "string",
      description:
        "The chosen release variation ID to use across all phases of a release",
    },
    _canceledAt: {
      type: "integer",
      description: "Timestamp of when the release was canceled",
    },
  },
  required: [
    "name",
    "releasePipelineKey",
    "releasePipelineDescription",
    "phases",
    "_version",
  ],
};

export default {
  name: "Update Flags Release",
  description: "Updates update flags release in LaunchDarkly",
  category: "Releases",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, flagKey, ...inputData } = input.event.inputConfig;
        const endpoint = `/api/v2/flags/${projectKey}/${flagKey}/release`;

        const apiKey = input.app.config.apiKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        await events.emit(
          await makeLaunchDarklyApiRequest(apiKey, baseUrl, endpoint, {
            method: "PATCH",
            body: filterDefinedParams(inputData),
          }),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
