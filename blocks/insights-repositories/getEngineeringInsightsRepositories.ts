import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Engineering Insights Repositories
const inputSchema: Record<string, AppBlockConfigField> = {
  expand: {
    name: "Expand",
    description: "Expand properties in response. Options: `projects`",
    type: "string",
    required: false,
  },
};

// Output schema for Get Engineering Insights Repositories
const outputSchema = {
  type: "object",
  properties: {
    totalCount: {
      type: "integer",
      description: "Total number of repositories",
    },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "The repository ID",
          },
          version: {
            type: "integer",
            description: "The repository version",
          },
          key: {
            type: "string",
            description: "The repository key",
          },
          type: {
            type: "string",
            description: "The repository type",
          },
          url: {
            type: "string",
            description: "The repository URL",
          },
          mainBranch: {
            type: "string",
            description: "The repository main branch",
          },
          projects: {
            type: "object",
            properties: {
              totalCount: {
                type: "integer",
              },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: {
                      type: "string",
                      description: "The ID of this project",
                    },
                    _links: {
                      type: "object",
                      description:
                        "The location and content type of related resources",
                      additionalProperties: true,
                    },
                    key: {
                      type: "string",
                      description: "The project key",
                    },
                    name: {
                      type: "string",
                      description: "The project name",
                    },
                  },
                  required: ["_id", "_links", "key", "name"],
                },
              },
              _links: {
                type: "object",
                additionalProperties: true,
              },
            },
            required: ["totalCount", "items"],
          },
        },
        required: ["_id", "version", "key", "type", "url", "mainBranch"],
      },
      description: "List of repositories",
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
  name: "Get Engineering Insights Repositories",
  description:
    "Retrieves get engineering insights repositories in LaunchDarkly",
  category: "Insights repositories",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const endpoint = `/api/v2/engineering-insights/repositories`;

        const apiKey = input.app.config.apiKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        await events.emit(
          await makeLaunchDarklyApiRequest(apiKey, baseUrl, endpoint, {
            method: "GET",
          }),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
