import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Auditlog2
const inputSchema: Record<string, AppBlockConfigField> = {
  id: {
    name: "Id",
    description: "The ID of the audit log entry",
    type: "string",
    required: true,
  },
};

// Output schema for List Auditlog2
const outputSchema = {
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
      description: "The name of the resource this audit log entry refers to",
    },
    description: {
      type: "string",
      description: "Description of the change recorded in the audit log entry",
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
          description: "Whether the application is authorized through SCIM",
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
      description: "The action and resource recorded in this audit log entry",
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
      description: "Details of the resource acted upon in this audit log entry",
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
    delta: {
      description:
        "If the audit log entry has been updated, this is the JSON patch body that was used in the request to update the entity",
    },
    triggerBody: {
      description:
        "A JSON representation of the external trigger for this audit log entry, if any",
    },
    merge: {
      description:
        "A JSON representation of the merge information for this audit log entry, if any",
    },
    previousVersion: {
      description:
        "If the audit log entry has been updated, this is a JSON representation of the previous version of the entity",
    },
    currentVersion: {
      description:
        "If the audit log entry has been updated, this is a JSON representation of the current version of the entity",
    },
    subentries: {
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
            description:
              "Details of the subject who initiated the action described in the audit log entry",
          },
          member: {
            type: "object",
            description:
              "Details of the member who initiated the action described in the audit log entry",
          },
          token: {
            type: "object",
            description:
              "Details of the access token that initiated the action described in the audit log entry",
          },
          app: {
            type: "object",
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
            description:
              "Details of the resource acted upon in this audit log entry",
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
};

export default {
  name: "List Auditlog2",
  description: "Retrieves list auditlog2 in LaunchDarkly",
  category: "Audit log",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { id } = input.event.inputConfig;
        const endpoint = `/api/v2/auditlog/${id}`;

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
