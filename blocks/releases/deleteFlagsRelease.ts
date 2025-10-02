import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Flags Release
const inputSchema: Record<string, AppBlockConfigField> = {
  flagKey: {
    name: "Flag Key",
    description: "The flag key",
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

// Output schema for Delete Flags Release
const outputSchema = {};

export default {
  name: "Delete Flags Release",
  description: "Deletes delete flags release in LaunchDarkly",
  category: "Releases",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, flagKey } = input.event.inputConfig;
        const endpoint = `/api/v2/flags/${projectKey}/${flagKey}/release`;

        const apiKey = input.app.config.apiKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        await events.emit(
          await makeLaunchDarklyApiRequest(apiKey, baseUrl, endpoint, {
            method: "DELETE",
          }),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
