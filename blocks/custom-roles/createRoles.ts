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

// Input schema for Create Roles
const inputSchema: Record<string, AppBlockConfigField> = {
  key: {
    name: "Key",
    description: "The custom role key",
    type: "string",
    required: true,
  },
  name: {
    name: "Name",
    description: "A human-friendly name for the custom role",
    type: "string",
    required: true,
  },
  policy: {
    name: "Policy",
    description: "Resource statements for custom role",
    type: {
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
              "Targeted resources are the resources NOT in this list. The <code>resources</code> field must be empty to use this field.",
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
              "Targeted actions are the actions NOT in this list. The <code>actions</code> field must be empty to use this field.",
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
    },
    required: true,
  },
  basePermissions: {
    name: "Base Permissions",
    description:
      "Base permissions to use for this role. Defaults to reader. Recommended to set this to no_access in all cases.",
    type: "string",
    required: false,
  },
  description: {
    name: "Description",
    description: "Description of custom role",
    type: "string",
    required: false,
  },
  resourceCategory: {
    name: "Resource Category",
    description:
      "The category of resources this role is intended to manage. Can be <code>organization</code>, <code>project</code>, or <code>any</code>. This field is immutable.",
    type: "string",
    required: false,
  },
};

// Output schema for Create Roles
const outputSchema = {
  type: "object",
  properties: {
    _id: {
      type: "string",
      description: "The ID of the custom role",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
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
        "Details on the allowed and denied actions for this custom role",
    },
    description: {
      type: "string",
      description: "The description of the custom role",
    },
    key: {
      type: "string",
      description: "The key of the custom role",
    },
    name: {
      type: "string",
      description: "The name of the custom role",
    },
    policy: {
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
        },
        required: ["effect"],
      },
      description: "An array of the policies that comprise this custom role",
    },
    basePermissions: {
      type: "string",
      description:
        "Base permissions to use for this role. Defaults to reader. Recommended to set this to no_access in all cases.",
    },
    resourceCategory: {
      type: "string",
      description:
        "The category of resources this role is intended to manage. Can be <code>organization</code>, <code>project</code>, or <code>any</code>. Once set, this field cannot be changed.",
    },
    assignedTo: {
      type: "object",
      properties: {
        membersCount: {
          type: "integer",
          description:
            "The number of individual members this role is assigned to",
        },
        teamsCount: {
          type: "integer",
          description: "The number of teams this role is assigned to",
        },
      },
      description: "The number of teams and members this role is assigned to",
    },
    _presetBundleVersion: {
      type: "integer",
      description: "If created from a preset, the preset bundle version",
    },
    _presetStatements: {
      type: "array",
      items: {
        type: "object",
      },
      description:
        "If created from a preset, the read-only statements copied from the preset",
    },
  },
  required: ["_id", "_links", "key", "name", "policy"],
};

export default {
  name: "Create Roles",
  description: "Creates create roles in LaunchDarkly",
  category: "Custom roles",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const inputData = input.event.inputConfig;
        const endpoint = `/api/v2/roles`;

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
