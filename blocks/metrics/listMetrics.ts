import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Metrics
const inputSchema: Record<string, AppBlockConfigField> = {
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
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
      "A comma-separated list of filters. This endpoint accepts filtering by `query`, `tags`, 'eventKind', 'isNumeric', 'unitAggregationType`, `hasConnections`, `maintainerIds`, `maintainerTeamKey` and `view`. To learn more about the filter syntax, read the 'Filtering metrics' section above.",
    type: "string",
    required: false,
  },
  limit: {
    name: "Limit",
    description:
      "The number of metrics to return in the response. Defaults to 20. Maximum limit is 50.",
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
      "A field to sort the items by. Prefix field by a dash ( - ) to sort in descending order. This endpoint supports sorting by `createdAt` or `name`.",
    type: "string",
    required: false,
  },
};

// Output schema for List Metrics
const outputSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          experimentCount: {
            type: "integer",
            description: "The number of experiments using this metric",
          },
          metricGroupCount: {
            type: "integer",
            description: "The number of metric groups using this metric",
          },
          activeExperimentCount: {
            type: "integer",
            description: "The number of active experiments using this metric",
          },
          activeGuardedRolloutCount: {
            type: "integer",
            description:
              "The number of active guarded rollouts using this metric",
          },
          _id: {
            type: "string",
            description: "The ID of this metric",
          },
          _versionId: {
            type: "string",
            description: "The version ID of the metric",
          },
          _version: {
            type: "integer",
            description: "Version of the metric",
          },
          key: {
            type: "string",
            description: "A unique key to reference the metric",
          },
          name: {
            type: "string",
            description: "A human-friendly name for the metric",
          },
          kind: {
            type: "string",
            enum: ["pageview", "click", "custom"],
            description: "The kind of event the metric tracks",
          },
          _attachedFlagCount: {
            type: "integer",
            description:
              "The number of feature flags currently attached to this metric",
          },
          _links: {
            type: "object",
            description: "The location and content type of related resources",
            additionalProperties: true,
          },
          _site: {
            type: "object",
            description:
              "Details on how to access the metric in the LaunchDarkly UI",
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
              "Details on the allowed and denied actions for this metric",
          },
          tags: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Tags for the metric",
          },
          _creationDate: {
            type: "integer",
            description: "Timestamp of when the metric was created",
          },
          lastModified: {
            type: "object",
            properties: {
              date: {
                type: "string",
              },
            },
          },
          maintainerId: {
            type: "string",
            description: "The ID of the member who maintains this metric",
          },
          _maintainer: {
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
            description: "Details on the member who maintains this metric",
          },
          description: {
            type: "string",
            description: "Description of the metric",
          },
          category: {
            type: "string",
            description: "The category of the metric",
          },
          isNumeric: {
            type: "boolean",
            description:
              "For custom metrics, whether to track numeric changes in value against a baseline (<code>true</code>) or to track a conversion when an end user takes an action (<code>false</code>).",
          },
          successCriteria: {
            type: "string",
            enum: ["HigherThanBaseline", "LowerThanBaseline"],
            description: "For custom metrics, the success criteria",
          },
          unit: {
            type: "string",
            description: "For numeric custom metrics, the unit of measure",
          },
          eventKey: {
            type: "string",
            description:
              "For custom metrics, the event key to use in your code",
          },
          randomizationUnits: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "An array of randomization units allowed for this metric",
          },
          filters: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["group", "contextAttribute", "eventProperty"],
                description:
                  "Filter type. One of [contextAttribute, eventProperty, group]",
              },
              attribute: {
                type: "string",
                description:
                  "If not a group node, the context attribute name or event property name to filter on",
              },
              op: {
                type: "string",
                description: "The function to perform",
              },
              values: {
                type: "array",
                items: {
                  type: "object",
                },
                description:
                  "The context attribute / event property values or group member nodes",
              },
              contextKind: {
                type: "string",
                description: "For context attribute filters, the context kind.",
              },
              negate: {
                type: "boolean",
                description:
                  "If set, then take the inverse of the operator. 'in' becomes 'not in'.",
              },
            },
            required: ["type", "op", "values", "negate"],
            description:
              "The filters narrowing down the audience based on context attributes or event properties.",
          },
          unitAggregationType: {
            type: "string",
            enum: ["average", "sum"],
            description:
              "The method by which multiple unit event values are aggregated",
          },
          analysisType: {
            type: "string",
            enum: ["mean", "percentile"],
            description: "The method for analyzing metric events",
          },
          percentileValue: {
            type: "integer",
            description:
              "The percentile for the analysis method. An integer denoting the target percentile between 0 and 100. Required when <code>analysisType</code> is <code>percentile</code>.",
          },
          eventDefault: {
            type: "object",
            properties: {
              disabled: {
                type: "boolean",
                description:
                  "Whether to disable defaulting missing unit events when calculating results. Defaults to false",
              },
              value: {
                type: "number",
                description:
                  "The default value applied to missing unit events. Set to 0 when <code>disabled</code> is false. No other values are currently supported.",
              },
            },
          },
          dataSource: {
            type: "object",
            properties: {
              key: {
                type: "string",
              },
              environmentKey: {
                type: "string",
              },
              _name: {
                type: "string",
              },
              _integrationKey: {
                type: "string",
              },
            },
          },
          archived: {
            type: "boolean",
            description: "Whether the metric version is archived",
          },
          archivedAt: {
            type: "integer",
            description: "Timestamp when the metric version was archived",
          },
          selector: {
            type: "string",
            description: "For click metrics, the CSS selectors",
          },
          urls: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: true,
            },
            description: "For click and pageview metrics, the target URLs",
          },
        },
        required: [
          "_id",
          "_versionId",
          "key",
          "name",
          "kind",
          "_links",
          "tags",
          "_creationDate",
        ],
      },
      description: "An array of metrics",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    totalCount: {
      type: "integer",
    },
  },
};

export default {
  name: "List Metrics",
  description: "Retrieves list metrics in LaunchDarkly",
  category: "Metrics",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey } = input.event.inputConfig;
        const endpoint = `/api/v2/metrics/${projectKey}`;

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
