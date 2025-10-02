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

// Input schema for Create Destinations
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
  config: {
    name: "Config",
    description:
      "An object with the configuration parameters required for the destination type",
    type: {
      description:
        "An object with the configuration parameters required for the destination type",
    },
    required: false,
  },
  kind: {
    name: "Kind",
    description: "The type of Data Export destination",
    type: "string",
    required: false,
  },
  name: {
    name: "Name",
    description: "A human-readable name for your Data Export destination",
    type: "string",
    required: false,
  },
  on: {
    name: "On",
    description:
      "Whether the export is on. Displayed as the integration status in the LaunchDarkly UI.",
    type: "boolean",
    required: false,
  },
};

// Output schema for Create Destinations
const outputSchema = {
  type: "object",
  properties: {
    _id: {
      type: "string",
      description: "The ID of this Data Export destination",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    name: {
      type: "string",
      description: "A human-readable name for your Data Export destination",
    },
    kind: {
      type: "string",
      enum: [
        "google-pubsub",
        "kinesis",
        "mparticle",
        "segment",
        "azure-event-hubs",
        "snowflake-v2",
        "databricks",
        "bigquery",
      ],
      description: "The type of Data Export destination",
    },
    version: {
      type: "number",
    },
    config: {
      description:
        "An object with the configuration parameters required for the destination type",
    },
    on: {
      type: "boolean",
      description:
        "Whether the export is on, that is, the status of the integration",
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
        "Details on the allowed and denied actions for this Data Export destination",
    },
  },
};

export default {
  name: "Create Destinations",
  description: "Creates create destinations in LaunchDarkly",
  category: "Data Export destinations",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, environmentKey, ...inputData } =
          input.event.inputConfig;
        const endpoint = `/api/v2/destinations/${projectKey}/${environmentKey}`;

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
