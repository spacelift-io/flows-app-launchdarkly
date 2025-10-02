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

// Input schema for Update Members2
const inputSchema: Record<string, AppBlockConfigField> = {
  id: {
    name: "Id",
    description: "The member ID",
    type: "string",
    required: true,
  },
};

// Output schema for Update Members2
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
    _pendingInvite: {
      type: "boolean",
      description: "Whether the member has a pending invitation",
    },
    _verified: {
      type: "boolean",
      description: "Whether the member's email address has been verified",
    },
    _pendingEmail: {
      type: "string",
      description:
        "The member's email address before it has been verified, for accounts where email verification is required",
    },
    customRoles: {
      type: "array",
      items: {
        type: "string",
      },
      description:
        "The set of additional roles, besides the base role, assigned to the member",
    },
    mfa: {
      type: "string",
      description:
        "Whether multi-factor authentication is enabled for this member",
    },
    excludedDashboards: {
      type: "array",
      items: {
        type: "string",
      },
      description: "Default dashboards that the member has chosen to ignore",
    },
    _lastSeen: {
      type: "integer",
      description:
        "The member's last session date (as Unix milliseconds since epoch)",
    },
    _lastSeenMetadata: {
      type: "object",
      properties: {
        tokenId: {
          type: "string",
          description: "The ID of the token used in the member's last session",
        },
      },
      description:
        "Additional metadata associated with the member's last session, for example, whether a token was used",
    },
    _integrationMetadata: {
      type: "object",
      properties: {
        externalId: {
          type: "string",
        },
        externalStatus: {
          type: "object",
          properties: {
            display: {
              type: "string",
            },
            value: {
              type: "string",
            },
          },
          required: ["display", "value"],
        },
        externalUrl: {
          type: "string",
        },
        lastChecked: {
          type: "integer",
        },
      },
      required: ["externalId", "externalStatus", "externalUrl", "lastChecked"],
      description:
        "Details on the member account in an external source, if this member is provisioned externally",
    },
    teams: {
      type: "array",
      items: {
        type: "object",
        properties: {
          customRoleKeys: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of keys of the custom roles this team has access to",
          },
          key: {
            type: "string",
            description: "The team key",
          },
          _links: {
            type: "object",
            additionalProperties: true,
          },
          name: {
            type: "string",
            description: "The team name",
          },
        },
        required: ["customRoleKeys", "key", "name"],
      },
      description: "Details on the teams this member is assigned to",
    },
    permissionGrants: {
      type: "array",
      items: {
        type: "object",
        properties: {
          actionSet: {
            type: "string",
            description:
              "The name of the group of related actions to allow. A permission grant may have either an <code>actionSet</code> or a list of <code>actions</code> but not both at the same time.",
          },
          actions: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of actions to allow. A permission grant may have either an <code>actionSet</code> or a list of <code>actions</code> but not both at the same time.",
          },
          resource: {
            type: "string",
            description: "The resource for which the actions are allowed",
          },
        },
        required: ["resource"],
      },
      description:
        "A list of permission grants. Permission grants allow a member to have access to a specific action, without having to create or update a custom role.",
    },
    creationDate: {
      type: "integer",
      description: "Timestamp of when the member was created",
    },
    oauthProviders: {
      type: "array",
      items: {
        type: "string",
      },
      description: "A list of OAuth providers",
    },
    version: {
      type: "integer",
      description: "Version of the current configuration",
    },
    roleAttributes: {
      type: "object",
      description: "The role attributes for the member",
      additionalProperties: true,
    },
  },
  required: [
    "_links",
    "_id",
    "role",
    "email",
    "_pendingInvite",
    "_verified",
    "customRoles",
    "mfa",
    "_lastSeen",
    "creationDate",
  ],
};

export default {
  name: "Update Members2",
  description: "Updates update members2 in LaunchDarkly",
  category: "Account members",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { id, ...inputData } = input.event.inputConfig;
        const endpoint = `/api/v2/members/${id}`;

        const apiKey = input.app.config.apiKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        await events.emit(
          await makeLaunchDarklyApiRequest(apiKey, baseUrl, endpoint, {
            method: "PATCH",
            body: filterDefinedParams(inputData),
          }),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
