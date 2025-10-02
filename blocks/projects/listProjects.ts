import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Projects
const inputSchema: Record<string, AppBlockConfigField> = {
  expand: {
    name: "Expand",
    description:
      "A comma-separated list of properties that can reveal additional information in the response.",
    type: "string",
    required: false,
  },
  filter: {
    name: "Filter",
    description:
      "A comma-separated list of filters. Each filter is constructed as `field:value`.",
    type: "string",
    required: false,
  },
  limit: {
    name: "Limit",
    description:
      "The number of projects to return in the response. Defaults to 20.",
    type: "number",
    required: false,
  },
  offset: {
    name: "Offset",
    description:
      "Where to start in the list. Use this with pagination. For example, an offset of 10 skips the first ten items and returns the next `limit` items.",
    type: "number",
    required: false,
  },
  sort: {
    name: "Sort",
    description:
      "A comma-separated list of fields to sort by. Fields prefixed by a dash ( - ) sort in descending order.",
    type: "string",
    required: false,
  },
};

// Output schema for List Projects
const outputSchema = {
  type: "object",
  properties: {
    _links: {
      type: "object",
      description: "A link to this resource.",
      additionalProperties: true,
    },
    items: {
      type: "array",
      items: {
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
                description:
                  "The location and content type of related resources",
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
                      description:
                        "A project-unique key for the new environment",
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
                      properties: {
                        required: [],
                        bypassApprovalsForPendingChanges: {
                          type: "boolean",
                          description:
                            "Whether to skip approvals for pending changes",
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
                          description:
                            "Which service to use for managing approvals",
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
      },
      description: "List of projects.",
    },
    totalCount: {
      type: "integer",
    },
  },
  required: ["_links", "items"],
};

export default {
  name: "List Projects",
  description: "Retrieves list projects in LaunchDarkly",
  category: "Projects",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const endpoint = `/api/v2/projects`;

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
