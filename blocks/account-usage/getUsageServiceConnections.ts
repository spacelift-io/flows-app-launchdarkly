import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Usage Service Connections
const inputSchema: Record<string, AppBlockConfigField> = {
  aggregationType: {
    name: "Aggregation Type",
    description:
      "Specifies the aggregation method. Defaults to `month_to_date`.<br/>Valid values: `month_to_date`, `incremental`.",
    type: "string",
    required: false,
  },
  connectionType: {
    name: "Connection Type",
    description:
      "A connection type to filter results by. Can be specified multiple times, one query parameter per connection type.",
    type: "string",
    required: false,
  },
  environmentKey: {
    name: "Environment Key",
    description:
      "An environment key to filter results by. If specified, exactly one `projectKey` must be provided. Can be specified multiple times, one query parameter per environment key.",
    type: "string",
    required: false,
  },
  from: {
    name: "From",
    description:
      "The series of data returned starts from this timestamp (Unix milliseconds). Defaults to the beginning of the current month.",
    type: "string",
    required: false,
  },
  granularity: {
    name: "Granularity",
    description:
      "Specifies the data granularity. Defaults to `daily`. `monthly` granularity is only supported with the **month_to_date** aggregation type.<br/>Valid values: `daily`, `hourly`, `monthly`.",
    type: "string",
    required: false,
  },
  groupBy: {
    name: "Group By",
    description:
      "If specified, returns data for each distinct value of the given field. Can be specified multiple times to group data by multiple dimensions, one query parameter per dimension.<br/>Valid values: `projectId`, `environmentId`, `connectionType`, `relayVersion`, `sdkName`, `sdkVersion`, `sdkType`.",
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
  relayVersion: {
    name: "Relay Version",
    description:
      "A relay version to filter results by. Can be specified multiple times, one query parameter per relay version.",
    type: "string",
    required: false,
  },
  sdkName: {
    name: "Sdk Name",
    description:
      "An SDK name to filter results by. Can be specified multiple times, one query parameter per SDK name.",
    type: "string",
    required: false,
  },
  sdkType: {
    name: "Sdk Type",
    description:
      "An SDK type to filter results by. Can be specified multiple times, one query parameter per SDK type.",
    type: "string",
    required: false,
  },
  sdkVersion: {
    name: "Sdk Version",
    description:
      "An SDK version to filter results by. Can be specified multiple times, one query parameter per SDK version.",
    type: "string",
    required: false,
  },
  to: {
    name: "To",
    description:
      "The series of data returned ends at this timestamp (Unix milliseconds). Defaults to the current time.",
    type: "string",
    required: false,
  },
};

// Output schema for Get Usage Service Connections
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
        additionalProperties: {
          type: "number",
        },
      },
      description:
        "An array of data points with timestamps. Each element of the array is an object with a 'time' field, whose value is the timestamp, and one or more key fields. If there are multiple key fields, they are labeled '0', '1', and so on, and are explained in the <code>metadata</code>.",
    },
  },
  required: ["_links", "metadata", "series"],
};

export default {
  name: "Get Usage Service Connections",
  description: "Retrieves get usage service connections in LaunchDarkly",
  category: "Account usage",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const endpoint = `/api/v2/usage/service-connections`;

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
