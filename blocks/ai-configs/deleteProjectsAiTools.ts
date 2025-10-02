import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Projects Ai Tools
const inputSchema: Record<string, AppBlockConfigField> = {
  projectKey: {
    name: "Project Key",
    description: "",
    type: "string",
    required: true,
  },
  toolKey: {
    name: "Tool Key",
    description: "",
    type: "string",
    required: true,
  },
};

// Output schema for Delete Projects Ai Tools
const outputSchema = {};

export default {
  name: "Delete Projects Ai Tools",
  description: "Deletes delete projects ai tools in LaunchDarkly",
  category: "AI Configs",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, toolKey } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/ai-tools/${toolKey}`;

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
