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

// Input schema for Update Segments Expiring Targets
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
              "addExpiringTarget",
              "updateExpiringTarget",
              "removeExpiringTarget",
            ],
            description:
              "The type of change to make to the context's removal date from this segment",
          },
          contextKey: {
            type: "string",
            description: "A unique key used to represent the context",
          },
          contextKind: {
            type: "string",
            description: "The kind of context",
          },
          targetType: {
            type: "string",
            enum: ["included", "excluded"],
            description: "The segment's target type",
          },
          value: {
            type: "integer",
            description:
              "The time, in Unix milliseconds, when the context should be removed from this segment. Required if <code>kind</code> is <code>addExpiringTarget</code> or <code>updateExpiringTarget</code>.",
          },
          version: {
            type: "integer",
            description:
              "The version of the expiring target to update. Optional and only used if <code>kind</code> is <code>updateExpiringTarget</code>. If included, update will fail if version doesn't match current version of the expiring target.",
          },
        },
        required: ["kind", "contextKey", "contextKind", "targetType"],
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

// Output schema for Update Segments Expiring Targets
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
            description: "The ID of this expiring target",
          },
          _version: {
            type: "integer",
            description: "The version of this expiring target",
          },
          expirationDate: {
            type: "integer",
            description: "A timestamp for when the target expires",
          },
          contextKind: {
            type: "string",
            description: "The context kind of the context to be removed",
          },
          contextKey: {
            type: "string",
            description:
              "A unique key used to represent the context to be removed",
          },
          targetType: {
            type: "string",
            description:
              "A segment's target type, <code>included</code> or <code>excluded</code>. Included when expiring targets are updated on a segment.",
          },
          variationId: {
            type: "string",
            description:
              "A unique ID used to represent the flag variation. Included when expiring targets are updated on a feature flag.",
          },
          _resourceId: {
            type: "object",
            properties: {
              environmentKey: {
                type: "string",
                description: "The environment key",
              },
              flagKey: {
                type: "string",
                description: "Deprecated, use <code>key</code> instead",
              },
              key: {
                type: "string",
                description: "The key of the flag or segment",
              },
              kind: {
                type: "string",
                description:
                  "The type of resource, <code>flag</code> or <code>segment</code>",
              },
              projectKey: {
                type: "string",
                description: "The project key",
              },
            },
            description:
              "Details on the segment or flag this expiring target belongs to, its environment, and its project",
          },
        },
        required: [
          "_id",
          "_version",
          "expirationDate",
          "contextKind",
          "contextKey",
          "_resourceId",
        ],
      },
      description: "A list of the results from each instruction",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    totalInstructions: {
      type: "integer",
    },
    successfulInstructions: {
      type: "integer",
    },
    failedInstructions: {
      type: "integer",
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
    },
  },
  required: ["items"],
};

export default {
  name: "Update Segments Expiring Targets",
  description: "Updates update segments expiring targets in LaunchDarkly",
  category: "Segments",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, segmentKey, environmentKey, ...inputData } =
          input.event.inputConfig;
        const endpoint = `/api/v2/segments/${projectKey}/${segmentKey}/expiring-targets/${environmentKey}`;

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
