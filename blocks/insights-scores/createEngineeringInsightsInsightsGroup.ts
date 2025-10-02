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

// Input schema for Create Engineering Insights Insights Group
const inputSchema: Record<string, AppBlockConfigField> = {
  environmentKey: {
    name: "Environment Key",
    description: "The environmentKey to be associated with the insight group",
    type: "string",
    required: true,
  },
  key: {
    name: "Key",
    description: "The key of the insight group",
    type: "string",
    required: true,
  },
  name: {
    name: "Name",
    description: "The name of the insight group",
    type: "string",
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "The projectKey to be associated with the insight group",
    type: "string",
    required: true,
  },
  applicationKeys: {
    name: "Application Keys",
    description:
      "The application keys to associate with the insight group. If not provided, the insight group will include data from all applications.",
    type: ["string"],
    required: false,
  },
};

// Output schema for Create Engineering Insights Insights Group
const outputSchema = {
  type: "object",
  properties: {
    environment: {
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
      description: "Expanded details about the environment",
    },
    scores: {
      type: "object",
      properties: {
        overall: {
          type: "object",
          properties: {
            score: {
              type: "integer",
              description: "The score for the metric",
            },
            aggregateOf: {
              type: "array",
              items: {
                type: "string",
              },
              description:
                "The keys of the metrics that were aggregated to calculate this score",
            },
            diffVsLastPeriod: {
              type: "integer",
            },
            indicator: {
              type: "string",
              enum: [
                "excellent",
                "good",
                "fair",
                "needsAttention",
                "notCalculated",
                "unknown",
              ],
              description: "The indicator for the score",
            },
            indicatorRange: {
              type: "object",
              properties: {
                min: {
                  type: "integer",
                  description: "The minimum value for the indicator range",
                },
                max: {
                  type: "integer",
                  description: "The maximum value for the indicator range",
                },
              },
              required: ["min", "max"],
              description: "The indicator range for the score",
            },
            lastPeriod: {
              type: "object",
              required: [],
              description: "The score for the metric in the last period",
            },
          },
          required: ["score", "indicator", "indicatorRange"],
          description: "The overall score for the insight group",
        },
        deploymentFrequency: {
          type: "object",
          required: [],
          description: "The deployment frequency score for the insight group",
        },
        deploymentFailureRate: {
          type: "object",
          required: [],
          description:
            "The deployment failure rate score for the insight group",
        },
        leadTime: {
          type: "object",
          required: [],
          description: "The lead time score for the insight group",
        },
        impactSize: {
          type: "object",
          required: [],
          description: "The impact size score for the insight group",
        },
        experimentationCoverage: {
          type: "object",
          required: [],
          description:
            "The Experimentation coverage score for the insight group",
        },
        flagHealth: {
          type: "object",
          required: [],
          description: "The flag health score for the insight group",
        },
        velocity: {
          type: "object",
          required: [],
          description: "The velocity score for the insight group",
        },
        risk: {
          type: "object",
          required: [],
          description: "The risk score for the insight group",
        },
        efficiency: {
          type: "object",
          required: [],
          description: "The efficiency score for the insight group",
        },
        creationRatio: {
          type: "object",
          required: [],
          description: "The creation ratio score for the insight group",
        },
      },
      required: [
        "overall",
        "deploymentFrequency",
        "deploymentFailureRate",
        "leadTime",
        "impactSize",
        "experimentationCoverage",
        "flagHealth",
        "velocity",
        "risk",
        "efficiency",
      ],
      description: "The scores for the insight group",
    },
    scoreMetadata: {
      type: "object",
      properties: {
        period: {
          type: "object",
          properties: {
            startTime: {
              type: "integer",
              description: "The start time of the period",
            },
            endTime: {
              type: "integer",
              description: "The end time of the period",
            },
          },
          required: ["startTime", "endTime"],
          description: "The time period for the score calculations",
        },
        lastPeriod: {
          type: "object",
          required: [],
          description:
            "The time period for the score calculations in the last period",
        },
      },
      required: ["period", "lastPeriod"],
      description: "Metadata about the insight scores, when expanded",
    },
    key: {
      type: "string",
      description: "The insight group key",
    },
    name: {
      type: "string",
      description: "The insight group name",
    },
    projectKey: {
      type: "string",
      description: "The project key",
    },
    environmentKey: {
      type: "string",
      description: "The environment key",
    },
    applicationKeys: {
      type: "array",
      items: {
        type: "string",
      },
      description: "The application keys",
    },
    createdAt: {
      type: "integer",
      description: "The time the insight group was created",
    },
  },
  required: ["key", "name", "projectKey", "environmentKey", "createdAt"],
};

export default {
  name: "Create Engineering Insights Insights Group",
  description:
    "Creates create engineering insights insights group in LaunchDarkly",
  category: "Insights scores",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const inputData = input.event.inputConfig;
        const endpoint = `/api/v2/engineering-insights/insights/group`;

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
