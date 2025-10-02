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

// Input schema for Create Projects Layers
const inputSchema: Record<string, AppBlockConfigField> = {
  description: {
    name: "Description",
    description: "The checkout flow for the application",
    type: "string",
    required: true,
  },
  key: {
    name: "Key",
    description: "Unique identifier for the layer",
    type: "string",
    required: true,
  },
  name: {
    name: "Name",
    description: "Layer name",
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

// Output schema for Create Projects Layers
const outputSchema = {
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
      description: "The layer configurations for each requested environment",
      additionalProperties: true,
    },
  },
  required: ["key", "name", "description", "createdAt"],
};

export default {
  name: "Create Projects Layers",
  description: "Creates create projects layers in LaunchDarkly",
  category: "Layers",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, ...inputData } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/layers`;

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
