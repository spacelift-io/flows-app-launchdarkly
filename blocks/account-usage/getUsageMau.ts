import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Usage Mau
const inputSchema: Record<string, AppBlockConfigField> = {
  aggregationType: {
    name: "Aggregation Type",
    description:
      "If specified, queries for rolling 30-day, month-to-date, or daily incremental counts. Default is rolling 30-day. Valid values: rolling_30d, month_to_date, daily_incremental",
    type: "string",
    required: false,
  },
  anonymous: {
    name: "Anonymous",
    description:
      "If specified, filters results to either anonymous or nonanonymous users.",
    type: "string",
    required: false,
  },
  contextKind: {
    name: "Context Kind",
    description:
      "Filters results to the specified context kinds. Can be specified multiple times, one query parameter per context kind. If not set, queries for the user context kind.",
    type: "string",
    required: false,
  },
  environment: {
    name: "Environment",
    description:
      "An environment key to filter results to. When using this parameter, exactly one project key must also be set. Can be specified multiple times as separate query parameters to view data for multiple environments within a single project.",
    type: "string",
    required: false,
  },
  from: {
    name: "From",
    description:
      "The series of data returned starts from this timestamp. Defaults to 30 days ago.",
    type: "string",
    required: false,
  },
  groupby: {
    name: "Groupby",
    description:
      "If specified, returns data for each distinct value of the given field. Can be specified multiple times to group data by multiple dimensions (for example, to group by both project and SDK). Valid values: project, environment, sdktype, sdk, anonymous, contextKind, sdkAppId",
    type: "string",
    required: false,
  },
  project: {
    name: "Project",
    description:
      "A project key to filter results to. Can be specified multiple times, one query parameter per project key, to view data for multiple projects.",
    type: "string",
    required: false,
  },
  sdk: {
    name: "Sdk",
    description:
      "An SDK name to filter results to. Can be specified multiple times, one query parameter per SDK.",
    type: "string",
    required: false,
  },
  sdktype: {
    name: "Sdktype",
    description:
      "An SDK type to filter results to. Can be specified multiple times, one query parameter per SDK type. Valid values: client, server",
    type: "string",
    required: false,
  },
  to: {
    name: "To",
    description:
      "The series of data returned ends at this timestamp. Defaults to the current time.",
    type: "string",
    required: false,
  },
};

// Output schema for Get Usage Mau
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
  name: "Get Usage Mau",
  description: "Retrieves get usage mau in LaunchDarkly",
  category: "Account usage",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const endpoint = `/api/v2/usage/mau`;

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
