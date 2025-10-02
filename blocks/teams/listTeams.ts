import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Teams
const inputSchema: Record<string, AppBlockConfigField> = {
  expand: {
    name: "Expand",
    description:
      "A comma-separated list of properties that can reveal additional information in the response.",
    type: "string",
    required: false,
  },
  filter: {
    name: "Filter",
    description:
      "A comma-separated list of filters. Each filter is constructed as `field:value`.",
    type: "string",
    required: false,
  },
  limit: {
    name: "Limit",
    description:
      "The number of teams to return in the response. Defaults to 20.",
    type: "number",
    required: false,
  },
  offset: {
    name: "Offset",
    description:
      "Where to start in the list. Use this with pagination. For example, an offset of 10 skips the first ten items and returns the next `limit` items.",
    type: "number",
    required: false,
  },
};

// Output schema for List Teams
const outputSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          description: {
            type: "string",
            description: "A description of the team",
          },
          key: {
            type: "string",
            description: "The team key",
          },
          name: {
            type: "string",
            description: "A human-friendly name for the team",
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
              "Details on the allowed and denied actions for this team",
          },
          _creationDate: {
            type: "integer",
            description: "Timestamp of when the team was created",
          },
          _links: {
            type: "object",
            description: "The location and content type of related resources",
            additionalProperties: true,
          },
          _lastModified: {
            type: "integer",
            description: "Timestamp of when the team was most recently updated",
          },
          _version: {
            type: "integer",
            description: "The team version",
          },
          _idpSynced: {
            type: "boolean",
            description:
              "Whether the team has been synced with an external identity provider (IdP). Team sync is available to customers on an Enterprise plan.",
          },
          roleAttributes: {
            type: "object",
            description: "A map of role attributes for the team",
            additionalProperties: true,
          },
          roles: {
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
                description:
                  "The location and content type of related resources",
                additionalProperties: true,
              },
            },
            description:
              "Paginated list of the custom roles assigned to this team. Only included if specified in the <code>expand</code> query parameter.",
          },
          members: {
            type: "object",
            properties: {
              totalCount: {
                type: "integer",
                description:
                  "The total count of members that belong to the team",
              },
            },
            description:
              "Details on the total count of members that belong to the team. Only included if specified in the <code>expand</code> query parameter.",
          },
          projects: {
            type: "object",
            description:
              "Paginated list of the projects that the team has any write access to. Only included if specified in the <code>expand</code> query parameter.",
          },
          maintainers: {
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
                description:
                  "Details on the members that have been assigned as maintainers of the team",
              },
              _links: {
                type: "object",
                description:
                  "The location and content type of related resources",
                additionalProperties: true,
              },
            },
            description:
              "Paginated list of the maintainers assigned to this team. Only included if specified in the <code>expand</code> query parameter.",
          },
        },
      },
      description: "An array of teams",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    totalCount: {
      type: "integer",
      description: "The number of teams",
    },
  },
  required: ["items"],
};

export default {
  name: "List Teams",
  description: "Retrieves list teams in LaunchDarkly",
  category: "Teams",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const endpoint = `/api/v2/teams`;

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
