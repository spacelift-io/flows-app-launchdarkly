import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Usage Observability Traces
const inputSchema: Record<string, AppBlockConfigField> = {
  aggregationType: {
    name: "Aggregation Type",
    description:
      "Specifies the aggregation method. Defaults to `month_to_date`.<br/>Valid values: `month_to_date`, `incremental`, `rolling_30d`.",
    type: "string",
    required: false,
  },
  from: {
    name: "From",
    description:
      "The series of data returned starts from this timestamp (Unix seconds). Defaults to the beginning of the current month.",
    type: "string",
    required: false,
  },
  granularity: {
    name: "Granularity",
    description:
      "Specifies the data granularity. Defaults to `daily`. Valid values depend on `aggregationType`: **month_to_date** supports `daily` and `monthly`; **incremental** and **rolling_30d** support `daily` only.",
    type: "string",
    required: false,
  },
  projectKey: {
    name: "Project Key",
    description:
      "A project key to filter results by. Can be specified multiple times, one query parameter per project key.",
    type: "string",
    required: false,
  },
  to: {
    name: "To",
    description:
      "The series of data returned ends at this timestamp (Unix seconds). Defaults to the current time.",
    type: "string",
    required: false,
  },
};

// Output schema for Get Usage Observability Traces
const outputSchema = {
  type: "object",
  properties: {
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    metadata: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: true,
      },
      description: "Metadata about each series",
    },
    series: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: true,
      },
      description:
        "An array of data points with timestamps. Each element of the array is an object with a 'time' field, whose value is the timestamp, and one or more key fields. If there are multiple key fields, they are labeled '0', '1', and so on, and are explained in the <code>metadata</code>.",
    },
  },
  required: ["_links", "metadata", "series"],
};

export default {
  name: "Get Usage Observability Traces",
  description: "Retrieves get usage observability traces in LaunchDarkly",
  category: "Account usage",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const endpoint = `/api/v2/usage/observability/traces`;

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
