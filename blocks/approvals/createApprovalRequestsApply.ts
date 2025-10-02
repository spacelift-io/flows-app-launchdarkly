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

// Input schema for Create Approval Requests Apply
const inputSchema: Record<string, AppBlockConfigField> = {
  id: {
    name: "Id",
    description: "The approval request ID",
    type: "string",
    required: true,
  },
  comment: {
    name: "Comment",
    description: "Optional comment about the approval request",
    type: "string",
    required: false,
  },
};

// Output schema for Create Approval Requests Apply
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
    resourceId: {
      type: "string",
      description: "String representation of a resource",
    },
    approvalSettings: {
      type: "object",
      properties: {
        required: [],
        bypassApprovalsForPendingChanges: {
          type: "boolean",
          description: "Whether to skip approvals for pending changes",
        },
        minNumApprovals: {
          type: "integer",
          description:
            "Sets the amount of approvals required before a member can apply a change. The minimum is one and the maximum is five.",
        },
        canReviewOwnRequest: {
          type: "boolean",
          description:
            "Allow someone who makes an approval request to apply their own change",
        },
        canApplyDeclinedChanges: {
          type: "boolean",
          description:
            "Allow applying the change as long as at least one person has approved",
        },
        autoApplyApprovedChanges: {
          type: "boolean",
          description:
            "Automatically apply changes that have been approved by all reviewers. This field is only applicable for approval services other than LaunchDarkly.",
        },
        serviceKind: {
          type: "string",
          description: "Which service to use for managing approvals",
        },
        serviceConfig: {
          type: "object",
          additionalProperties: true,
        },
        requiredApprovalTags: {
          type: "array",
          items: {
            type: "string",
          },
          description:
            "Require approval only on flags with the provided tags. Otherwise all flags will require approval.",
        },
        serviceKindConfigurationId: {
          type: "string",
          description:
            "Optional field for integration configuration ID of a custom approval integration. This is an Enterprise-only feature.",
        },
        resourceKind: {
          type: "string",
          description:
            "The kind of resource for which the approval settings apply, for example, flag or segment",
        },
      },
      required: [
        "required",
        "bypassApprovalsForPendingChanges",
        "minNumApprovals",
        "canReviewOwnRequest",
        "canApplyDeclinedChanges",
        "serviceKind",
        "serviceConfig",
        "requiredApprovalTags",
      ],
      description: "The settings for this approval",
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
  name: "Create Approval Requests Apply",
  description: "Creates create approval requests apply in LaunchDarkly",
  category: "Approvals",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { id, ...inputData } = input.event.inputConfig;
        const endpoint = `/api/v2/approval-requests/${id}/apply`;

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
