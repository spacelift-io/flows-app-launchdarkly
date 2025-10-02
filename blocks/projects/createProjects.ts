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

// Input schema for Create Projects
const inputSchema: Record<string, AppBlockConfigField> = {
  key: {
    name: "Key",
    description: "A unique key used to reference the project in your code.",
    type: "string",
    required: true,
  },
  name: {
    name: "Name",
    description: "A human-friendly name for the project.",
    type: "string",
    required: true,
  },
  defaultClientSideAvailability: {
    name: "Default Client Side Availability",
    description:
      "Controls which client-side SDKs can use new flags by default.",
    type: {
      type: "object",
      properties: {
        usingEnvironmentId: {
          type: "boolean",
          description: "Whether to enable availability for client-side SDKs.",
        },
        usingMobileKey: {
          type: "boolean",
          description: "Whether to enable availability for mobile SDKs.",
        },
      },
      required: ["usingEnvironmentId", "usingMobileKey"],
      description:
        "Controls which client-side SDKs can use new flags by default.",
    },
    required: false,
  },
  environments: {
    name: "Environments",
    description:
      "Creates the provided environments for this project. If omitted default environments will be created instead.",
    type: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "A human-friendly name for the new environment",
          },
          key: {
            type: "string",
            description: "A project-unique key for the new environment",
          },
          color: {
            type: "string",
            description: "A color to indicate this environment in the UI",
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
          confirmChanges: {
            type: "boolean",
            description:
              "Requires confirmation for all flag and segment changes via the UI in this environment",
          },
          requireComments: {
            type: "boolean",
            description:
              "Requires comments for all flag and segment changes via the UI in this environment",
          },
          tags: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Tags to apply to the new environment",
          },
          source: {
            type: "object",
            properties: {
              key: {
                type: "string",
                description: "The key of the source environment to clone from",
              },
              version: {
                type: "integer",
                description:
                  "(Optional) The version number of the source environment to clone from. Used for optimistic locking",
              },
            },
            description:
              "Indicates that the new environment created will be cloned from the provided source environment",
          },
          critical: {
            type: "boolean",
            description: "Whether the environment is critical",
          },
        },
        required: ["name", "key", "color"],
      },
    },
    required: false,
  },
  includeInSnippetByDefault: {
    name: "Include In Snippet By Default",
    description:
      "Whether or not flags created in this project are made available to the client-side JavaScript SDK by default.",
    type: "boolean",
    required: false,
  },
  namingConvention: {
    name: "Naming Convention",
    description:
      "The flag key convention for this project. Omit this field if you don't want to enforce any conventions for flag keys.",
    type: {
      type: "object",
      properties: {
        case: {
          type: "string",
          enum: ["camelCase", "upperCamelCase", "snakeCase", "kebabCase"],
          description:
            "The casing convention to enforce for new flag keys in this project",
        },
        prefix: {
          type: "string",
          description:
            "The prefix to enforce for new flag keys in this project",
        },
      },
      description:
        "The flag key convention for this project. Omit this field if you don't want to enforce any conventions for flag keys.",
    },
    required: false,
  },
  tags: {
    name: "Tags",
    description: "Tags for the project",
    type: ["string"],
    required: false,
  },
};

// Output schema for Create Projects
const outputSchema = {
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
      description: "Details on the allowed and denied actions for this project",
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
      description: "The key of the default release pipeline for this project",
    },
    environments: {
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
            description:
              "The ID for the environment. Use this as the client-side ID for authorization in some client-side SDKs, and to associate LaunchDarkly environments with CDN integrations in edge SDKs.",
          },
          key: {
            type: "string",
            description: "A project-unique key for the new environment",
          },
          name: {
            type: "string",
            description: "A human-friendly name for the new environment",
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
      description: "A list of environments for the project",
    },
  },
  required: [
    "_links",
    "_id",
    "key",
    "includeInSnippetByDefault",
    "name",
    "tags",
    "environments",
  ],
};

export default {
  name: "Create Projects",
  description: "Creates create projects in LaunchDarkly",
  category: "Projects",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const inputData = input.event.inputConfig;
        const endpoint = `/api/v2/projects`;

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
