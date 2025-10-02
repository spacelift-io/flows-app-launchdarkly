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

// Input schema for Update Segments Expiring User Targets
const inputSchema: Record<string, AppBlockConfigField> = {
  environmentKey: {
    name: "Environment Key",
    description: "The environment key",
    type: "string",
    required: true,
  },
  instructions: {
    name: "Instructions",
    description:
      "Semantic patch instructions for the desired changes to the resource",
    type: {
      type: "array",
      items: {
        type: "object",
        properties: {
          kind: {
            type: "string",
            enum: [
              "addExpireUserTargetDate",
              "updateExpireUserTargetDate",
              "removeExpireUserTargetDate",
            ],
            description:
              "The type of change to make to the user's removal date from this segment",
          },
          userKey: {
            type: "string",
            description: "A unique key used to represent the user",
          },
          targetType: {
            type: "string",
            enum: ["included", "excluded"],
            description: "The segment's target type",
          },
          value: {
            type: "integer",
            description:
              "The time, in Unix milliseconds, when the user should be removed from this segment. Required if <code>kind</code> is <code>addExpireUserTargetDate</code> or <code>updateExpireUserTargetDate</code>.",
          },
          version: {
            type: "integer",
            description:
              "The version of the segment to update. Required if <code>kind</code> is <code>updateExpireUserTargetDate</code>.",
          },
        },
        required: ["kind", "userKey", "targetType"],
      },
    },
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
  segmentKey: {
    name: "Segment Key",
    description: "The segment key",
    type: "string",
    required: true,
  },
  comment: {
    name: "Comment",
    description: "Optional description of changes",
    type: "string",
    required: false,
  },
};

// Output schema for Update Segments Expiring User Targets
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
    totalInstructions: {
      type: "integer",
      description: "The total count of instructions sent in the PATCH request",
    },
    successfulInstructions: {
      type: "integer",
      description:
        "The total count of successful instructions sent in the PATCH request",
    },
    failedInstructions: {
      type: "integer",
      description:
        "The total count of the failed instructions sent in the PATCH request",
    },
    errors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          instructionIndex: {
            type: "integer",
            description:
              "The index of the PATCH instruction where the error occurred",
          },
          message: {
            type: "string",
            description:
              "The error message related to a failed PATCH instruction",
          },
        },
        required: ["instructionIndex", "message"],
      },
      description: "An array of error messages for the failed instructions",
    },
  },
  required: ["items"],
};

export default {
  name: "Update Segments Expiring User Targets",
  description: "Updates update segments expiring user targets in LaunchDarkly",
  category: "Segments",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, segmentKey, environmentKey, ...inputData } =
          input.event.inputConfig;
        const endpoint = `/api/v2/segments/${projectKey}/${segmentKey}/expiring-user-targets/${environmentKey}`;

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
