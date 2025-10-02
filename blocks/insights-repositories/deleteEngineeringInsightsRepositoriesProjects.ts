import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Engineering Insights Repositories Projects
const inputSchema: Record<string, AppBlockConfigField> = {
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
  repositoryKey: {
    name: "Repository Key",
    description: "The repository key",
    type: "string",
    required: true,
  },
};

// Output schema for Delete Engineering Insights Repositories Projects
const outputSchema = {};

export default {
  name: "Delete Engineering Insights Repositories Projects",
  description:
    "Deletes delete engineering insights repositories projects in LaunchDarkly",
  category: "Insights repositories",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { repositoryKey, projectKey } = input.event.inputConfig;
        const endpoint = `/api/v2/engineering-insights/repositories/${repositoryKey}/projects/${projectKey}`;

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
