import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Templates
const inputSchema: Record<string, AppBlockConfigField> = {
  search: {
    name: "Search",
    description:
      "The substring in either the name or description of a template",
    type: "string",
    required: false,
  },
  summary: {
    name: "Summary",
    description:
      "Whether the entire template object or just a summary should be returned",
    type: "boolean",
    required: false,
  },
};

// Output schema for List Templates
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
          },
          _key: {
            type: "string",
          },
          name: {
            type: "string",
          },
          _creationDate: {
            type: "integer",
          },
          _ownerId: {
            type: "string",
          },
          _maintainerId: {
            type: "string",
          },
          _links: {
            type: "object",
            additionalProperties: true,
          },
          description: {
            type: "string",
          },
          stages: {
            type: "array",
            items: {
              type: "object",
              properties: {
                _id: {
                  type: "string",
                  description: "The ID of this stage",
                },
                name: {
                  type: "string",
                  description: "The stage name",
                },
                conditions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                      },
                      kind: {
                        type: "string",
                      },
                      _execution: {
                        type: "object",
                        properties: {
                          status: {
                            type: "string",
                            description:
                              "The status of the execution of this workflow stage",
                          },
                          stopDate: {
                            type: "integer",
                            description:
                              "Timestamp of when the workflow was completed.",
                          },
                        },
                        required: ["status"],
                      },
                      scheduleKind: {
                        type: "string",
                      },
                      waitDuration: {
                        type: "integer",
                      },
                      waitDurationUnit: {
                        type: "string",
                      },
                      description: {
                        type: "string",
                      },
                      notifyMemberIds: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                      },
                      allReviews: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            _id: {
                              type: "string",
                            },
                            kind: {
                              type: "string",
                            },
                            comment: {
                              type: "string",
                            },
                            memberId: {
                              type: "string",
                            },
                            serviceTokenId: {
                              type: "string",
                            },
                          },
                          required: ["_id", "kind"],
                        },
                      },
                      reviewStatus: {
                        type: "string",
                      },
                      creationConfig: {
                        type: "object",
                        additionalProperties: true,
                      },
                    },
                    required: [
                      "_id",
                      "_execution",
                      "description",
                      "notifyMemberIds",
                      "allReviews",
                      "reviewStatus",
                    ],
                  },
                  description: "An array of conditions for the stage",
                },
                action: {
                  type: "object",
                  properties: {
                    kind: {
                      type: "string",
                      description: "The type of action for this stage",
                    },
                    instructions: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                      },
                      description:
                        "An array of instructions for the stage. Each object in the array uses the semantic patch format for updating a feature flag.",
                    },
                  },
                  required: ["kind", "instructions"],
                  description:
                    "The type of instruction, and an array of instructions for the stage. Each object in the array uses the semantic patch format for updating a feature flag.",
                },
                _execution: {
                  type: "object",
                  required: [],
                  description: "Details on the execution of this stage",
                },
              },
              required: ["_id", "conditions", "action", "_execution"],
            },
          },
        },
        required: [
          "_id",
          "_key",
          "_creationDate",
          "_ownerId",
          "_maintainerId",
          "_links",
        ],
      },
    },
  },
  required: ["items"],
};

export default {
  name: "List Templates",
  description: "Retrieves list templates in LaunchDarkly",
  category: "Workflow templates",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const endpoint = `/api/v2/templates`;

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
