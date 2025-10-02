import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import {
  makeLaunchDarklyApiRequest,
  filterDefinedParams,
} from "../../utils/apiHelpers.ts";

// Input schema for Update Engineering Insights Repositories Projects
const inputSchema: Record<string, AppBlockConfigField> = {
  mappings: {
    name: "Mappings",
    description: "",
    type: {
      type: "array",
      items: {
        type: "object",
        properties: {
          repositoryKey: {
            type: "string",
            description: "The repository key",
          },
          projectKey: {
            type: "string",
            description: "The project key",
          },
        },
        required: ["repositoryKey", "projectKey"],
      },
    },
    required: true,
  },
};

// Output schema for Update Engineering Insights Repositories Projects
const outputSchema = {
  type: "object",
  properties: {
    totalCount: {
      type: "integer",
      description: "Total number of repository project associations",
    },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          repositoryKey: {
            type: "string",
            description: "The repository key",
          },
          projectKey: {
            type: "string",
            description: "The project key",
          },
        },
        required: ["repositoryKey", "projectKey"],
      },
      description: "List of repository project associations",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
  },
  required: ["totalCount", "items"],
};

export default {
  name: "Update Engineering Insights Repositories Projects",
  description:
    "Updates update engineering insights repositories projects in LaunchDarkly",
  category: "Insights repositories",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const inputData = input.event.inputConfig;
        const endpoint = `/api/v2/engineering-insights/repositories/projects`;

        const apiKey = input.app.config.apiKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        await events.emit(
          await makeLaunchDarklyApiRequest(apiKey, baseUrl, endpoint, {
            method: "PUT",
            body: filterDefinedParams(inputData),
          }),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
