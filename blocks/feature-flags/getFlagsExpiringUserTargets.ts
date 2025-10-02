import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Flags Expiring User Targets
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
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
};

// Output schema for Get Flags Expiring User Targets
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
            description: "The ID of this expiring user target",
          },
          _version: {
            type: "integer",
            description: "The version of this expiring user target",
          },
          expirationDate: {
            type: "integer",
            description: "A timestamp for when the user target expires",
          },
          userKey: {
            type: "string",
            description: "A unique key used to represent the user",
          },
          targetType: {
            type: "string",
            description:
              "A segment's target type. Included when expiring user targets are updated on a segment.",
          },
          variationId: {
            type: "string",
            description:
              "A unique key used to represent the flag variation. Included when expiring user targets are updated on a feature flag.",
          },
          _resourceId: {
            type: "object",
            properties: {
              kind: {
                type: "string",
              },
              projectKey: {
                type: "string",
              },
              environmentKey: {
                type: "string",
              },
              flagKey: {
                type: "string",
              },
              key: {
                type: "string",
              },
            },
            description:
              "Details on the resource from which the user is expiring",
          },
        },
        required: [
          "_id",
          "_version",
          "expirationDate",
          "userKey",
          "_resourceId",
        ],
      },
      description: "An array of expiring user targets",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
  },
  required: ["items"],
};

export default {
  name: "Get Flags Expiring User Targets",
  description: "Retrieves get flags expiring user targets in LaunchDarkly",
  category: "Feature flags",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, featureFlagKey, environmentKey } =
          input.event.inputConfig;
        const endpoint = `/api/v2/flags/${projectKey}/${featureFlagKey}/expiring-user-targets/${environmentKey}`;

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
