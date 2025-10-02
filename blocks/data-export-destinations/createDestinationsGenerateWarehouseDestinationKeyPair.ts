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

// Input schema for Create Destinations Generate Warehouse Destination Key Pair
const inputSchema: Record<string, AppBlockConfigField> = {};

// Output schema for Create Destinations Generate Warehouse Destination Key Pair
const outputSchema = {
  type: "object",
  properties: {
    public_key: {
      type: "string",
      description: "The public key used by LaunchDarkly",
    },
    public_key_pkcs8: {
      type: "string",
      description: "The public key to assign in your Snowflake worksheet",
    },
  },
};

export default {
  name: "Create Destinations Generate Warehouse Destination Key Pair",
  description:
    "Creates create destinations generate warehouse destination key pair in LaunchDarkly",
  category: "Data Export destinations",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const inputData = input.event.inputConfig;
        const endpoint = `/api/v2/destinations/generate-warehouse-destination-key-pair`;

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
