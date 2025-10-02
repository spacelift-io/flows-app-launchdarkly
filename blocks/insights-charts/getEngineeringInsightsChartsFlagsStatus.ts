import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Engineering Insights Charts Flags Status
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

// Output schema for Get Engineering Insights Charts Flags Status
const outputSchema = {
  type: "object",
  properties: {
    metadata: {
      type: "object",
      properties: {
        summary: {
          type: "object",
          description: "Metadata values",
          additionalProperties: true,
        },
        name: {
          type: "string",
          description: "Name of the chart",
        },
        metrics: {
          type: "object",
          description:
            "Metrics for the given chart data, included when expanded",
          additionalProperties: true,
        },
        xAxis: {
          type: "object",
          properties: {
            unit: {
              type: "string",
              description: "Unit of the axis",
            },
          },
          required: ["unit"],
          description: "X-axis metadata",
        },
        yAxis: {
          type: "object",
          required: [],
          description: "Y-axis metadata",
        },
      },
      required: ["summary", "xAxis", "yAxis"],
      description: "Metadata for the chart",
    },
    series: {
      type: "array",
      items: {
        type: "object",
        properties: {
          metadata: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Name of the series",
              },
              count: {
                type: "integer",
                description: "Aggregate count of the series values",
              },
              bounds: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description: "Name of the bound",
                    },
                    value: {
                      type: "integer",
                      description: "Value of the bound",
                    },
                  },
                  required: ["name", "value"],
                },
                description: "Bounds for the series data",
              },
            },
            required: ["name"],
            description: "Metadata for the series",
          },
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                x: {
                  type: "integer",
                  description: "X-axis value",
                },
                y: {
                  type: "integer",
                  description: "Y-axis value",
                },
                values: {
                  type: "object",
                  description: "Additional values for the data point",
                  additionalProperties: true,
                },
              },
              required: ["x", "y"],
            },
            description: "Data points for the series",
          },
        },
        required: ["metadata", "data"],
      },
      description: "Series data for the chart",
    },
  },
  required: ["metadata", "series"],
};

export default {
  name: "Get Engineering Insights Charts Flags Status",
  description:
    "Retrieves get engineering insights charts flags status in LaunchDarkly",
  category: "Insights charts",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const endpoint = `/api/v2/engineering-insights/charts/flags/status`;

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
