import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Projects Layers
const inputSchema: Record<string, AppBlockConfigField> = {
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
  filter: {
    name: "Filter",
    description:
      "A comma-separated list of filters. This endpoint only accepts filtering by `experimentKey`. The filter returns layers which include that experiment for the selected environment(s). For example: `filter=reservations.experimentKey contains expKey`.",
    type: "string",
    required: false,
  },
};

// Output schema for Get Projects Layers
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
            description: "The key of the layer",
          },
          name: {
            type: "string",
            description: "The name of the layer",
          },
          description: {
            type: "string",
            description: "The description of the layer",
          },
          createdAt: {
            type: "integer",
            description: "The date and time when the layer was created",
          },
          randomizationUnit: {
            type: "string",
            description: "The unit of randomization for the layer",
          },
          environments: {
            type: "object",
            description:
              "The layer configurations for each requested environment",
            additionalProperties: true,
          },
        },
        required: ["key", "name", "description", "createdAt"],
      },
      description: "The layers in the project",
    },
    totalCount: {
      type: "integer",
      description: "The total number of layers in the project",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
  },
  required: ["items", "totalCount", "_links"],
};

export default {
  name: "Get Projects Layers",
  description: "Retrieves get projects layers in LaunchDarkly",
  category: "Layers",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/layers`;

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
