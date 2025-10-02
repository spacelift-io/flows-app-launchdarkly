import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Applications2
const inputSchema: Record<string, AppBlockConfigField> = {
  applicationKey: {
    name: "Application Key",
    description: "The application key",
    type: "string",
    required: true,
  },
  expand: {
    name: "Expand",
    description:
      "A comma-separated list of properties that can reveal additional information in the response. Options: `flags`.",
    type: "string",
    required: false,
  },
};

// Output schema for List Applications2
const outputSchema = {
  type: "object",
  properties: {
    flags: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "The flag name",
              },
              key: {
                type: "string",
                description: "The flag key",
              },
              _links: {
                type: "object",
                additionalProperties: true,
              },
            },
            required: ["name", "key"],
          },
          description:
            "A list of the flags that have been evaluated by the application",
        },
        totalCount: {
          type: "integer",
          description:
            "The number of flags that have been evaluated by the application",
        },
        _links: {
          type: "object",
          description: "The location and content type of related resources",
          additionalProperties: true,
        },
      },
      description:
        "Details about the flags that have been evaluated by the application",
    },
    _access: {
      type: "object",
      properties: {
        denied: {
          type: "array",
          items: {
            type: "object",
            properties: {
              action: {
                type: "string",
              },
              reason: {
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
                  role_name: {
                    type: "string",
                  },
                },
                required: ["effect"],
              },
            },
            required: ["action", "reason"],
          },
        },
        allowed: {
          type: "array",
          items: {
            type: "object",
            properties: {
              reason: {
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
                      type: "object",
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
                  role_name: {
                    type: "string",
                  },
                },
                required: ["effect"],
              },
            },
            required: ["reason"],
          },
        },
      },
      required: ["denied", "allowed"],
      description:
        "Details on the allowed and denied actions for this application",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    _version: {
      type: "integer",
      description: "Version of the application",
    },
    autoAdded: {
      type: "boolean",
      description:
        "Whether the application was automatically created because it was included in a context when a LaunchDarkly SDK evaluated a feature flag, or was created through the LaunchDarkly UI or REST API.",
    },
    creationDate: {
      type: "integer",
      description: "Timestamp of when the application version was created",
    },
    description: {
      type: "string",
      description: "The application description",
    },
    key: {
      type: "string",
      description: "The unique identifier of this application",
    },
    kind: {
      type: "string",
      enum: ["browser", "mobile", "server"],
      description: "To distinguish the kind of application",
    },
    _maintainer: {
      type: "object",
      properties: {
        member: {
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
          description: "Details on the member who maintains this resource",
        },
        team: {
          type: "object",
          properties: {
            customRoleKeys: {
              type: "array",
              items: {
                type: "string",
              },
              description:
                "A list of keys of the custom roles this team has access to",
            },
            key: {
              type: "string",
              description: "The team key",
            },
            _links: {
              type: "object",
              additionalProperties: true,
            },
            name: {
              type: "string",
              description: "The team name",
            },
          },
          required: ["customRoleKeys", "key", "name"],
          description: "Details on the team that maintains this resource",
        },
      },
      description:
        "Associated maintainer member or team info for the application",
    },
    name: {
      type: "string",
      description: "The name of the application",
    },
  },
  required: ["autoAdded", "key", "kind", "name"],
};

export default {
  name: "List Applications2",
  description: "Retrieves list applications2 in LaunchDarkly",
  category: "Applications",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { applicationKey } = input.event.inputConfig;
        const endpoint = `/api/v2/applications/${applicationKey}`;

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
