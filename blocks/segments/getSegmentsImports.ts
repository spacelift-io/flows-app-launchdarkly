import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Segments Imports
const inputSchema: Record<string, AppBlockConfigField> = {
  environmentKey: {
    name: "Environment Key",
    description: "The environment key",
    type: "string",
    required: true,
  },
  importID: {
    name: "Import I D",
    description: "The import ID",
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

// Output schema for Get Segments Imports
const outputSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "The import ID",
    },
    segmentKey: {
      type: "string",
      description: "The segment key",
    },
    creationTime: {
      type: "integer",
      description: "Timestamp of when this import was created",
    },
    mode: {
      type: "string",
      description:
        "The import mode used, either <code>merge</code> or <code>replace</code>",
    },
    status: {
      type: "string",
      enum: [
        "preparing",
        "pending_approval",
        "ready",
        "in_progress",
        "complete",
        "stopped",
      ],
      description: "The import status",
    },
    files: {
      type: "array",
      items: {
        type: "object",
        properties: {
          filename: {
            type: "string",
            description: "The imported file name, including the extension",
          },
          status: {
            type: "string",
            description: "The imported file status",
          },
        },
      },
      description: "The imported files and their status",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
  },
  required: ["id", "segmentKey", "creationTime", "mode", "status", "_links"],
};

export default {
  name: "Get Segments Imports",
  description: "Retrieves get segments imports in LaunchDarkly",
  category: "Segments",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, environmentKey, segmentKey, importID } =
          input.event.inputConfig;
        const endpoint = `/api/v2/segments/${projectKey}/${environmentKey}/${segmentKey}/imports/${importID}`;

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
