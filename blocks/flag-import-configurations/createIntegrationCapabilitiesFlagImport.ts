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

// Input schema for Create Integration Capabilities Flag Import
const inputSchema: Record<string, AppBlockConfigField> = {
  config: {
    name: "Config",
    description:
      "The global configuration settings, as specified by the <code>formVariables</code> in the <code>manifest.json</code> for this configuration.",
    type: {
      type: "object",
    },
    required: true,
  },
  integrationKey: {
    name: "Integration Key",
    description: "The integration key",
    type: "string",
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
  name: {
    name: "Name",
    description: "Name to identify the configuration",
    type: "string",
    required: false,
  },
  tags: {
    name: "Tags",
    description: "Tags to associate with the configuration",
    type: ["string"],
    required: false,
  },
};

// Output schema for Create Integration Capabilities Flag Import
const outputSchema = {
  type: "object",
  properties: {
    _links: {
      type: "object",
      properties: {
        self: {
          type: "object",
          properties: {
            href: {
              type: "string",
            },
            type: {
              type: "string",
            },
          },
        },
      },
      required: ["self"],
      description: "The location and content type of related resources",
    },
    _id: {
      type: "string",
      description: "The integration ID",
    },
    integrationKey: {
      type: "string",
      enum: ["split", "unleash"],
      description: "The integration key",
    },
    projectKey: {
      type: "string",
      description: "The project key",
    },
    config: {
      type: "object",
      description:
        "The configuration for the given import integration. Only included when requesting a single integration by ID. Refer to the <code>formVariables</code> field in the corresponding <code>manifest.json</code> for a full list of fields for each integration.",
      additionalProperties: true,
    },
    tags: {
      type: "array",
      items: {
        type: "string",
      },
      description: "List of tags for this configuration",
    },
    name: {
      type: "string",
      description: "Name of the configuration",
    },
    version: {
      type: "integer",
      description: "Version of the current configuration",
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
        "Details on the allowed and denied actions for this configuration",
    },
    _status: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["complete", "importing", "pending", "failed", "partial"],
          description:
            "The current status of the import integrations related import job",
        },
        lastImport: {
          type: "integer",
          description:
            "Timestamp of when the most recent successful import occurred.",
        },
        lastError: {
          type: "integer",
          description:
            "Timestamp of when the most recent import error occurred, if any",
        },
        errors: {
          type: "array",
          items: {
            type: "object",
            properties: {
              integrationId: {
                type: "string",
              },
              message: {
                type: "string",
              },
              statusCode: {
                type: "integer",
              },
              timestamp: {
                type: "integer",
              },
            },
          },
        },
      },
      description: "Details on the status of the import job",
    },
  },
  required: [
    "_links",
    "_id",
    "integrationKey",
    "projectKey",
    "config",
    "tags",
    "name",
    "version",
    "_status",
  ],
};

export default {
  name: "Create Integration Capabilities Flag Import",
  description:
    "Creates create integration capabilities flag import in LaunchDarkly",
  category: "Flag import configurations",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, integrationKey, ...inputData } =
          input.event.inputConfig;
        const endpoint = `/api/v2/integration-capabilities/flag-import/${projectKey}/${integrationKey}`;

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
