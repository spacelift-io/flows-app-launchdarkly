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

// Input schema for Create Flags Triggers
const inputSchema: Record<string, AppBlockConfigField> = {
  environmentKey: {
    name: "Environment Key",
    description: "The environment key",
    type: "string",
    required: true,
  },
  featureFlagKey: {
    name: "Feature Flag Key",
    description: "The feature flag key",
    type: "string",
    required: true,
  },
  integrationKey: {
    name: "Integration Key",
    description:
      "The unique identifier of the integration for your trigger. Use <code>generic-trigger</code> for integrations not explicitly supported.",
    type: "string",
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
  comment: {
    name: "Comment",
    description: "Optional comment describing the trigger",
    type: "string",
    required: false,
  },
  instructions: {
    name: "Instructions",
    description:
      'The action to perform when triggering. This should be an array with a single object that looks like <code>{"kind": "flag_action"}</code>. Supported flag actions are <code>turnFlagOn</code> and <code>turnFlagOff</code>.',
    type: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: true,
      },
    },
    required: false,
  },
};

// Output schema for Create Flags Triggers
const outputSchema = {
  type: "object",
  properties: {
    _id: {
      type: "string",
      description: "The ID of this flag trigger",
    },
    _version: {
      type: "integer",
      description: "The flag trigger version",
    },
    _creationDate: {
      type: "integer",
      description: "Timestamp of when the flag trigger was created",
    },
    _maintainerId: {
      type: "string",
      description: "The ID of the flag trigger maintainer",
    },
    _maintainer: {
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
      },
      required: ["_links", "_id", "role", "email"],
      description: "Details on the member who maintains this flag trigger",
    },
    enabled: {
      type: "boolean",
      description: "Whether the flag trigger is currently enabled",
    },
    _integrationKey: {
      type: "string",
      description: "The unique identifier of the integration for your trigger",
    },
    instructions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: true,
      },
      description: "Details on the action to perform when triggering",
    },
    _lastTriggeredAt: {
      type: "integer",
      description: "Timestamp of when the trigger was most recently executed",
    },
    _recentTriggerBodies: {
      type: "array",
      items: {
        type: "object",
        properties: {
          timestamp: {
            type: "integer",
            description: "Timestamp of the incoming trigger webhook",
          },
          jsonBody: {
            type: "object",
            description:
              "The marshalled JSON request body for the incoming trigger webhook. If this is empty or contains invalid JSON, the timestamp is recorded but this field will be empty.",
            additionalProperties: true,
          },
        },
      },
      description: "Details on recent flag trigger requests.",
    },
    _triggerCount: {
      type: "integer",
      description: "Number of times the trigger has been executed",
    },
    triggerURL: {
      type: "string",
      description: "The unguessable URL for this flag trigger",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
  },
};

export default {
  name: "Create Flags Triggers",
  description: "Creates create flags triggers in LaunchDarkly",
  category: "Flag triggers",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, featureFlagKey, environmentKey, ...inputData } =
          input.event.inputConfig;
        const endpoint = `/api/v2/flags/${projectKey}/${featureFlagKey}/triggers/${environmentKey}`;

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
