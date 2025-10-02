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

// Input schema for Create Segments Contexts
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
  excluded: {
    name: "Excluded",
    description: "",
    type: {},
    required: false,
  },
  included: {
    name: "Included",
    description: "",
    type: {
      type: "object",
      properties: {
        add: {
          type: "array",
          items: {
            type: "string",
          },
        },
        remove: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
    },
    required: false,
  },
};

// Output schema for Create Segments Contexts
const outputSchema = {};

export default {
  name: "Create Segments Contexts",
  description: "Creates create segments contexts in LaunchDarkly",
  category: "Segments",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, environmentKey, segmentKey, ...inputData } =
          input.event.inputConfig;
        const endpoint = `/api/v2/segments/${projectKey}/${environmentKey}/${segmentKey}/contexts`;

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
