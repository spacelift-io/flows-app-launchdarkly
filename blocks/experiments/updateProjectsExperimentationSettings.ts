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

// Input schema for Update Projects Experimentation Settings
const inputSchema: Record<string, AppBlockConfigField> = {
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
  randomizationUnits: {
    name: "Randomization Units",
    description: "An array of randomization units allowed for this project.",
    type: {
      type: "array",
      items: {
        type: "object",
        properties: {
          randomizationUnit: {
            type: "string",
            description:
              "The unit of randomization. Must match the key of an existing context kind in this project.",
          },
          standardRandomizationUnit: {
            type: "string",
            description:
              "(deprecated) This field is deprecated and will be removed. Use randomizationUnit instead.",
          },
        },
        required: ["randomizationUnit"],
      },
    },
    required: true,
  },
};

// Output schema for Update Projects Experimentation Settings
const outputSchema = {
  type: "object",
  properties: {
    _projectId: {
      type: "string",
      description: "The project ID",
    },
    _projectKey: {
      type: "string",
      description: "The project key",
    },
    randomizationUnits: {
      type: "array",
      items: {
        type: "object",
        properties: {
          randomizationUnit: {
            type: "string",
            description: "The unit of randomization. Defaults to user.",
          },
          _hidden: {
            type: "boolean",
          },
          _displayName: {
            type: "string",
            description:
              "The display name for the randomization unit, displayed in the LaunchDarkly user interface.",
          },
        },
      },
      description: "An array of the randomization units in this project",
    },
    _creationDate: {
      type: "integer",
      description: "Timestamp of when the experiment was created",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
  },
};

export default {
  name: "Update Projects Experimentation Settings",
  description:
    "Updates update projects experimentation settings in LaunchDarkly",
  category: "Experiments",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, ...inputData } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/experimentation-settings`;

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
