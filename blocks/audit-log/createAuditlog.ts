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

// Input schema for Create Auditlog
const inputSchema: Record<string, AppBlockConfigField> = {
  after: {
    name: "After",
    description:
      "A timestamp filter, expressed as a Unix epoch time in milliseconds. All entries returned occurred after the timestamp.",
    type: "number",
    required: false,
  },
  before: {
    name: "Before",
    description:
      "A timestamp filter, expressed as a Unix epoch time in milliseconds.  All entries returned occurred before the timestamp.",
    type: "number",
    required: false,
  },
  limit: {
    name: "Limit",
    description:
      "A limit on the number of audit log entries that return. Set between 1 and 20. The default is 10.",
    type: "number",
    required: false,
  },
  q: {
    name: "Q",
    description:
      "Text to search for. You can search for the full or partial name of the resource.",
    type: "string",
    required: false,
  },
};

// Output schema for Create Auditlog
const outputSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _links: {
            type: "object",
            description: "The location and content type of related resources",
            additionalProperties: true,
          },
          _id: {
            type: "string",
            description: "The ID of the audit log entry",
          },
          _accountId: {
            type: "string",
            description:
              "The ID of the account to which this audit log entry belongs",
          },
          date: {
            type: "integer",
            description: "Timestamp of the audit log entry",
          },
          accesses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                action: {
                  type: "string",
                },
                resource: {
                  type: "string",
                },
              },
            },
            description:
              "Details on the actions performed and resources acted on in this audit log entry",
          },
          kind: {
            type: "string",
            description: "The type of resource this audit log entry refers to",
          },
          name: {
            type: "string",
            description:
              "The name of the resource this audit log entry refers to",
          },
          description: {
            type: "string",
            description:
              "Description of the change recorded in the audit log entry",
          },
          shortDescription: {
            type: "string",
            description:
              "Shorter version of the change recorded in the audit log entry",
          },
          comment: {
            type: "string",
            description: "Optional comment for the audit log entry",
          },
          subject: {
            type: "object",
            properties: {
              _links: {
                type: "object",
                additionalProperties: true,
              },
              name: {
                type: "string",
                description: "The subject's name",
              },
              avatarUrl: {
                type: "string",
                description: "The subject's avatar",
              },
            },
            description:
              "Details of the subject who initiated the action described in the audit log entry",
          },
          member: {
            type: "object",
            properties: {
              _links: {
                type: "object",
                additionalProperties: true,
              },
              _id: {
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
            description:
              "Details of the member who initiated the action described in the audit log entry",
          },
          token: {
            type: "object",
            properties: {
              _links: {
                type: "object",
                additionalProperties: true,
              },
              _id: {
                type: "string",
              },
              name: {
                type: "string",
                description: "The name of the token",
              },
              ending: {
                type: "string",
                description: "The last few characters of the token",
              },
              serviceToken: {
                type: "boolean",
                description: "Whether this is a service token",
              },
            },
            description:
              "Details of the access token that initiated the action described in the audit log entry",
          },
          app: {
            type: "object",
            properties: {
              _links: {
                type: "object",
                additionalProperties: true,
              },
              _id: {
                type: "string",
                description: "The ID of the authorized application",
              },
              isScim: {
                type: "boolean",
                description:
                  "Whether the application is authorized through SCIM",
              },
              name: {
                type: "string",
                description: "The authorized application name",
              },
              maintainerName: {
                type: "string",
                description:
                  "The name of the maintainer for this authorized application",
              },
            },
            description:
              "Details of the authorized application that initiated the action described in the audit log entry",
          },
          titleVerb: {
            type: "string",
            description:
              "The action and resource recorded in this audit log entry",
          },
          target: {
            type: "object",
            properties: {
              _links: {
                type: "object",
                additionalProperties: true,
              },
              name: {
                type: "string",
                description: "The name of the resource",
              },
              resources: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "The resource specifier",
              },
            },
            description:
              "Details of the resource acted upon in this audit log entry",
          },
          parent: {
            type: "object",
            properties: {
              _links: {
                type: "object",
                additionalProperties: true,
              },
              name: {
                type: "string",
                description: "The name of the parent resource",
              },
              resource: {
                type: "string",
                description: "The parent's resource specifier",
              },
            },
          },
        },
        required: [
          "_links",
          "_id",
          "_accountId",
          "date",
          "accesses",
          "kind",
          "name",
          "description",
          "shortDescription",
        ],
      },
      description: "An array of audit log entries",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
  },
  required: ["items", "_links"],
};

export default {
  name: "Create Auditlog",
  description: "Creates create auditlog in LaunchDarkly",
  category: "Audit log",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const inputData = input.event.inputConfig;
        const endpoint = `/api/v2/auditlog`;

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
