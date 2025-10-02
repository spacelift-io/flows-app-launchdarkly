import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Projects Ai Configs Model Configs Restricted
const inputSchema: Record<string, AppBlockConfigField> = {
  keys: {
    name: "Keys",
    description: "",
    type: ["string"],
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "",
    type: "string",
    required: true,
  },
};

// Output schema for Delete Projects Ai Configs Model Configs Restricted
const outputSchema = {};

export default {
  name: "Delete Projects Ai Configs Model Configs Restricted",
  description:
    "Deletes delete projects ai configs model configs restricted in LaunchDarkly",
  category: "AI Configs",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/ai-configs/model-configs/restricted`;

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
