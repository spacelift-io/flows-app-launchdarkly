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

// Input schema for Update Projects Context Kinds
const inputSchema: Record<string, AppBlockConfigField> = {
  key: {
    name: "Key",
    description: "The context kind key",
    type: "string",
    required: true,
  },
  name: {
    name: "Name",
    description: "The context kind name",
    type: "string",
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
  archived: {
    name: "Archived",
    description:
      "Whether the context kind is archived. Archived context kinds are unavailable for targeting.",
    type: "boolean",
    required: false,
  },
  description: {
    name: "Description",
    description: "The context kind description",
    type: "string",
    required: false,
  },
  hideInTargeting: {
    name: "Hide In Targeting",
    description: "Alias for archived.",
    type: "boolean",
    required: false,
  },
  version: {
    name: "Version",
    description:
      "The context kind version. If not specified when the context kind is created, defaults to 1.",
    type: "number",
    required: false,
  },
};

// Output schema for Update Projects Context Kinds
const outputSchema = {
  type: "object",
  properties: {
    status: {
      type: "string",
      description: "The status of the create or update operation",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
  },
};

export default {
  name: "Update Projects Context Kinds",
  description: "Updates update projects context kinds in LaunchDarkly",
  category: "Contexts",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, key, ...inputData } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/context-kinds/${key}`;

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
