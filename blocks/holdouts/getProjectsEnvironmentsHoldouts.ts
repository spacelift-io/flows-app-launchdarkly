import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Projects Environments Holdouts
const inputSchema: Record<string, AppBlockConfigField> = {
  environmentKey: {
    name: "Environment Key",
    description: "The environment key",
    type: "string",
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
  limit: {
    name: "Limit",
    description:
      "The number of holdouts to return in the response. Defaults to 20",
    type: "number",
    required: false,
  },
  offset: {
    name: "Offset",
    description:
      "Where to start in the list. Use this with pagination. For example, an `offset` of 10 skips the first ten items and then returns the next items in the list, up to the query `limit`.",
    type: "number",
    required: false,
  },
};

// Output schema for Get Projects Environments Holdouts
const outputSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _id: {
            type: "string",
          },
          key: {
            type: "string",
          },
          name: {
            type: "string",
          },
          status: {
            type: "string",
          },
          createdAt: {
            type: "integer",
          },
          experiments: {
            type: "array",
            items: {
              type: "object",
              properties: {
                key: {
                  type: "string",
                },
                name: {
                  type: "string",
                },
                environment: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    total_count: {
      type: "integer",
      description:
        "The total number of holdouts in this project and environment.",
    },
  },
};

export default {
  name: "Get Projects Environments Holdouts",
  description: "Retrieves get projects environments holdouts in LaunchDarkly",
  category: "Holdouts",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, environmentKey } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/environments/${environmentKey}/holdouts`;

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
