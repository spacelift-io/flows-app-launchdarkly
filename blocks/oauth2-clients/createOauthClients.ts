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

// Input schema for Create Oauth Clients
const inputSchema: Record<string, AppBlockConfigField> = {
  description: {
    name: "Description",
    description: "Description of your OAuth 2.0 client.",
    type: "string",
    required: false,
  },
  name: {
    name: "Name",
    description: "The name of your new LaunchDarkly OAuth 2.0 client.",
    type: "string",
    required: false,
  },
  redirectUri: {
    name: "Redirect Uri",
    description:
      "The redirect URI for your new OAuth 2.0 application. This should be an absolute URL conforming with the standard HTTPS protocol.",
    type: "string",
    required: false,
  },
};

// Output schema for Create Oauth Clients
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
  name: "Create Oauth Clients",
  description: "Creates create oauth clients in LaunchDarkly",
  category: "OAuth2 Clients",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const inputData = input.event.inputConfig;
        const endpoint = `/api/v2/oauth/clients`;

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
