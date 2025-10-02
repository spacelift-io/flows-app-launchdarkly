import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Projects Views Link
const inputSchema: Record<string, AppBlockConfigField> = {
  projectKey: {
    name: "Project Key",
    description: "",
    type: "string",
    required: true,
  },
  resourceType: {
    name: "Resource Type",
    description: "",
    type: "string",
    required: true,
  },
  viewKey: {
    name: "View Key",
    description: "",
    type: "string",
    required: true,
  },
};

// Output schema for Delete Projects Views Link
const outputSchema = {
  type: "object",
  properties: {
    successCount: {
      type: "integer",
      description: "The number of resources successfully unlinked.",
    },
    failureCount: {
      type: "integer",
      description: "The number of resources that failed to unlink.",
    },
    failedResources: {
      type: "array",
      items: {
        type: "object",
        properties: {
          resourceKey: {
            type: "string",
            description: "The key of the resource that failed to link.",
          },
          environmentId: {
            type: "string",
            description:
              "Environment ID of the resource (only present for segments)",
          },
          resourceType: {
            type: "string",
            enum: ["flag", "segment", "metric", "aiConfig"],
            description: "The type of the resource that failed to link.",
          },
          errorMessage: {
            type: "string",
            description: "The reason why linking this resource failed.",
          },
        },
        required: ["errorMessage", "resourceKey", "resourceType"],
      },
      description: "Details of resources that failed to unlink.",
    },
  },
  required: ["failureCount", "successCount"],
};

export default {
  name: "Delete Projects Views Link",
  description: "Deletes delete projects views link in LaunchDarkly",
  category: "Views",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, viewKey, resourceType } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/views/${viewKey}/link/${resourceType}`;

        const apiKey = input.app.config.apiKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        await events.emit(
          await makeLaunchDarklyApiRequest(apiKey, baseUrl, endpoint, {
            method: "DELETE",
          }),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
