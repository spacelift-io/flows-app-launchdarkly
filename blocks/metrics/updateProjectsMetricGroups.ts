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

// Input schema for Update Projects Metric Groups
const inputSchema: Record<string, AppBlockConfigField> = {
  metricGroupKey: {
    name: "Metric Group Key",
    description: "The metric group key",
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

// Output schema for Update Projects Metric Groups
const outputSchema = {
  type: "object",
  properties: {
    _id: {
      type: "string",
      description: "The ID of this metric group",
    },
    key: {
      type: "string",
      description: "A unique key to reference the metric group",
    },
    name: {
      type: "string",
      description: "A human-friendly name for the metric group",
    },
    kind: {
      type: "string",
      enum: ["funnel", "standard", "guardrail"],
      description: "The type of the metric group",
    },
    description: {
      type: "string",
      description: "Description of the metric group",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
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
        "Details on the allowed and denied actions for this metric group",
    },
    tags: {
      type: "array",
      items: {
        type: "string",
      },
      description: "Tags for the metric group",
    },
    _creationDate: {
      type: "integer",
      description: "Timestamp of when the metric group was created",
    },
    _lastModified: {
      type: "integer",
      description: "Timestamp of when the metric group was last modified",
    },
    maintainer: {
      type: "object",
      properties: {
        member: {
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
          description: "Details on the member who maintains this resource",
        },
        team: {
          type: "object",
          properties: {
            customRoleKeys: {
              type: "array",
              items: {
                type: "string",
              },
              description:
                "A list of keys of the custom roles this team has access to",
            },
            key: {
              type: "string",
              description: "The team key",
            },
            _links: {
              type: "object",
              additionalProperties: true,
            },
            name: {
              type: "string",
              description: "The team name",
            },
          },
          required: ["customRoleKeys", "key", "name"],
          description: "Details on the team that maintains this resource",
        },
      },
      description: "The maintainer of this metric",
    },
    metrics: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: {
            type: "string",
            description: "The metric key",
          },
          _versionId: {
            type: "string",
            description: "The version ID of the metric",
          },
          name: {
            type: "string",
            description: "The metric name",
          },
          kind: {
            type: "string",
            enum: ["pageview", "click", "custom"],
            description: "The kind of event the metric tracks",
          },
          isNumeric: {
            type: "boolean",
            description:
              "For custom metrics, whether to track numeric changes in value against a baseline (<code>true</code>) or to track a conversion when an end user takes an action (<code>false</code>).",
          },
          unitAggregationType: {
            type: "string",
            enum: ["sum", "average"],
            description: "The type of unit aggregation to use for the metric",
          },
          eventKey: {
            type: "string",
            description:
              "The event key sent with the metric. Only relevant for custom metrics.",
          },
          _links: {
            type: "object",
            description: "The location and content type of related resources",
            additionalProperties: true,
          },
          nameInGroup: {
            type: "string",
            description:
              "Name of the metric when used within the associated metric group. Can be different from the original name of the metric. Required if and only if the metric group is a <code>funnel</code>.",
          },
          randomizationUnits: {
            type: "array",
            items: {
              type: "string",
            },
            description: "The randomization units for the metric",
          },
        },
        required: ["key", "name", "kind", "_links"],
      },
      description: "An ordered list of the metrics in this metric group",
    },
    _version: {
      type: "integer",
      description: "The version of this metric group",
    },
    experiments: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: {
            type: "string",
            description: "The experiment key",
          },
          name: {
            type: "string",
            description: "The experiment name",
          },
          environmentId: {
            type: "string",
            description: "The environment ID",
          },
          environmentKey: {
            type: "string",
            description: "The environment key",
          },
          creationDate: {
            type: "integer",
            description: "Timestamp of when the experiment was created",
          },
          archivedDate: {
            type: "integer",
            description: "Timestamp of when the experiment was archived",
          },
          _links: {
            type: "object",
            description: "The location and content type of related resources",
            additionalProperties: true,
          },
        },
        required: [
          "key",
          "name",
          "environmentId",
          "environmentKey",
          "creationDate",
          "_links",
        ],
      },
      description:
        "Experiments that use this metric group. Only included if specified in the <code>expand</code> query parameter in a <code>getMetricGroup</code> request.",
    },
    experimentCount: {
      type: "integer",
      description: "The number of experiments using this metric group",
    },
  },
  required: [
    "_id",
    "key",
    "name",
    "kind",
    "_links",
    "tags",
    "_creationDate",
    "_lastModified",
    "maintainer",
    "metrics",
    "_version",
  ],
};

export default {
  name: "Update Projects Metric Groups",
  description: "Updates update projects metric groups in LaunchDarkly",
  category: "Metrics",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, metricGroupKey, ...inputData } =
          input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/metric-groups/${metricGroupKey}`;

        const apiKey = input.app.config.apiKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        await events.emit(
          await makeLaunchDarklyApiRequest(apiKey, baseUrl, endpoint, {
            method: "PATCH",
            body: filterDefinedParams(inputData),
          }),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
