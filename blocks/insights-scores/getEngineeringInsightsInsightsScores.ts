import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Engineering Insights Insights Scores
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
  applicationKey: {
    name: "Application Key",
    description: "Comma separated list of application keys",
    type: "string",
    required: false,
  },
};

// Output schema for Get Engineering Insights Insights Scores
const outputSchema = {
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
      description: "The time period for the scores",
    },
    lastPeriod: {
      type: "object",
      required: [],
      description: "The time period for the scores in the last period",
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
      description: "The scores for the insight groups",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
  },
  required: ["period", "lastPeriod", "scores"],
};

export default {
  name: "Get Engineering Insights Insights Scores",
  description:
    "Retrieves get engineering insights insights scores in LaunchDarkly",
  category: "Insights scores",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const endpoint = `/api/v2/engineering-insights/insights/scores`;

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
