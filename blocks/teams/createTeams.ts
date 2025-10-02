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

// Input schema for Create Teams
const inputSchema: Record<string, AppBlockConfigField> = {
  key: {
    name: "Key",
    description: "The team key",
    type: "string",
    required: true,
  },
  name: {
    name: "Name",
    description: "A human-friendly name for the team",
    type: "string",
    required: true,
  },
  customRoleKeys: {
    name: "Custom Role Keys",
    description: "List of custom role keys the team will access",
    type: ["string"],
    required: false,
  },
  description: {
    name: "Description",
    description: "A description of the team",
    type: "string",
    required: false,
  },
  expand: {
    name: "Expand",
    description:
      "A comma-separated list of properties that can reveal additional information in the response. Supported fields are explained above.",
    type: "string",
    required: false,
  },
  memberIDs: {
    name: "Member I Ds",
    description: "A list of member IDs who belong to the team",
    type: ["string"],
    required: false,
  },
  permissionGrants: {
    name: "Permission Grants",
    description:
      "A list of permission grants. Permission grants allow access to a specific action, without having to create or update a custom role.",
    type: {
      type: "array",
      items: {
        type: "object",
        properties: {
          actionSet: {
            type: "string",
            enum: ["maintainTeam"],
            description:
              "A group of related actions to allow. Specify either <code>actionSet</code> or <code>actions</code>. Use <code>maintainTeam</code> to add team maintainers.",
          },
          actions: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of actions to allow. Specify either <code>actionSet</code> or <code>actions</code>. To learn more, read [Role actions](https://launchdarkly.com/docs/ld-docs/home/account/role-actions).",
          },
          memberIDs: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of member IDs who receive the permission grant.",
          },
        },
      },
    },
    required: false,
  },
  roleAttributes: {
    name: "Role Attributes",
    description: "A map of role attributes for the team",
    type: {
      type: "object",
    },
    required: false,
  },
};

// Output schema for Create Teams
const outputSchema = {
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
      description: "Details on the allowed and denied actions for this team",
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
          description: "The location and content type of related resources",
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
          description: "The total count of members that belong to the team",
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
          description: "The location and content type of related resources",
          additionalProperties: true,
        },
      },
      description:
        "Paginated list of the maintainers assigned to this team. Only included if specified in the <code>expand</code> query parameter.",
    },
  },
};

export default {
  name: "Create Teams",
  description: "Creates create teams in LaunchDarkly",
  category: "Teams",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const inputData = input.event.inputConfig;
        const endpoint = `/api/v2/teams`;

        const apiKey = input.app.config.apiKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        await events.emit(
          await makeLaunchDarklyApiRequest(apiKey, baseUrl, endpoint, {
            method: "POST",
            body: filterDefinedParams(inputData),
          }),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
