import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Segments Expiring Targets
const inputSchema: Record<string, AppBlockConfigField> = {
  environmentKey: {
    name: "Environment Key",
    description: "The environment key",
    type: "string",
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
};

// Output schema for Get Segments Expiring Targets
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
      description: "A list of expiring targets",
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
  name: "Get Segments Expiring Targets",
  description: "Retrieves get segments expiring targets in LaunchDarkly",
  category: "Segments",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, segmentKey, environmentKey } =
          input.event.inputConfig;
        const endpoint = `/api/v2/segments/${projectKey}/${segmentKey}/expiring-targets/${environmentKey}`;

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
