import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Projects Environments Contexts
const inputSchema: Record<string, AppBlockConfigField> = {
  environmentKey: {
    name: "Environment Key",
    description: "The environment key",
    type: "string",
    required: true,
  },
  key: {
    name: "Key",
    description: "The context key",
    type: "string",
    required: true,
  },
  kind: {
    name: "Kind",
    description: "The context kind",
    type: "string",
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
  continuationToken: {
    name: "Continuation Token",
    description:
      "Limits results to contexts with sort values after the value specified. You can use this for pagination, however, we recommend using the `next` link we provide instead.",
    type: "string",
    required: false,
  },
  filter: {
    name: "Filter",
    description:
      "A comma-separated list of context filters. This endpoint only accepts an `applicationId` filter. To learn more about the filter syntax, read [Filtering contexts and context instances](https://launchdarkly.com/docs/ld-docs/api/contexts#filtering-contexts-and-context-instances).",
    type: "string",
    required: false,
  },
  includeTotalCount: {
    name: "Include Total Count",
    description:
      "Specifies whether to include or omit the total count of matching contexts. Defaults to true.",
    type: "boolean",
    required: false,
  },
  limit: {
    name: "Limit",
    description:
      "Specifies the maximum number of items in the collection to return (max: 50, default: 20)",
    type: "number",
    required: false,
  },
  sort: {
    name: "Sort",
    description:
      "Specifies a field by which to sort. LaunchDarkly supports sorting by timestamp in ascending order by specifying `ts` for this value, or descending order by specifying `-ts`.",
    type: "string",
    required: false,
  },
};

// Output schema for Get Projects Environments Contexts
const outputSchema = {
  type: "object",
  properties: {
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    totalCount: {
      type: "integer",
      description: "The number of contexts",
    },
    _environmentId: {
      type: "string",
      description: "The environment ID where the context was evaluated",
    },
    continuationToken: {
      type: "string",
      description:
        "An obfuscated string that references the last context instance on the previous page of results. You can use this for pagination, however, we recommend using the <code>next</code> link instead.",
    },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          lastSeen: {
            type: "string",
            description:
              "Timestamp of the last time an evaluation occurred for this context",
          },
          applicationId: {
            type: "string",
            description:
              "An identifier representing the application where the LaunchDarkly SDK is running",
          },
          context: {
            description: "The context, including its kind and attributes",
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
              "Details on the allowed and denied actions for this context instance",
          },
          associatedContexts: {
            type: "integer",
            description:
              "The total number of associated contexts. Associated contexts are contexts that have appeared in the same context instance, that is, they were part of the same flag evaluation.",
          },
        },
        required: ["context"],
      },
      description:
        "A collection of contexts. Can include multiple versions of contexts that have the same <code>kind</code> and <code>key</code>, but different <code>applicationId</code>s.",
    },
  },
  required: ["_environmentId", "items"],
};

export default {
  name: "Get Projects Environments Contexts",
  description: "Retrieves get projects environments contexts in LaunchDarkly",
  category: "Contexts",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, environmentKey, kind, key } =
          input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/environments/${environmentKey}/contexts/${kind}/${key}`;

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
