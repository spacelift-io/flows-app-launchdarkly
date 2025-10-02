import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Projects Context Kinds
const inputSchema: Record<string, AppBlockConfigField> = {
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
};

// Output schema for Get Projects Context Kinds
const outputSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: {
            type: "string",
            description: "The context kind key",
          },
          name: {
            type: "string",
            description: "The context kind name",
          },
          description: {
            type: "string",
            description: "The context kind description",
          },
          version: {
            type: "integer",
            description: "The context kind version",
          },
          creationDate: {
            type: "integer",
            description: "Timestamp of when the context kind was created",
          },
          lastModified: {
            type: "integer",
            description:
              "Timestamp of when the context kind was most recently changed",
          },
          lastSeen: {
            type: "integer",
            description:
              "Timestamp of when a context of this context kind was most recently evaluated",
          },
          createdFrom: {
            type: "string",
            enum: ["default", "auto-add", "manual"],
            description: "How the context kind was created",
          },
          hideInTargeting: {
            type: "boolean",
            description: "Alias for archived.",
          },
          archived: {
            type: "boolean",
            description:
              "Whether the context kind is archived. Archived context kinds are unavailable for targeting.",
          },
          _links: {
            type: "object",
            description: "The location and content type of related resources",
            additionalProperties: true,
          },
        },
        required: [
          "key",
          "name",
          "description",
          "version",
          "creationDate",
          "lastModified",
          "createdFrom",
        ],
      },
      description: "An array of context kinds",
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
  name: "Get Projects Context Kinds",
  description: "Retrieves get projects context kinds in LaunchDarkly",
  category: "Contexts",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/context-kinds`;

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
