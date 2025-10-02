import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Engineering Insights Flag Events
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
  after: {
    name: "After",
    description: "Identifier used for pagination",
    type: "string",
    required: false,
  },
  applicationKey: {
    name: "Application Key",
    description: "Comma separated list of application keys",
    type: "string",
    required: false,
  },
  before: {
    name: "Before",
    description: "Identifier used for pagination",
    type: "string",
    required: false,
  },
  expand: {
    name: "Expand",
    description: "Expand properties in response. Options: `experiments`",
    type: "string",
    required: false,
  },
  from: {
    name: "From",
    description: "Unix timestamp in milliseconds. Default value is 7 days ago.",
    type: "number",
    required: false,
  },
  global: {
    name: "Global",
    description:
      "Filter to include or exclude global events. Default value is `include`. Options: `include`, `exclude`",
    type: "string",
    required: false,
  },
  hasExperiments: {
    name: "Has Experiments",
    description:
      "Filter events to those associated with an experiment (`true`) or without an experiment (`false`)",
    type: "boolean",
    required: false,
  },
  impactSize: {
    name: "Impact Size",
    description:
      "Filter events by impact size. A small impact created a less than 20% change in the proportion of end users receiving one or more flag variations. A medium impact created between a 20%-80% change. A large impact created a more than 80% change. Options: `none`, `small`, `medium`, `large`",
    type: "string",
    required: false,
  },
  limit: {
    name: "Limit",
    description:
      "The number of deployments to return. Default is 20. Maximum allowed is 100.",
    type: "number",
    required: false,
  },
  query: {
    name: "Query",
    description: "Filter events by flag key",
    type: "string",
    required: false,
  },
  to: {
    name: "To",
    description: "Unix timestamp in milliseconds. Default value is now.",
    type: "number",
    required: false,
  },
};

// Output schema for Get Engineering Insights Flag Events
const outputSchema = {
  type: "object",
  properties: {
    totalCount: {
      type: "integer",
      description: "The total number of flag events",
    },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The flag event ID",
          },
          projectId: {
            type: "string",
            description: "The project ID",
          },
          projectKey: {
            type: "string",
            description: "The project key",
          },
          environmentId: {
            type: "string",
            description: "The environment ID",
          },
          environmentKey: {
            type: "string",
            description: "The environment key",
          },
          flagKey: {
            type: "string",
            description: "The flag key",
          },
          eventType: {
            type: "string",
            description: "The event type",
          },
          eventTime: {
            type: "integer",
            description: "A Unix timestamp in milliseconds",
          },
          description: {
            type: "string",
            description: "The event description",
          },
          auditLogEntryId: {
            type: "string",
            description: "The audit log entry ID",
          },
          member: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "The member ID",
              },
              email: {
                type: "string",
                description: "The member email",
              },
              firstName: {
                type: "string",
                description: "The member first name",
              },
              lastName: {
                type: "string",
                description: "The member last name",
              },
            },
            required: ["id", "email", "firstName", "lastName"],
            description: "The member data",
          },
          actions: {
            type: "array",
            items: {
              type: "string",
            },
            description: "The resource actions",
          },
          impact: {
            type: "object",
            properties: {
              size: {
                type: "string",
                enum: ["none", "small", "medium", "large"],
                description:
                  "The size of the flag event impact. Sizes are defined as: none (0%), small (0-20%), medium (20-80%), large (>80%)",
              },
              percentage: {
                type: "number",
                description: "The percentage of the flag event impact",
              },
              reason: {
                type: "string",
                enum: ["evaluations", "global", "waiting"],
                description: "The reason for the flag event impact",
              },
              evaluationsSummary: {
                type: "object",
                properties: {
                  variations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        value: {
                          description: "The variation value",
                        },
                        before: {
                          type: "integer",
                          description:
                            "The number of evaluations in the ten minutes before the flag event",
                        },
                        after: {
                          type: "integer",
                          description:
                            "The number of evaluations in the ten minutes after the flag event",
                        },
                      },
                    },
                    description: "A list of variation evaluations",
                  },
                },
                description:
                  "A summary of the change in variation evaluations after the flag event",
              },
            },
            description: "The flag event evaluation impact",
          },
          experiments: {
            type: "object",
            properties: {
              totalCount: {
                type: "integer",
                description: "The total number of experiments",
              },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    key: {
                      type: "string",
                      description: "The experiment key",
                    },
                    name: {
                      type: "string",
                      description: "The experiment name",
                    },
                    iteration: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          description: "The experiment iteration ID",
                        },
                        status: {
                          type: "string",
                          enum: ["running", "stopped"],
                          description: "The experiment iteration status",
                        },
                        startedAt: {
                          type: "integer",
                          description:
                            "Timestamp of when the iteration started",
                        },
                        endedAt: {
                          type: "integer",
                          description: "Timestamp of when the iteration ended",
                        },
                        _links: {
                          type: "object",
                          description:
                            "The location and content type of related resources",
                          additionalProperties: true,
                        },
                      },
                      required: ["id", "status", "startedAt"],
                      description: "The experiment iteration",
                    },
                    _links: {
                      type: "object",
                      description:
                        "The location and content type of related resources",
                      additionalProperties: true,
                    },
                  },
                  required: ["key", "name", "iteration"],
                },
                description: "A list of experiments",
              },
            },
            required: ["totalCount", "items"],
            description:
              "A list of experiment iterations related to the flag event",
          },
        },
        required: [
          "id",
          "projectId",
          "projectKey",
          "flagKey",
          "eventType",
          "eventTime",
          "description",
          "impact",
        ],
      },
      description: "A list of flag events",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
  },
  required: ["totalCount", "items"],
};

export default {
  name: "Get Engineering Insights Flag Events",
  description: "Retrieves get engineering insights flag events in LaunchDarkly",
  category: "Insights flag events",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const endpoint = `/api/v2/engineering-insights/flag-events`;

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
