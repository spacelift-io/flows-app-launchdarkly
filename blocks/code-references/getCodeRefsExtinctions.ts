import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Code Refs Extinctions
const inputSchema: Record<string, AppBlockConfigField> = {
  branchName: {
    name: "Branch Name",
    description:
      "Filter results to a specific branch. By default, only the default branch will be queried for extinctions.",
    type: "string",
    required: false,
  },
  flagKey: {
    name: "Flag Key",
    description: "Filter results to a specific flag key",
    type: "string",
    required: false,
  },
  from: {
    name: "From",
    description:
      "Filter results to a specific timeframe based on commit time, expressed as a Unix epoch time in milliseconds. Must be used with `to`.",
    type: "number",
    required: false,
  },
  projKey: {
    name: "Proj Key",
    description: "Filter results to a specific project",
    type: "string",
    required: false,
  },
  repoName: {
    name: "Repo Name",
    description: "Filter results to a specific repository",
    type: "string",
    required: false,
  },
  to: {
    name: "To",
    description:
      "Filter results to a specific timeframe based on commit time, expressed as a Unix epoch time in milliseconds. Must be used with `from`.",
    type: "number",
    required: false,
  },
};

// Output schema for Get Code Refs Extinctions
const outputSchema = {
  type: "object",
  properties: {
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    items: {
      type: "object",
      description: "An array of extinction events",
      additionalProperties: true,
    },
  },
  required: ["_links", "items"],
};

export default {
  name: "Get Code Refs Extinctions",
  description: "Retrieves get code refs extinctions in LaunchDarkly",
  category: "Code references",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const endpoint = `/api/v2/code-refs/extinctions`;

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
