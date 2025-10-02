import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Tokens
const inputSchema: Record<string, AppBlockConfigField> = {
  limit: {
    name: "Limit",
    description:
      "The number of access tokens to return in the response. Defaults to 25.",
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
  showAll: {
    name: "Show All",
    description:
      "If set to true, and the authentication access token has the 'Admin' role, personal access tokens for all members will be retrieved.",
    type: "boolean",
    required: false,
  },
};

// Output schema for List Tokens
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
            description: "The ID of the access token",
          },
          ownerId: {
            type: "string",
            description:
              "The ID of the owner of the account for the access token",
          },
          memberId: {
            type: "string",
            description: "The ID of the member who created the access token",
          },
          _member: {
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
            description: "Details on the member who created the access token",
          },
          name: {
            type: "string",
            description: "A human-friendly name for the access token",
          },
          description: {
            type: "string",
            description: "A description for the access token",
          },
          creationDate: {
            type: "integer",
            description: "Timestamp of when the access token was created",
          },
          lastModified: {
            type: "integer",
            description:
              "Timestamp of the last modification of the access token",
          },
          customRoleIds: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of custom role IDs to use as access limits for the access token",
          },
          inlineRole: {
            type: "array",
            items: {
              type: "object",
              properties: {
                resources: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Resource specifier strings",
                },
                notResources: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Targeted resources are the resources NOT in this list. The <code>resources</code> and <code>notActions</code> fields must be empty to use this field.",
                },
                actions: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Actions to perform on a resource",
                },
                notActions: {
                  type: "array",
                  items: {
                    type: "object",
                  },
                  description:
                    "Targeted actions are the actions NOT in this list. The <code>actions</code> and <code>notResources</code> fields must be empty to use this field.",
                },
                effect: {
                  type: "string",
                  enum: ["allow", "deny"],
                  description:
                    "Whether this statement should allow or deny actions on the resources.",
                },
              },
              required: ["effect"],
            },
            description:
              "An array of policy statements, with three attributes: effect, resources, actions. May be used in place of a role.",
          },
          role: {
            type: "string",
            description: "Base role for the token",
          },
          token: {
            type: "string",
            description:
              "The token value. When creating or resetting, contains the entire token value. Otherwise, contains the last four characters.",
          },
          serviceToken: {
            type: "boolean",
            description: "Whether this is a service token or a personal token",
          },
          _links: {
            type: "object",
            description: "The location and content type of related resources",
            additionalProperties: true,
          },
          defaultApiVersion: {
            type: "integer",
            description: "The default API version for this token",
          },
          lastUsed: {
            type: "integer",
            description: "Timestamp of when the access token was last used",
          },
        },
        required: [
          "_id",
          "ownerId",
          "memberId",
          "creationDate",
          "lastModified",
          "_links",
        ],
      },
      description: "An array of access tokens",
    },
    _links: {
      type: "object",
      additionalProperties: true,
    },
    totalCount: {
      type: "integer",
      description: "The number of access tokens returned",
    },
  },
};

export default {
  name: "List Tokens",
  description: "Retrieves list tokens in LaunchDarkly",
  category: "Access tokens",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const endpoint = `/api/v2/tokens`;

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
