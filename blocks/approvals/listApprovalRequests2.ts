import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Approval Requests2
const inputSchema: Record<string, AppBlockConfigField> = {
  id: {
    name: "Id",
    description: "The approval request ID",
    type: "string",
    required: true,
  },
  expand: {
    name: "Expand",
    description:
      "A comma-separated list of fields to expand in the response. Supported fields are explained above.",
    type: "string",
    required: false,
  },
};

// Output schema for List Approval Requests2
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
    project: {
      type: "object",
      properties: {
        _links: {
          type: "object",
          description: "The location and content type of related resources",
          additionalProperties: true,
        },
        _id: {
          type: "string",
          description: "The ID of this project",
        },
        key: {
          type: "string",
          description: "The key of this project",
        },
        includeInSnippetByDefault: {
          type: "boolean",
          description:
            "Whether or not flags created in this project are made available to the client-side JavaScript SDK by default",
        },
        defaultClientSideAvailability: {
          type: "object",
          properties: {
            usingMobileKey: {
              type: "boolean",
            },
            usingEnvironmentId: {
              type: "boolean",
            },
          },
          description:
            "Describes which client-side SDKs can use new flags by default",
        },
        name: {
          type: "string",
          description: "A human-friendly name for the project",
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
            "Details on the allowed and denied actions for this project",
        },
        tags: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of tags for the project",
        },
        defaultReleasePipelineKey: {
          type: "string",
          description:
            "The key of the default release pipeline for this project",
        },
        environments: {
          type: "object",
          properties: {
            _links: {
              type: "object",
              description: "The location and content type of related resources",
              additionalProperties: true,
            },
            totalCount: {
              type: "integer",
              description: "The number of environments returned",
            },
            items: {
              type: "array",
              items: {
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
                    description:
                      "The ID for the environment. Use this as the client-side ID for authorization in some client-side SDKs, and to associate LaunchDarkly environments with CDN integrations in edge SDKs.",
                  },
                  key: {
                    type: "string",
                    description: "A project-unique key for the new environment",
                  },
                  name: {
                    type: "string",
                    description:
                      "A human-friendly name for the new environment",
                  },
                  apiKey: {
                    type: "string",
                    description:
                      "The SDK key for the environment. Use this for authorization in server-side SDKs.",
                  },
                  mobileKey: {
                    type: "string",
                    description:
                      "The mobile key for the environment. Use this for authorization in mobile SDKs.",
                  },
                  color: {
                    type: "string",
                    description:
                      "The color used to indicate this environment in the UI",
                  },
                  defaultTtl: {
                    type: "integer",
                    description:
                      "The default time (in minutes) that the PHP SDK can cache feature flag rules locally",
                  },
                  secureMode: {
                    type: "boolean",
                    description:
                      "Ensures that one end user of the client-side SDK cannot inspect the variations for another end user",
                  },
                  defaultTrackEvents: {
                    type: "boolean",
                    description:
                      "Enables tracking detailed information for new flags by default",
                  },
                  requireComments: {
                    type: "boolean",
                    description:
                      "Whether members who modify flags and segments through the LaunchDarkly user interface are required to add a comment",
                  },
                  confirmChanges: {
                    type: "boolean",
                    description:
                      "Whether members who modify flags and segments through the LaunchDarkly user interface are required to confirm those changes",
                  },
                  tags: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "A list of tags for this environment",
                  },
                  approvalSettings: {
                    type: "object",
                    required: [],
                    description:
                      "Details on the approval settings for this environment",
                  },
                  resourceApprovalSettings: {
                    type: "object",
                    description:
                      "Details on the approval settings for this environment for each resource kind",
                    additionalProperties: true,
                  },
                  critical: {
                    type: "boolean",
                    description: "Whether the environment is critical",
                  },
                },
                required: [
                  "_links",
                  "_id",
                  "key",
                  "name",
                  "apiKey",
                  "mobileKey",
                  "color",
                  "defaultTtl",
                  "secureMode",
                  "defaultTrackEvents",
                  "requireComments",
                  "confirmChanges",
                  "tags",
                  "critical",
                ],
              },
              description: "An array of environments",
            },
          },
          required: ["items"],
          description:
            "A paginated list of environments for the project. By default this field is omitted unless expanded by the client.",
        },
      },
      required: [
        "_links",
        "_id",
        "key",
        "includeInSnippetByDefault",
        "name",
        "tags",
      ],
      description: "Project the approval request belongs to",
    },
    environments: {
      type: "array",
      items: {
        type: "object",
      },
      description: "List of environments the approval impacts",
    },
    flag: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "A human-friendly name for the feature flag",
        },
        kind: {
          type: "string",
          enum: ["boolean", "multivariate"],
          description: "Kind of feature flag",
        },
        description: {
          type: "string",
          description: "Description of the feature flag",
        },
        key: {
          type: "string",
          description: "A unique key used to reference the flag in your code",
        },
        _version: {
          type: "integer",
          description: "Version of the feature flag",
        },
        creationDate: {
          type: "integer",
          description: "Timestamp of flag creation date",
        },
        includeInSnippet: {
          type: "boolean",
          description:
            "Deprecated, use <code>clientSideAvailability</code>. Whether this flag should be made available to the client-side JavaScript SDK",
        },
        clientSideAvailability: {
          type: "object",
          description:
            "Which type of client-side SDKs the feature flag is available to",
        },
        variations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: {
                type: "string",
                description:
                  "The ID of the variation. Leave empty when you are creating a flag.",
              },
              value: {
                description:
                  "The value of the variation. For boolean flags, this must be <code>true</code> or <code>false</code>. For multivariate flags, this may be a string, number, or JSON object.",
              },
              description: {
                type: "string",
                description:
                  "Description of the variation. Defaults to an empty string, but is omitted from the response if not set.",
              },
              name: {
                type: "string",
                description:
                  "A human-friendly name for the variation. Defaults to an empty string, but is omitted from the response if not set.",
              },
            },
            required: ["value"],
          },
          description: "An array of possible variations for the flag",
        },
        temporary: {
          type: "boolean",
          description: "Whether the flag is a temporary flag",
        },
        tags: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Tags for the feature flag",
        },
        _links: {
          type: "object",
          description: "The location and content type of related resources",
          additionalProperties: true,
        },
        maintainerId: {
          type: "string",
          description: "The ID of the member who maintains the flag",
        },
        _maintainer: {
          type: "object",
          properties: {
            _links: {
              type: "object",
              description: "The location and content type of related resources",
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
          description: "Details on the member who maintains this feature flag",
        },
        customProperties: {
          type: "object",
          description:
            "Metadata attached to the feature flag, in the form of the property key associated with a name and array of values for the metadata to associate with this flag. Typically used to store data related to an integration.",
          additionalProperties: true,
        },
        archived: {
          type: "boolean",
          description: "Boolean indicating if the feature flag is archived",
        },
        archivedDate: {
          type: "integer",
          description: "If archived is true, date of archive",
        },
        defaults: {
          type: "object",
          properties: {
            onVariation: {
              type: "integer",
              description:
                "The index, from the array of variations for this flag, of the variation to serve by default when targeting is on.",
            },
            offVariation: {
              type: "integer",
              description:
                "The index, from the array of variations for this flag, of the variation to serve by default when targeting is off.",
            },
          },
          required: ["onVariation", "offVariation"],
          description:
            "The indices, from the array of variations, for the variations to serve by default when targeting is on and when targeting is off. These variations will be used for this flag in new environments. If omitted, the first and last variation will be used.",
        },
      },
      required: [
        "name",
        "kind",
        "key",
        "_version",
        "creationDate",
        "variations",
        "temporary",
        "tags",
        "_links",
        "customProperties",
        "archived",
      ],
      description: "Flag the approval request belongs to",
    },
    resource: {
      type: "object",
      properties: {
        kind: {
          type: "string",
          description: "The type of resource",
        },
        aiConfig: {
          type: "object",
          properties: {
            key: {
              type: "string",
              description: "The key of the AI Config",
            },
            name: {
              type: "string",
              description: "The name of the AI Config",
            },
          },
          required: ["key", "name"],
        },
        flag: {
          type: "object",
          required: [],
        },
        segment: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "A human-friendly name for the segment.",
            },
            description: {
              type: "string",
              description:
                "A description of the segment's purpose. Defaults to <code>null</code> and is omitted in the response if not provided.",
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Tags for the segment. Defaults to an empty array.",
            },
            creationDate: {
              type: "integer",
              description: "Timestamp of when the segment was created",
            },
            lastModifiedDate: {
              type: "integer",
              description: "Timestamp of when the segment was last modified",
            },
            key: {
              type: "string",
              description: "A unique key used to reference the segment",
            },
            included: {
              type: "array",
              items: {
                type: "string",
              },
              description:
                "An array of keys for included targets. Included individual targets are always segment members, regardless of segment rules. For list-based segments over 15,000 entries, also called big segments, this array is either empty or omitted.",
            },
            excluded: {
              type: "array",
              items: {
                type: "string",
              },
              description:
                "An array of keys for excluded targets. Segment rules bypass individual excluded targets, so they will never be included based on rules. Excluded targets may still be included explicitly. This value is omitted for list-based segments over 15,000 entries, also called big segments.",
            },
            includedContexts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  values: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  contextKind: {
                    type: "string",
                  },
                },
              },
            },
            excludedContexts: {
              type: "array",
              items: {
                type: "object",
              },
            },
            _links: {
              type: "object",
              description: "The location and content type of related resources",
              additionalProperties: true,
            },
            rules: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: {
                    type: "string",
                  },
                  clauses: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        _id: {
                          type: "string",
                        },
                        attribute: {
                          type: "string",
                        },
                        op: {
                          type: "string",
                        },
                        values: {
                          type: "array",
                          items: {
                            type: "object",
                          },
                        },
                        contextKind: {
                          type: "string",
                        },
                        negate: {
                          type: "boolean",
                        },
                      },
                      required: ["attribute", "op", "values", "negate"],
                    },
                  },
                  weight: {
                    type: "integer",
                  },
                  rolloutContextKind: {
                    type: "string",
                  },
                  bucketBy: {
                    type: "string",
                  },
                  description: {
                    type: "string",
                  },
                },
                required: ["clauses"],
              },
              description: "An array of the targeting rules for this segment.",
            },
            version: {
              type: "integer",
              description: "Version of the segment",
            },
            deleted: {
              type: "boolean",
              description: "Whether the segment has been deleted",
            },
            _access: {
              type: "object",
              required: [],
            },
            _flags: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "The flag name",
                  },
                  key: {
                    type: "string",
                    description: "The flag key",
                  },
                  _links: {
                    type: "object",
                    additionalProperties: true,
                  },
                },
                required: ["name", "key"],
              },
              description:
                "A list of flags targeting this segment. Only included when getting a single segment, using the <code>getSegment</code> endpoint.",
            },
            unbounded: {
              type: "boolean",
              description:
                "Whether this is a standard segment (<code>false</code>) or a big segment (<code>true</code>). Standard segments include rule-based segments and smaller list-based segments. Big segments include larger list-based segments and synced segments. If omitted, the segment is a standard segment.",
            },
            unboundedContextKind: {
              type: "string",
              description: "For big segments, the targeted context kind.",
            },
            generation: {
              type: "integer",
              description:
                "For big segments, how many times this segment has been created.",
            },
            _unboundedMetadata: {
              type: "object",
              properties: {
                envId: {
                  type: "string",
                },
                segmentId: {
                  type: "string",
                },
                version: {
                  type: "integer",
                },
                includedCount: {
                  type: "integer",
                },
                excludedCount: {
                  type: "integer",
                },
                deleted: {
                  type: "boolean",
                },
              },
              description:
                "Details on the external data store backing this segment. Only applies to big segments.",
            },
            _external: {
              type: "string",
              description:
                "The external data store backing this segment. Only applies to synced segments.",
            },
            _externalLink: {
              type: "string",
              description:
                "The URL for the external data store backing this segment. Only applies to synced segments.",
            },
            _importInProgress: {
              type: "boolean",
              description:
                "Whether an import is currently in progress for the specified segment. Only applies to big segments.",
            },
          },
          required: [
            "name",
            "tags",
            "creationDate",
            "lastModifiedDate",
            "key",
            "_links",
            "rules",
            "version",
            "deleted",
            "generation",
          ],
        },
      },
      required: ["kind"],
      description: "Resource the approval request belongs to",
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
  name: "List Approval Requests2",
  description: "Retrieves list approval requests2 in LaunchDarkly",
  category: "Approvals",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { id } = input.event.inputConfig;
        const endpoint = `/api/v2/approval-requests/${id}`;

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
