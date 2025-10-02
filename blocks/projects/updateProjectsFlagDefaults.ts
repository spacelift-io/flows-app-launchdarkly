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

// Input schema for Update Projects Flag Defaults
const inputSchema: Record<string, AppBlockConfigField> = {
  booleanDefaults: {
    name: "Boolean Defaults",
    description: "",
    type: {
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
      required: [
        "trueDisplayName",
        "falseDisplayName",
        "trueDescription",
        "falseDescription",
        "onVariation",
        "offVariation",
      ],
    },
    required: true,
  },
  defaultClientSideAvailability: {
    name: "Default Client Side Availability",
    description: "Which client-side SDK types can use this flag by default.",
    type: {
      type: "object",
      properties: {
        usingMobileKey: {
          type: "boolean",
          description: "Whether to enable availability for mobile SDKs",
        },
        usingEnvironmentId: {
          type: "boolean",
          description: "Whether to enable availability for client-side SDKs",
        },
      },
      required: ["usingMobileKey", "usingEnvironmentId"],
      description: "Which client-side SDK types can use this flag by default.",
    },
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
  tags: {
    name: "Tags",
    description: "A list of default tags for each flag",
    type: ["string"],
    required: true,
  },
  temporary: {
    name: "Temporary",
    description: "Whether the flag should be temporary by default",
    type: "boolean",
    required: true,
  },
};

// Output schema for Update Projects Flag Defaults
const outputSchema = {
  type: "object",
  properties: {
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
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
      required: [
        "trueDisplayName",
        "falseDisplayName",
        "trueDescription",
        "falseDescription",
        "onVariation",
        "offVariation",
      ],
    },
    defaultClientSideAvailability: {
      type: "object",
      properties: {
        usingMobileKey: {
          type: "boolean",
          description: "Whether to enable availability for mobile SDKs",
        },
        usingEnvironmentId: {
          type: "boolean",
          description: "Whether to enable availability for client-side SDKs",
        },
      },
      required: ["usingMobileKey", "usingEnvironmentId"],
      description: "Which client-side SDK types can use this flag by default.",
    },
  },
  required: [
    "tags",
    "temporary",
    "booleanDefaults",
    "defaultClientSideAvailability",
  ],
};

export default {
  name: "Update Projects Flag Defaults",
  description: "Updates update projects flag defaults in LaunchDarkly",
  category: "Projects",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, ...inputData } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/flag-defaults`;

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
