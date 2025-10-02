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

// Input schema for Create Projects Flags Environments Workflows
const inputSchema: Record<string, AppBlockConfigField> = {
  environmentKey: {
    name: "Environment Key",
    description: "The environment key",
    type: "string",
    required: true,
  },
  featureFlagKey: {
    name: "Feature Flag Key",
    description: "The feature flag key",
    type: "string",
    required: true,
  },
  name: {
    name: "Name",
    description: "The workflow name",
    type: "string",
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
  description: {
    name: "Description",
    description: "The workflow description",
    type: "string",
    required: false,
  },
  dryRun: {
    name: "Dry Run",
    description: "Whether to call the endpoint in dry-run mode",
    type: "boolean",
    required: false,
  },
  maintainerId: {
    name: "Maintainer Id",
    description:
      "The ID of the workflow maintainer. Defaults to the workflow creator.",
    type: "string",
    required: false,
  },
  stages: {
    name: "Stages",
    description: "A list of the workflow stages",
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
  templateKey: {
    name: "Template Key",
    description: "The template key",
    type: "string",
    required: false,
  },
};

// Output schema for Create Projects Flags Environments Workflows
const outputSchema = {
  type: "object",
  properties: {
    _id: {
      type: "string",
      description: "The ID of the workflow",
    },
    _version: {
      type: "integer",
      description: "The version of the workflow",
    },
    _conflicts: {
      type: "array",
      items: {
        type: "object",
        properties: {
          stageId: {
            type: "string",
            description: "The stage ID",
          },
          message: {
            type: "string",
            description: "Message about the conflict",
          },
        },
        required: ["stageId", "message"],
      },
      description: "Any conflicts that are present in the workflow stages",
    },
    _creationDate: {
      type: "integer",
      description: "Timestamp of when the workflow was created",
    },
    _maintainerId: {
      type: "string",
      description:
        "The member ID of the maintainer of the workflow. Defaults to the workflow creator.",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    name: {
      type: "string",
      description: "The name of the workflow",
    },
    description: {
      type: "string",
      description: "A brief description of the workflow",
    },
    kind: {
      type: "string",
      description: "The kind of workflow",
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
                executionDate: {
                  type: "integer",
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
      description:
        "The stages that make up the workflow. Each stage contains conditions and actions.",
    },
    _execution: {
      type: "object",
      required: [],
      description: "The current execution status of the workflow",
    },
    meta: {
      type: "object",
      properties: {
        parameters: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: {
                type: "string",
                description:
                  "The ID of the condition or instruction referenced by this parameter",
              },
              path: {
                type: "string",
                description:
                  "The path of the property to parameterize, relative to its parent condition or instruction",
              },
              valid: {
                type: "boolean",
                description:
                  "Whether the default value is valid for the target flag and environment",
              },
            },
          },
        },
      },
      description:
        "For workflows being created from a workflow template, this value holds any parameters that could potentially be incompatible with the current project, environment, or flag",
    },
    templateKey: {
      type: "string",
      description:
        "For workflows being created from a workflow template, this value is the template's key",
    },
  },
  required: [
    "_id",
    "_version",
    "_conflicts",
    "_creationDate",
    "_maintainerId",
    "_links",
    "name",
    "_execution",
  ],
};

export default {
  name: "Create Projects Flags Environments Workflows",
  description:
    "Creates create projects flags environments workflows in LaunchDarkly",
  category: "Workflows",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, featureFlagKey, environmentKey, ...inputData } =
          input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/flags/${featureFlagKey}/environments/${environmentKey}/workflows`;

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
