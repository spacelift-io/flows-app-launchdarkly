import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Members
const inputSchema: Record<string, AppBlockConfigField> = {
  id: {
    name: "Id",
    description: "The member ID",
    type: "string",
    required: true,
  },
};

// Output schema for Delete Members
const outputSchema = {};

export default {
  name: "Delete Members",
  description: "Deletes delete members in LaunchDarkly",
  category: "Account members",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { id } = input.event.inputConfig;
        const endpoint = `/api/v2/members/${id}`;

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
