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

// Input schema for Update Projects Layers
const inputSchema: Record<string, AppBlockConfigField> = {
  instructions: {
    name: "Instructions",
    description:
      'The instructions to perform when updating. This should be an array with objects that look like <code>{"kind": "update_action"}</code>. Some instructions also require a <code>value</code> field in the array element.',
    type: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: true,
      },
    },
    required: true,
  },
  layerKey: {
    name: "Layer Key",
    description: "The layer key",
    type: "string",
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
  comment: {
    name: "Comment",
    description: "Optional comment describing the update",
    type: "string",
    required: false,
  },
  environmentKey: {
    name: "Environment Key",
    description:
      "The environment key used for making environment specific updates. For example, updating the reservation of an experiment",
    type: "string",
    required: false,
  },
};

// Output schema for Update Projects Layers
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
  name: "Update Projects Layers",
  description: "Updates update projects layers in LaunchDarkly",
  category: "Layers",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, layerKey, ...inputData } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/layers/${layerKey}`;

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
