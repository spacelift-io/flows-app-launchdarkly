import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Tags
const inputSchema: Record<string, AppBlockConfigField> = {
  archived: {
    name: "Archived",
    description: "Whether or not to return archived flags",
    type: "boolean",
    required: false,
  },
  asOf: {
    name: "As Of",
    description:
      "The time to retrieve tags as of. Default is the current time.",
    type: "string",
    required: false,
  },
  kind: {
    name: "Kind",
    description:
      "Fetch tags associated with the specified resource type. Options are `flag`, `project`, `environment`, `segment`, `metric`, `aiconfig`, and `view`. Returns all types by default.",
    type: ["string"],
    required: false,
  },
  limit: {
    name: "Limit",
    description: "The number of tags to return. Maximum is 1000.",
    type: "number",
    required: false,
  },
  offset: {
    name: "Offset",
    description: "The index of the first tag to return. Default is 0.",
    type: "number",
    required: false,
  },
  pre: {
    name: "Pre",
    description: "Return tags with the specified prefix",
    type: "string",
    required: false,
  },
};

// Output schema for List Tags
const outputSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "string",
      },
      description: "List of tags",
    },
    _links: {
      type: "object",
      additionalProperties: true,
    },
    totalCount: {
      type: "integer",
      description: "The total number of tags",
    },
  },
  required: ["_links", "items"],
};

export default {
  name: "List Tags",
  description: "Retrieves list tags in LaunchDarkly",
  category: "Tags",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const endpoint = `/api/v2/tags`;

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
