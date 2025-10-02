import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Teams Maintainers
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
      "The number of maintainers to return in the response. Defaults to 20.",
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

// Output schema for Get Teams Maintainers
const outputSchema = {
  type: "object",
  properties: {
    totalCount: {
      type: "integer",
      description: "The number of maintainers of the team",
    },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _links: {
            type: "object",
            description: "The location and content type of related resources",
            additionalProperties: true,
          },
          _id: {
            type: "string",
            description: "The member's ID",
          },
          firstName: {
            type: "string",
            description: "The member's first name",
          },
          lastName: {
            type: "string",
            description: "The member's last name",
          },
          role: {
            type: "string",
            description:
              "The member's base role. If the member has no additional roles, this role will be in effect.",
          },
          email: {
            type: "string",
            description: "The member's email address",
          },
        },
        required: ["_links", "_id", "role", "email"],
      },
      description:
        "Details on the members that have been assigned as maintainers of the team",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
  },
};

export default {
  name: "Get Teams Maintainers",
  description: "Retrieves get teams maintainers in LaunchDarkly",
  category: "Teams",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { teamKey } = input.event.inputConfig;
        const endpoint = `/api/v2/teams/${teamKey}/maintainers`;

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
