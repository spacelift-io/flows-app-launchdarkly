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

// Input schema for Update Projects Release Policies
const inputSchema: Record<string, AppBlockConfigField> = {
  name: {
    name: "Name",
    description: "The name of the release policy",
    type: "string",
    required: true,
  },
  policyKey: {
    name: "Policy Key",
    description: "The human-readable key of the release policy",
    type: "string",
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
  releaseMethod: {
    name: "Release Method",
    description: "The release method for this policy",
    type: "string",
    required: true,
  },
  guardedReleaseConfig: {
    name: "Guarded Release Config",
    description: "Configuration for guarded releases",
    type: {
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
    required: false,
  },
  progressiveReleaseConfig: {
    name: "Progressive Release Config",
    description: "Configuration for progressive releases",
    type: {
      type: "object",
    },
    required: false,
  },
  scope: {
    name: "Scope",
    description: "",
    type: {
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
    required: false,
  },
};

// Output schema for Update Projects Release Policies
const outputSchema = {
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
};

export default {
  name: "Update Projects Release Policies",
  description: "Updates update projects release policies in LaunchDarkly",
  category: "Release policies",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, policyKey, ...inputData } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/release-policies/${policyKey}`;

        const apiKey = input.app.config.apiKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        await events.emit(
          await makeLaunchDarklyApiRequest(apiKey, baseUrl, endpoint, {
            method: "PUT",
            body: filterDefinedParams(inputData),
          }),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
