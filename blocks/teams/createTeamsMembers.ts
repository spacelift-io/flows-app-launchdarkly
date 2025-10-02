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

// Input schema for Create Teams Members
const inputSchema: Record<string, AppBlockConfigField> = {
  teamKey: {
    name: "Team Key",
    description: "The team key",
    type: "string",
    required: true,
  },
};

// Output schema for Create Teams Members
const outputSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description:
              "An error message, including CSV line number, if the <code>status</code> is <code>error</code>",
          },
          status: {
            type: "string",
            description:
              "Whether this member can be successfully imported (<code>success</code>) or not (<code>error</code>). Even if the status is <code>success</code>, members are only added to a team on a <code>201</code> response.",
          },
          value: {
            type: "string",
            description:
              "The email address for the member requested to be added to this team. May be blank or an error, such as 'invalid email format', if the email address cannot be found or parsed.",
          },
        },
        required: ["status", "value"],
      },
      description:
        "An array of details about the members requested to be added to this team",
    },
  },
};

export default {
  name: "Create Teams Members",
  description: "Creates create teams members in LaunchDarkly",
  category: "Teams",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { teamKey, ...inputData } = input.event.inputConfig;
        const endpoint = `/api/v2/teams/${teamKey}/members`;

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
