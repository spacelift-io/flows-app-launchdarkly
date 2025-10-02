import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Segments Contexts
const inputSchema: Record<string, AppBlockConfigField> = {
  contextKey: {
    name: "Context Key",
    description: "The context key",
    type: "string",
    required: true,
  },
  environmentKey: {
    name: "Environment Key",
    description: "The environment key",
    type: "string",
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
  segmentKey: {
    name: "Segment Key",
    description: "The segment key",
    type: "string",
    required: true,
  },
};

// Output schema for Get Segments Contexts
const outputSchema = {
  type: "object",
  properties: {
    userKey: {
      type: "string",
      description: "The target key",
    },
    included: {
      type: "boolean",
      description:
        "Indicates whether the target is included.<br />Included targets are always segment members, regardless of segment rules.",
    },
    excluded: {
      type: "boolean",
      description:
        "Indicates whether the target is excluded.<br />Segment rules bypass excluded targets, so they will never be included based on rules. Excluded targets may still be included explicitly.",
    },
  },
  required: ["userKey", "included", "excluded"],
};

export default {
  name: "Get Segments Contexts",
  description: "Retrieves get segments contexts in LaunchDarkly",
  category: "Segments",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, environmentKey, segmentKey, contextKey } =
          input.event.inputConfig;
        const endpoint = `/api/v2/segments/${projectKey}/${environmentKey}/${segmentKey}/contexts/${contextKey}`;

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
