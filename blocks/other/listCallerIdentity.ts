import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Caller Identity
const inputSchema: Record<string, AppBlockConfigField> = {};

// Output schema for List Caller Identity
const outputSchema = {
  type: "object",
  properties: {
    accountId: {
      type: "string",
    },
    environmentId: {
      type: "string",
    },
    projectId: {
      type: "string",
    },
    environmentName: {
      type: "string",
    },
    projectName: {
      type: "string",
    },
    authKind: {
      type: "string",
    },
    tokenKind: {
      type: "string",
    },
    clientId: {
      type: "string",
    },
    tokenName: {
      type: "string",
    },
    tokenId: {
      type: "string",
    },
    memberId: {
      type: "string",
    },
    serviceToken: {
      type: "boolean",
    },
  },
};

export default {
  name: "List Caller Identity",
  description: "Retrieves list caller identity in LaunchDarkly",
  category: "Other",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const endpoint = `/api/v2/caller-identity`;

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
