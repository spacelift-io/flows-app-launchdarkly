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

// Input schema for Update Projects Environments Contexts Flags
const inputSchema: Record<string, AppBlockConfigField> = {
  contextKey: {
    name: "Context Key",
    description: "The context key",
    type: "string",
    required: true,
  },
  contextKind: {
    name: "Context Kind",
    description: "The context kind",
    type: "string",
    required: true,
  },
  environmentKey: {
    name: "Environment Key",
    description: "The environment key",
    type: "string",
    required: true,
  },
  featureFlagKey: {
    name: "Feature Flag Key",
    description: "The feature flag key",
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
    description: "Optional comment describing the change",
    type: "string",
    required: false,
  },
  setting: {
    name: "Setting",
    description:
      "The variation value to set for the context. Must match the flag's variation type.",
    type: {
      description:
        "The variation value to set for the context. Must match the flag's variation type.",
    },
    required: false,
  },
};

// Output schema for Update Projects Environments Contexts Flags
const outputSchema = {};

export default {
  name: "Update Projects Environments Contexts Flags",
  description:
    "Updates update projects environments contexts flags in LaunchDarkly",
  category: "Context settings",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const {
          projectKey,
          environmentKey,
          contextKind,
          contextKey,
          featureFlagKey,
          ...inputData
        } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/environments/${environmentKey}/contexts/${contextKind}/${contextKey}/flags/${featureFlagKey}`;

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
