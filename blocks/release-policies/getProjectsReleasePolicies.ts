import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Projects Release Policies
const inputSchema: Record<string, AppBlockConfigField> = {
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
  environmentKey: {
    name: "Environment Key",
    description: "Filter by environment key",
    type: "string",
    required: false,
  },
  excludeDefault: {
    name: "Exclude Default",
    description:
      "When true, exclude the default release policy from the response. When false or omitted, include the default policy if an environment filter is present.",
    type: "boolean",
    required: false,
  },
};

// Output schema for Get Projects Release Policies
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
            description: "The unique identifier of the release policy",
          },
          scope: {
            type: "object",
            properties: {
              environmentKeys: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "List of environment keys this policy applies to",
              },
            },
          },
          rank: {
            type: "integer",
            description: "The rank/priority of the release policy",
          },
          releaseMethod: {
            type: "string",
            enum: ["guarded-release", "progressive-release"],
            description: "The release method for this policy",
          },
          guardedReleaseConfig: {
            type: "object",
            properties: {
              minSampleSize: {
                type: "integer",
                description:
                  "The minimum number of samples required to make a decision",
              },
              rollbackOnRegression: {
                type: "boolean",
                description: "Whether to roll back on regression",
              },
            },
            required: ["rollbackOnRegression"],
            description: "Configuration for guarded releases",
          },
          progressiveReleaseConfig: {
            type: "object",
            description: "Configuration for progressive releases",
          },
          name: {
            type: "string",
            description: "The name of the release policy",
          },
          key: {
            type: "string",
            description: "The human-readable key of the release policy",
          },
        },
        required: ["_id", "key", "name", "rank", "releaseMethod"],
      },
      description: "List of release policies",
    },
    totalCount: {
      type: "integer",
      description: "Total number of release policies",
    },
  },
  required: ["items", "totalCount"],
};

export default {
  name: "Get Projects Release Policies",
  description: "Retrieves get projects release policies in LaunchDarkly",
  category: "Release policies",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/release-policies`;

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
