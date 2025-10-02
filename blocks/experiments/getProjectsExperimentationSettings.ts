import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Projects Experimentation Settings
const inputSchema: Record<string, AppBlockConfigField> = {
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
};

// Output schema for Get Projects Experimentation Settings
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
  name: "Get Projects Experimentation Settings",
  description:
    "Retrieves get projects experimentation settings in LaunchDarkly",
  category: "Experiments",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/experimentation-settings`;

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
