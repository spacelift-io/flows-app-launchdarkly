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

// Input schema for Create Templates
const inputSchema: Record<string, AppBlockConfigField> = {
  key: {
    name: "Key",
    description: "",
    type: "string",
    required: true,
  },
  description: {
    name: "Description",
    description: "",
    type: "string",
    required: false,
  },
  environmentKey: {
    name: "Environment Key",
    description: "",
    type: "string",
    required: false,
  },
  flagKey: {
    name: "Flag Key",
    description: "",
    type: "string",
    required: false,
  },
  name: {
    name: "Name",
    description: "",
    type: "string",
    required: false,
  },
  projectKey: {
    name: "Project Key",
    description: "",
    type: "string",
    required: false,
  },
  stages: {
    name: "Stages",
    description: "",
    type: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The stage name",
          },
          executeConditionsInSequence: {
            type: "boolean",
            description:
              "Whether to execute the conditions in sequence for the given stage",
          },
          conditions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                scheduleKind: {
                  type: "string",
                  enum: ["absolute", "relative"],
                  description:
                    "Whether the scheduled execution of the workflow stage is relative or absolute. If relative, the <code>waitDuration</code> and <code>waitDurationUnit</code> specify when the execution occurs. If absolute, the <code>executionDate</code> specifies when the execution occurs.",
                },
                executionDate: {
                  type: "integer",
                  description:
                    "For workflow stages whose scheduled execution is absolute, the time, in Unix milliseconds, when the stage should start.",
                },
                waitDuration: {
                  type: "integer",
                  description:
                    "For workflow stages whose scheduled execution is relative, how far in the future the stage should start.",
                },
                waitDurationUnit: {
                  type: "string",
                  enum: ["minute", "hour", "calendarDay", "calendarWeek"],
                  description:
                    "For workflow stages whose scheduled execution is relative, the unit of measure for the <code>waitDuration</code>.",
                },
                executeNow: {
                  type: "boolean",
                  description:
                    "Whether the workflow stage should be executed immediately",
                },
                description: {
                  type: "string",
                  description:
                    "A description of the approval required for this stage",
                },
                notifyMemberIds: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A list of member IDs for the members to request approval from for this stage",
                },
                notifyTeamKeys: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A list of team keys for the teams to request approval from for this stage",
                },
                integrationConfig: {
                  type: "object",
                  description:
                    "Additional approval request fields for third-party integration approval systems. If you are using a third-party integration to manage approval requests, these additional fields will be described in the <code>manifest.json</code> for that integration, at https://github.com/launchdarkly/integration-framework.",
                  additionalProperties: true,
                },
                kind: {
                  type: "string",
                  description:
                    "The type of condition to meet before executing this stage of the workflow. Use <code>schedule</code> to schedule a workflow stage. Use <code>ld-approval</code> to add an approval request to a workflow stage.",
                },
              },
            },
            description: "An array of conditions for the stage",
          },
          action: {
            type: "object",
            properties: {
              instructions: {
                description:
                  "An array of instructions for the stage. Each object in the array uses the semantic patch format for updating a feature flag.",
              },
            },
            description:
              "An <code>instructions</code> field containing an array of instructions for the stage. Each object in the array uses the semantic patch format for updating a feature flag.",
          },
        },
      },
    },
    required: false,
  },
  workflowId: {
    name: "Workflow Id",
    description: "",
    type: "string",
    required: false,
  },
};

// Output schema for Create Templates
const outputSchema = {
  type: "object",
  properties: {
    _id: {
      type: "string",
    },
    _key: {
      type: "string",
    },
    name: {
      type: "string",
    },
    _creationDate: {
      type: "integer",
    },
    _ownerId: {
      type: "string",
    },
    _maintainerId: {
      type: "string",
    },
    _links: {
      type: "object",
      additionalProperties: true,
    },
    description: {
      type: "string",
    },
    stages: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "The ID of this stage",
          },
          name: {
            type: "string",
            description: "The stage name",
          },
          conditions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                _id: {
                  type: "string",
                },
                kind: {
                  type: "string",
                },
                _execution: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      description:
                        "The status of the execution of this workflow stage",
                    },
                    stopDate: {
                      type: "integer",
                      description:
                        "Timestamp of when the workflow was completed.",
                    },
                  },
                  required: ["status"],
                },
                scheduleKind: {
                  type: "string",
                },
                waitDuration: {
                  type: "integer",
                },
                waitDurationUnit: {
                  type: "string",
                },
                description: {
                  type: "string",
                },
                notifyMemberIds: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                allReviews: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                      },
                      kind: {
                        type: "string",
                      },
                      comment: {
                        type: "string",
                      },
                      memberId: {
                        type: "string",
                      },
                      serviceTokenId: {
                        type: "string",
                      },
                    },
                    required: ["_id", "kind"],
                  },
                },
                reviewStatus: {
                  type: "string",
                },
                creationConfig: {
                  type: "object",
                  additionalProperties: true,
                },
              },
              required: [
                "_id",
                "_execution",
                "description",
                "notifyMemberIds",
                "allReviews",
                "reviewStatus",
              ],
            },
            description: "An array of conditions for the stage",
          },
          action: {
            type: "object",
            properties: {
              kind: {
                type: "string",
                description: "The type of action for this stage",
              },
              instructions: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                },
                description:
                  "An array of instructions for the stage. Each object in the array uses the semantic patch format for updating a feature flag.",
              },
            },
            required: ["kind", "instructions"],
            description:
              "The type of instruction, and an array of instructions for the stage. Each object in the array uses the semantic patch format for updating a feature flag.",
          },
          _execution: {
            type: "object",
            required: [],
            description: "Details on the execution of this stage",
          },
        },
        required: ["_id", "conditions", "action", "_execution"],
      },
    },
  },
  required: [
    "_id",
    "_key",
    "_creationDate",
    "_ownerId",
    "_maintainerId",
    "_links",
  ],
};

export default {
  name: "Create Templates",
  description: "Creates create templates in LaunchDarkly",
  category: "Workflow templates",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const inputData = input.event.inputConfig;
        const endpoint = `/api/v2/templates`;

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
