import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Roles
const inputSchema: Record<string, AppBlockConfigField> = {
  customRoleKey: {
    name: "Custom Role Key",
    description: "The custom role key",
    type: "string",
    required: true,
  },
};

// Output schema for Delete Roles
const outputSchema = {};

export default {
  name: "Delete Roles",
  description: "Deletes delete roles in LaunchDarkly",
  category: "Custom roles",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { customRoleKey } = input.event.inputConfig;
        const endpoint = `/api/v2/roles/${customRoleKey}`;

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
