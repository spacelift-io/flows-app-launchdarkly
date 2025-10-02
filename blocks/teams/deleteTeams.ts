import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Teams
const inputSchema: Record<string, AppBlockConfigField> = {
  teamKey: {
    name: "Team Key",
    description: "The team key",
    type: "string",
    required: true,
  },
};

// Output schema for Delete Teams
const outputSchema = {};

export default {
  name: "Delete Teams",
  description: "Deletes delete teams in LaunchDarkly",
  category: "Teams",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { teamKey } = input.event.inputConfig;
        const endpoint = `/api/v2/teams/${teamKey}`;

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
