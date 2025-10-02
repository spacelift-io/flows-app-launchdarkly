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

// Input schema for Create Projects Flags Environments Approval Requests Flag Copy
const inputSchema: Record<string, AppBlockConfigField> = {
  description: {
    name: "Description",
    description: "A brief description of your changes",
    type: "string",
    required: true,
  },
  environmentKey: {
    name: "Environment Key",
    description: "The environment key for the target environment",
    type: "string",
    required: true,
  },
  featureFlagKey: {
    name: "Feature Flag Key",
    description: "The feature flag key",
    type: "string",
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
  source: {
    name: "Source",
    description: "The flag to copy",
    type: {
      type: "object",
      properties: {
        key: {
          type: "string",
          description: "The environment key for the source environment",
        },
        version: {
          type: "integer",
          description: "The version of the source flag from which to copy",
        },
      },
      required: ["key"],
      description: "The flag to copy",
    },
    required: true,
  },
  comment: {
    name: "Comment",
    description: "Optional comment describing the approval request",
    type: "string",
    required: false,
  },
  excludedActions: {
    name: "Excluded Actions",
    description:
      "Optional list of the flag changes NOT to copy from the source environment to the target environment. You may include either <code>includedActions</code> or <code>excludedActions</code>, but not both. If neither are included, then all flag changes will be copied.",
    type: ["string"],
    required: false,
  },
  includedActions: {
    name: "Included Actions",
    description:
      "Optional list of the flag changes to copy from the source environment to the target environment. You may include either <code>includedActions</code> or <code>excludedActions</code>, but not both. If neither are included, then all flag changes will be copied.",
    type: ["string"],
    required: false,
  },
  notifyMemberIds: {
    name: "Notify Member Ids",
    description:
      "An array of member IDs. These members are notified to review the approval request.",
    type: ["string"],
    required: false,
  },
  notifyTeamKeys: {
    name: "Notify Team Keys",
    description:
      "An array of team keys. The members of these teams are notified to review the approval request.",
    type: ["string"],
    required: false,
  },
};

// Output schema for Create Projects Flags Environments Approval Requests Flag Copy
const outputSchema = {
  type: "object",
  properties: {
    _id: {
      type: "string",
      description: "The ID of this approval request",
    },
    _version: {
      type: "integer",
      description: "Version of the approval request",
    },
    creationDate: {
      type: "integer",
      description: "Timestamp of when the approval request was created",
    },
    serviceKind: {
      type: "string",
      description:
        "The approval service for this request. May be LaunchDarkly or an external approval service, such as ServiceNow or JIRA.",
    },
    requestorId: {
      type: "string",
      description: "The ID of the member who requested the approval",
    },
    description: {
      type: "string",
      description: "A human-friendly name for the approval request",
    },
    reviewStatus: {
      type: "string",
      enum: ["approved", "declined", "pending"],
      description: "Current status of the review of this approval request",
    },
    allReviews: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "The approval request ID",
          },
          kind: {
            type: "string",
            enum: ["approve", "decline", "comment"],
            description: "The type of review action to take",
          },
          creationDate: {
            type: "integer",
            description: "Timestamp of when the request was created",
          },
          comment: {
            type: "string",
            description: "A comment describing the approval response",
          },
          memberId: {
            type: "string",
            description: "ID of account member that reviewed request",
          },
          serviceTokenId: {
            type: "string",
            description: "ID of account service token that reviewed request",
          },
        },
        required: ["_id", "kind"],
      },
      description: "An array of individual reviews of this approval request",
    },
    notifyMemberIds: {
      type: "array",
      items: {
        type: "string",
      },
      description:
        "An array of member IDs. These members are notified to review the approval request.",
    },
    appliedDate: {
      type: "integer",
      description: "Timestamp of when the approval request was applied",
    },
    appliedByMemberId: {
      type: "string",
      description:
        "The member ID of the member who applied the approval request",
    },
    appliedByServiceTokenId: {
      type: "string",
      description:
        "The service token ID of the service token which applied the approval request",
    },
    status: {
      type: "string",
      enum: ["pending", "completed", "failed", "scheduled"],
      description: "Current status of the approval request",
    },
    instructions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: true,
      },
      description:
        "List of instructions in semantic patch format to be applied to the feature flag",
    },
    conflicts: {
      type: "array",
      items: {
        type: "object",
        properties: {
          instruction: {
            type: "object",
            description:
              "Instruction in semantic patch format to be applied to the feature flag",
            additionalProperties: true,
          },
          reason: {
            type: "string",
            description: "Reason why the conflict exists",
          },
        },
      },
      description: "Details on any conflicting approval requests",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    executionDate: {
      type: "integer",
      description: "Timestamp for when instructions will be executed",
    },
    operatingOnId: {
      type: "string",
      description: "ID of scheduled change to edit or delete",
    },
    integrationMetadata: {
      type: "object",
      properties: {
        externalId: {
          type: "string",
        },
        externalStatus: {
          type: "object",
          properties: {
            display: {
              type: "string",
            },
            value: {
              type: "string",
            },
          },
          required: ["display", "value"],
        },
        externalUrl: {
          type: "string",
        },
        lastChecked: {
          type: "integer",
        },
      },
      required: ["externalId", "externalStatus", "externalUrl", "lastChecked"],
      description:
        "Details about the object in an external service corresponding to this approval request, such as a ServiceNow change request or a JIRA ticket, if an external approval service is being used",
    },
    source: {
      type: "object",
      properties: {
        key: {
          type: "string",
          description: "Key of feature flag copied",
        },
        version: {
          type: "integer",
          description: "Version of feature flag copied",
        },
      },
      required: ["key"],
      description: "Details about the source feature flag, if copied",
    },
    customWorkflowMetadata: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description:
            "The name of the workflow stage that required this approval request",
        },
        stage: {
          type: "object",
          properties: {
            index: {
              type: "integer",
              description: "The zero-based index of the workflow stage",
            },
            name: {
              type: "string",
              description: "The name of the workflow stage",
            },
          },
          description:
            "Details on the stage of the workflow where this approval request is required",
        },
      },
      description:
        "Details about the custom workflow, if this approval request is part of a custom workflow",
    },
  },
  required: [
    "_id",
    "_version",
    "creationDate",
    "serviceKind",
    "reviewStatus",
    "allReviews",
    "notifyMemberIds",
    "status",
    "instructions",
    "conflicts",
    "_links",
  ],
};

export default {
  name: "Create Projects Flags Environments Approval Requests Flag Copy",
  description:
    "Creates create projects flags environments approval requests flag copy in LaunchDarkly",
  category: "Approvals",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, featureFlagKey, environmentKey, ...inputData } =
          input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/flags/${featureFlagKey}/environments/${environmentKey}/approval-requests-flag-copy`;

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
