import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Flags Dependent Flags
const inputSchema: Record<string, AppBlockConfigField> = {
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
};

// Output schema for Get Flags Dependent Flags
const outputSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The flag name",
          },
          key: {
            type: "string",
            description: "The flag key",
          },
          _links: {
            type: "object",
            description: "The location and content type of related resources",
            additionalProperties: true,
          },
          _site: {
            type: "object",
            description:
              "Details on how to access the dependent flag in the LaunchDarkly UI",
          },
        },
        required: ["key", "_links", "_site"],
      },
      description:
        "A list of dependent flags, which are flags that use the requested flag as a prerequisite",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    _site: {
      type: "object",
      description:
        "Details on how to access the prerequisite flag in the LaunchDarkly UI",
    },
  },
  required: ["items", "_links", "_site"],
};

export default {
  name: "Get Flags Dependent Flags",
  description: "Retrieves get flags dependent flags in LaunchDarkly",
  category: "Feature flags",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, environmentKey, featureFlagKey } =
          input.event.inputConfig;
        const endpoint = `/api/v2/flags/${projectKey}/${environmentKey}/${featureFlagKey}/dependent-flags`;

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
