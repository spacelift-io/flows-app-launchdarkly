import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Projects Environments Followers
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
};

// Output schema for Get Projects Environments Followers
const outputSchema = {
  type: "object",
  properties: {
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          flagKey: {
            type: "string",
            description: "The flag key",
          },
          followers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                _links: {
                  type: "object",
                  description:
                    "The location and content type of related resources",
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
            description: "A list of members who are following this flag",
          },
        },
      },
      description: "An array of flags and their followers",
    },
  },
  required: ["_links"],
};

export default {
  name: "Get Projects Environments Followers",
  description: "Retrieves get projects environments followers in LaunchDarkly",
  category: "Follow flags",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, environmentKey } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/environments/${environmentKey}/followers`;

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
