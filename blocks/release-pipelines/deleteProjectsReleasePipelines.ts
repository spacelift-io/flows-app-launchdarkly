import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Projects Release Pipelines
const inputSchema: Record<string, AppBlockConfigField> = {
  pipelineKey: {
    name: "Pipeline Key",
    description: "The release pipeline key",
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

// Output schema for Delete Projects Release Pipelines
const outputSchema = {};

export default {
  name: "Delete Projects Release Pipelines",
  description: "Deletes delete projects release pipelines in LaunchDarkly",
  category: "Release pipelines",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, pipelineKey } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/release-pipelines/${pipelineKey}`;

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
