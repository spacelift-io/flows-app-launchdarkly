import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Teams Roles
const inputSchema: Record<string, AppBlockConfigField> = {
  teamKey: {
    name: "Team Key",
    description: "The team key",
    type: "string",
    required: true,
  },
  limit: {
    name: "Limit",
    description:
      "The number of roles to return in the response. Defaults to 20.",
    type: "number",
    required: false,
  },
  offset: {
    name: "Offset",
    description:
      "Where to start in the list. This is for use with pagination. For example, an offset of 10 skips the first ten items and then returns the next items in the list, up to the query `limit`.",
    type: "number",
    required: false,
  },
};

// Output schema for Get Teams Roles
const outputSchema = {
  type: "object",
  properties: {
    totalCount: {
      type: "integer",
      description: "The number of custom roles assigned to this team",
    },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: {
            type: "string",
            description: "The key of the custom role",
          },
          name: {
            type: "string",
            description: "The name of the custom role",
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
                description:
                  "Details on each project where team members have write privileges on at least one resource type (e.g. flags)",
              },
            },
            description:
              "Details on the projects where team members have write privileges on at least one resource type (e.g. flags)",
          },
          appliedOn: {
            type: "integer",
            description:
              "Timestamp of when the custom role was assigned to this team",
          },
        },
      },
      description:
        "An array of the custom roles that have been assigned to this team",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
  },
};

export default {
  name: "Get Teams Roles",
  description: "Retrieves get teams roles in LaunchDarkly",
  category: "Teams",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { teamKey } = input.event.inputConfig;
        const endpoint = `/api/v2/teams/${teamKey}/roles`;

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
