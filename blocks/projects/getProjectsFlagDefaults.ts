import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Projects Flag Defaults
const inputSchema: Record<string, AppBlockConfigField> = {
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
};

// Output schema for Get Projects Flag Defaults
const outputSchema = {
  type: "object",
  properties: {
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    key: {
      type: "string",
      description: "A unique key for the flag default",
    },
    tags: {
      type: "array",
      items: {
        type: "string",
      },
      description: "A list of default tags for each flag",
    },
    temporary: {
      type: "boolean",
      description: "Whether the flag should be temporary by default",
    },
    defaultClientSideAvailability: {
      type: "object",
      properties: {
        usingMobileKey: {
          type: "boolean",
        },
        usingEnvironmentId: {
          type: "boolean",
        },
      },
      description:
        "Which client-side SDK types can use this flag by default. Set <code>usingMobileKey</code> to make the flag available for mobile SDKs. Set <code>usingEnvironmentId</code> to make the flag available for client-side SDKs.",
    },
    booleanDefaults: {
      type: "object",
      properties: {
        trueDisplayName: {
          type: "string",
          description:
            "The display name for the true variation, displayed in the LaunchDarkly user interface",
        },
        falseDisplayName: {
          type: "string",
          description:
            "The display name for the false variation, displayed in the LaunchDarkly user interface",
        },
        trueDescription: {
          type: "string",
          description: "The description for the true variation",
        },
        falseDescription: {
          type: "string",
          description: "The description for the false variation",
        },
        onVariation: {
          type: "integer",
          description:
            "The variation index of the flag variation to use for the default targeting behavior when a flag's targeting is on and the target did not match any rules",
        },
        offVariation: {
          type: "integer",
          description:
            "The variation index of the flag variation to use for the default targeting behavior when a flag's targeting is off",
        },
      },
      description: "Defaults for boolean flags within this project",
    },
  },
};

export default {
  name: "Get Projects Flag Defaults",
  description: "Retrieves get projects flag defaults in LaunchDarkly",
  category: "Projects",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/flag-defaults`;

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
