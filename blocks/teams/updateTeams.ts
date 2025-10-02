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

// Input schema for Update Teams
const inputSchema: Record<string, AppBlockConfigField> = {
  instructions: {
    name: "Instructions",
    description:
      'The instructions to perform when updating. This should be an array with objects that look like <code>{"kind": "update_action"}</code>. Some instructions also require additional parameters as part of this object.',
    type: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: true,
      },
    },
    required: true,
  },
  comment: {
    name: "Comment",
    description: "Optional comment describing the update",
    type: "string",
    required: false,
  },
};

// Output schema for Update Teams
const outputSchema = {
  type: "object",
  properties: {
    memberIDs: {
      type: "array",
      items: {
        type: "string",
      },
      description:
        "A list of member IDs of the members who were added to the teams.",
    },
    teamKeys: {
      type: "array",
      items: {
        type: "string",
      },
      description:
        "A list of team keys of the teams that were successfully updated.",
    },
    errors: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: {
          type: "string",
        },
      },
      description:
        "A list of team keys and errors for the teams whose updates failed.",
    },
  },
};

export default {
  name: "Update Teams",
  description: "Updates update teams in LaunchDarkly",
  category: "Teams",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const inputData = input.event.inputConfig;
        const endpoint = `/api/v2/teams`;

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
