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

// Input schema for Update Oauth Clients
const inputSchema: Record<string, AppBlockConfigField> = {
  clientId: {
    name: "Client Id",
    description: "The client ID",
    type: "string",
    required: true,
  },
};

// Output schema for Update Oauth Clients
const outputSchema = {
  type: "object",
  properties: {
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    name: {
      type: "string",
      description: "Client name",
    },
    description: {
      type: "string",
      description: "Client description",
    },
    _accountId: {
      type: "string",
      description: "The account ID the client is registered under",
    },
    _clientId: {
      type: "string",
      description: "The client's unique ID",
    },
    _clientSecret: {
      type: "string",
      description: "The client secret. This will only be shown upon creation.",
    },
    redirectUri: {
      type: "string",
      description: "The client's redirect URI",
    },
    _creationDate: {
      type: "integer",
      description: "Timestamp of client creation date",
    },
  },
  required: [
    "_links",
    "name",
    "_accountId",
    "_clientId",
    "redirectUri",
    "_creationDate",
  ],
};

export default {
  name: "Update Oauth Clients",
  description: "Updates update oauth clients in LaunchDarkly",
  category: "OAuth2 Clients",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { clientId, ...inputData } = input.event.inputConfig;
        const endpoint = `/api/v2/oauth/clients/${clientId}`;

        const apiKey = input.app.config.apiKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        await events.emit(
          await makeLaunchDarklyApiRequest(apiKey, baseUrl, endpoint, {
            method: "PATCH",
            body: filterDefinedParams(inputData),
          }),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
