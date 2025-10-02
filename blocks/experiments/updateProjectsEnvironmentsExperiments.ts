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

// Input schema for Update Projects Environments Experiments
const inputSchema: Record<string, AppBlockConfigField> = {
  environmentKey: {
    name: "Environment Key",
    description: "The environment key",
    type: "string",
    required: true,
  },
  experimentKey: {
    name: "Experiment Key",
    description: "The experiment key",
    type: "string",
    required: true,
  },
  instructions: {
    name: "Instructions",
    description:
      'The instructions to perform when updating. This should be an array with objects that look like <code>{"kind": "update_action"}</code>. Some instructions also require a <code>value</code> field in the array element.',
    type: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: true,
      },
    },
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
  comment: {
    name: "Comment",
    description: "Optional comment describing the update",
    type: "string",
    required: false,
  },
};

// Output schema for Update Projects Environments Experiments
const outputSchema = {
  type: "object",
  properties: {
    _id: {
      type: "string",
      description: "The experiment ID",
    },
    key: {
      type: "string",
      description: "The experiment key",
    },
    name: {
      type: "string",
      description: "The experiment name",
    },
    description: {
      type: "string",
      description: "The experiment description",
    },
    _maintainerId: {
      type: "string",
      description: "The ID of the member who maintains this experiment.",
    },
    _creationDate: {
      type: "integer",
      description: "Timestamp of when the experiment was created",
    },
    environmentKey: {
      type: "string",
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
    holdoutId: {
      type: "string",
      description: "The holdout ID",
    },
    currentIteration: {
      type: "object",
      properties: {
        _id: {
          type: "string",
          description: "The iteration ID",
        },
        hypothesis: {
          type: "string",
          description: "The expected outcome of this experiment",
        },
        status: {
          type: "string",
          description:
            "The status of the iteration: <code>not_started</code>, <code>running</code>, <code>stopped</code>",
        },
        createdAt: {
          type: "integer",
          description: "Timestamp of when the iteration was created",
        },
        startedAt: {
          type: "integer",
          description: "Timestamp of when the iteration started",
        },
        endedAt: {
          type: "integer",
          description: "Timestamp of when the iteration ended",
        },
        winningTreatmentId: {
          type: "string",
          description:
            "The ID of the treatment chosen when the experiment stopped",
        },
        winningReason: {
          type: "string",
          description: "The reason you stopped the experiment",
        },
        canReshuffleTraffic: {
          type: "boolean",
          description:
            "Whether the experiment may reassign traffic to different variations when the experiment audience changes (true) or must keep all traffic assigned to its initial variation (false).",
        },
        flags: {
          type: "object",
          description: "Details on the flag used in this experiment",
          additionalProperties: true,
        },
        reallocationFrequencyMillis: {
          type: "integer",
          description:
            "The cadence (in milliseconds) to update the allocation. Only present for multi-armed bandits.",
        },
        version: {
          type: "integer",
          description: "The current version that the iteration is on",
        },
        primaryMetric: {
          type: "object",
          properties: {
            key: {
              type: "string",
              description:
                "A unique key to reference the metric or metric group",
            },
            _versionId: {
              type: "string",
              description: "The version ID of the metric or metric group",
            },
            name: {
              type: "string",
              description:
                "A human-friendly name for the metric or metric group",
            },
            kind: {
              type: "string",
              enum: [
                "pageview",
                "click",
                "custom",
                "funnel",
                "standard",
                "guardrail",
              ],
              description:
                "If this is a metric, then it represents the kind of event the metric tracks. If this is a metric group, then it represents the group type",
            },
            isNumeric: {
              type: "boolean",
              description:
                "For custom metrics, whether to track numeric changes in value against a baseline (<code>true</code>) or to track a conversion when an end user takes an action (<code>false</code>).",
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
            isGroup: {
              type: "boolean",
              description: "Whether this is a metric group or a metric",
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
                    description:
                      "The type of unit aggregation to use for the metric",
                  },
                  eventKey: {
                    type: "string",
                    description:
                      "The event key sent with the metric. Only relevant for custom metrics.",
                  },
                  _links: {
                    type: "object",
                    description:
                      "The location and content type of related resources",
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
              description:
                "An ordered list of the metrics in this metric group",
            },
          },
          required: ["key", "_versionId", "name", "kind", "_links", "isGroup"],
          description:
            "Deprecated, use <code>primarySingleMetric</code> and <code>primaryFunnel</code> instead. Details on the primary metric for this experiment.",
        },
        primarySingleMetric: {
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
          },
          required: ["key", "name", "kind", "_links"],
          description: "Details on the primary metric for this experiment",
        },
        primaryFunnel: {
          type: "object",
          properties: {
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
            _links: {
              type: "object",
              description: "The location and content type of related resources",
              additionalProperties: true,
            },
            metrics: {
              type: "array",
              items: {
                type: "object",
              },
              description: "The metrics in the metric group",
            },
          },
          required: ["key", "name", "kind", "_links"],
          description:
            "Details on the primary funnel group for this experiment",
        },
        randomizationUnit: {
          type: "string",
          description: "The unit of randomization for this iteration",
        },
        attributes: {
          type: "array",
          items: {
            type: "string",
          },
          description: "The available attribute filters for this iteration",
        },
        treatments: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: {
                type: "string",
                description:
                  "The treatment ID. This is the variation ID from the flag.",
              },
              name: {
                type: "string",
                description:
                  "The treatment name. This is the variation name from the flag.",
              },
              allocationPercent: {
                type: "string",
                description:
                  "The percentage of traffic allocated to this treatment during the iteration",
              },
              baseline: {
                type: "boolean",
                description:
                  "Whether this treatment is the baseline to compare other treatments against",
              },
              parameters: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    variationId: {
                      type: "string",
                    },
                    flagKey: {
                      type: "string",
                    },
                  },
                },
                description:
                  "Details on the flag and variation used for this treatment",
              },
            },
            required: ["name", "allocationPercent"],
          },
          description:
            "Details on the variations you are testing in the experiment",
        },
        secondaryMetrics: {
          type: "array",
          items: {
            type: "object",
            required: [],
          },
          description:
            "Deprecated, use <code>metrics</code> instead. Details on the secondary metrics for this experiment.",
        },
        metrics: {
          type: "array",
          items: {
            type: "object",
            required: [],
          },
          description: "Details on the metrics for this experiment",
        },
        layerSnapshot: {
          type: "object",
          properties: {
            key: {
              type: "string",
              description: "Key of the layer the experiment was part of",
            },
            name: {
              type: "string",
              description:
                "Layer name at the time this experiment iteration was stopped",
            },
            reservationPercent: {
              type: "integer",
              description:
                "Percent of layer traffic that was reserved in the layer for this experiment iteration",
            },
            otherReservationPercent: {
              type: "integer",
              description:
                "Percent of layer traffic that was reserved for other experiments in the same environment, when this experiment iteration was stopped",
            },
          },
          required: [
            "key",
            "name",
            "reservationPercent",
            "otherReservationPercent",
          ],
          description:
            "Snapshot of the layer state on iteration stop, if part of a layer. Otherwise omitted.",
        },
      },
      required: ["hypothesis", "status", "createdAt"],
      description: "Details on the current iteration",
    },
    draftIteration: {
      type: "object",
      required: [],
      description:
        "Details on the current iteration. This iteration may be already started, or may still be a draft.",
    },
    previousIterations: {
      type: "array",
      items: {
        type: "object",
        required: [],
      },
      description: "Details on the previous iterations for this experiment.",
    },
  },
  required: [
    "key",
    "name",
    "_maintainerId",
    "_creationDate",
    "environmentKey",
    "_links",
  ],
};

export default {
  name: "Update Projects Environments Experiments",
  description:
    "Updates update projects environments experiments in LaunchDarkly",
  category: "Experiments",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, environmentKey, experimentKey, ...inputData } =
          input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/environments/${environmentKey}/experiments/${experimentKey}`;

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
