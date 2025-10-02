import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Versions
const inputSchema: Record<string, AppBlockConfigField> = {};

// Output schema for List Versions
const outputSchema = {
  type: "object",
  properties: {
    validVersions: {
      type: "array",
      items: {
        type: "integer",
      },
      description:
        "A list of all valid API versions. To learn more about our versioning, read [Versioning](https://launchdarkly.com/docs/api#versioning).",
    },
    latestVersion: {
      type: "integer",
      description: "The most recently released version of the API",
    },
    currentVersion: {
      type: "integer",
      description:
        "The version of the API currently in use. Typically this is the API version specified for your access token. If you add the <code>LD-API-Version: beta</code> header to your request, this will be equal to the <code>latestVersion</code>.",
    },
    beta: {
      type: "boolean",
      description:
        "Whether the version of the API currently is use is a beta version. This is always <code>true</code> if you add the <code>LD-API-Version: beta</code> header to your request.",
    },
  },
  required: ["validVersions", "latestVersion", "currentVersion"],
};

export default {
  name: "List Versions",
  description: "Retrieves list versions in LaunchDarkly",
  category: "Other",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const endpoint = `/api/v2/versions`;

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
