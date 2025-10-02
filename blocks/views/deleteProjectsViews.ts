import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Projects Views
const inputSchema: Record<string, AppBlockConfigField> = {
  projectKey: {
    name: "Project Key",
    description: "",
    type: "string",
    required: true,
  },
  viewKey: {
    name: "View Key",
    description: "",
    type: "string",
    required: true,
  },
};

// Output schema for Delete Projects Views
const outputSchema = {};

export default {
  name: "Delete Projects Views",
  description: "Deletes delete projects views in LaunchDarkly",
  category: "Views",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, viewKey } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/views/${viewKey}`;

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
