import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Public Ip List
const inputSchema: Record<string, AppBlockConfigField> = {};

// Output schema for List Public Ip List
const outputSchema = {
  type: "object",
  properties: {
    addresses: {
      type: "array",
      items: {
        type: "string",
      },
      description: "A list of the IP addresses LaunchDarkly's service uses",
    },
    outboundAddresses: {
      type: "array",
      items: {
        type: "string",
      },
      description:
        "A list of the IP addresses outgoing webhook notifications use",
    },
  },
  required: ["addresses", "outboundAddresses"],
};

export default {
  name: "List Public Ip List",
  description: "Retrieves list public ip list in LaunchDarkly",
  category: "Other",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const endpoint = `/api/v2/public-ip-list`;

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
