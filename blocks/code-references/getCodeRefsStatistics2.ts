import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Code Refs Statistics2
const inputSchema: Record<string, AppBlockConfigField> = {
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
  flagKey: {
    name: "Flag Key",
    description: "Filter results to a specific flag key",
    type: "string",
    required: false,
  },
};

// Output schema for Get Code Refs Statistics2
const outputSchema = {
  type: "object",
  properties: {
    flags: {
      type: "object",
      description:
        "A map of flag keys to a list of code reference statistics for each code repository in which the flag key appears",
      additionalProperties: true,
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
  },
  required: ["flags", "_links"],
};

export default {
  name: "Get Code Refs Statistics2",
  description: "Retrieves get code refs statistics2 in LaunchDarkly",
  category: "Code references",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey } = input.event.inputConfig;
        const endpoint = `/api/v2/code-refs/statistics/${projectKey}`;

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
