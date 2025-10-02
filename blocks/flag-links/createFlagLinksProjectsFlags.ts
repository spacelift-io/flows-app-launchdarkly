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

// Input schema for Create Flag Links Projects Flags
const inputSchema: Record<string, AppBlockConfigField> = {
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
  deepLink: {
    name: "Deep Link",
    description:
      "The URL for the external resource you are linking the flag to",
    type: "string",
    required: false,
  },
  description: {
    name: "Description",
    description: "The description of the flag link",
    type: "string",
    required: false,
  },
  integrationKey: {
    name: "Integration Key",
    description:
      "The integration key for an integration whose <code>manifest.json</code> includes the <code>flagLink</code> capability, if this is a flag link for an existing integration. Do not include for URL flag links.",
    type: "string",
    required: false,
  },
  key: {
    name: "Key",
    description: "The flag link key",
    type: "string",
    required: false,
  },
  metadata: {
    name: "Metadata",
    description:
      "The metadata required by this integration in order to create a flag link, if this is a flag link for an existing integration. Defined in the integration's <code>manifest.json</code> file under <code>flagLink</code>.",
    type: {
      type: "object",
    },
    required: false,
  },
  timestamp: {
    name: "Timestamp",
    description:
      "The time, in Unix milliseconds, to mark this flag link as associated with the external URL. If omitted, defaults to the creation time of this flag link.",
    type: "number",
    required: false,
  },
};

// Output schema for Create Flag Links Projects Flags
const outputSchema = {
  type: "object",
  properties: {
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    _key: {
      type: "string",
      description: "The flag link key",
    },
    _integrationKey: {
      type: "string",
      description:
        "The integration key for an integration whose <code>manifest.json</code> includes the <code>flagLink</code> capability, if this is a flag link for an existing integration",
    },
    _id: {
      type: "string",
      description: "The ID of this flag link",
    },
    _deepLink: {
      type: "string",
      description: "The URL for the external resource the flag is linked to",
    },
    _timestamp: {
      type: "object",
      properties: {
        milliseconds: {
          type: "integer",
        },
        seconds: {
          type: "integer",
        },
        rfc3339: {
          type: "string",
        },
        simple: {
          type: "string",
        },
      },
      description:
        "The time to mark this flag link as associated with the external URL. Defaults to the creation time of the flag link, but can be set to another time during creation.",
    },
    description: {
      type: "string",
      description: "The description of the flag link",
    },
    _metadata: {
      type: "object",
      description:
        "The metadata required by this integration in order to create a flag link, if this is a flag link for an existing integration. Defined in the integration's <code>manifest.json</code> file under <code>flagLink</code>.",
      additionalProperties: {
        type: "string",
      },
    },
    _createdAt: {
      type: "integer",
      description: "Timestamp of when the flag link was created",
    },
    _member: {
      type: "object",
      properties: {
        _links: {
          type: "object",
          additionalProperties: true,
        },
        _id: {
          type: "string",
        },
        firstName: {
          type: "string",
        },
        lastName: {
          type: "string",
        },
      },
      required: ["_links", "_id"],
      description: "Details on the member associated with this flag link",
    },
  },
  required: ["_links", "_id", "_deepLink", "_timestamp", "_createdAt"],
};

export default {
  name: "Create Flag Links Projects Flags",
  description: "Creates create flag links projects flags in LaunchDarkly",
  category: "Flag links",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, featureFlagKey, ...inputData } =
          input.event.inputConfig;
        const endpoint = `/api/v2/flag-links/projects/${projectKey}/flags/${featureFlagKey}`;

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
