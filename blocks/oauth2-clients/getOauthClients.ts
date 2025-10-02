import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Oauth Clients
const inputSchema: Record<string, AppBlockConfigField> = {};

// Output schema for Get Oauth Clients
const outputSchema = {
  type: "object",
  properties: {
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    items: {
      type: "array",
      items: {
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
            description:
              "The client secret. This will only be shown upon creation.",
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
      },
      description: "List of client objects",
    },
  },
  required: ["_links", "items"],
};

export default {
  name: "Get Oauth Clients",
  description: "Retrieves get oauth clients in LaunchDarkly",
  category: "OAuth2 Clients",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const endpoint = `/api/v2/oauth/clients`;

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
