import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Projects Environments2
const inputSchema: Record<string, AppBlockConfigField> = {
  environmentKey: {
    name: "Environment Key",
    description: "The environment key",
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

// Output schema for Get Projects Environments2
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
      description: "The color used to indicate this environment in the UI",
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
      description: "Details on the approval settings for this environment",
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
};

export default {
  name: "Get Projects Environments2",
  description: "Retrieves get projects environments2 in LaunchDarkly",
  category: "Environments",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, environmentKey } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/environments/${environmentKey}`;

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
