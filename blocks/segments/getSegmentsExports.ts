import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Segments Exports
const inputSchema: Record<string, AppBlockConfigField> = {
  environmentKey: {
    name: "Environment Key",
    description: "The environment key",
    type: "string",
    required: true,
  },
  exportID: {
    name: "Export I D",
    description: "The export ID",
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

// Output schema for Get Segments Exports
const outputSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "The export ID",
    },
    segmentKey: {
      type: "string",
      description: "The segment key",
    },
    creationTime: {
      type: "integer",
      description: "Timestamp of when this export was created",
    },
    status: {
      type: "string",
      description: "The export status",
    },
    sizeBytes: {
      type: "integer",
      description: "The export size, in bytes",
    },
    size: {
      type: "string",
      description: "The export size, with units",
    },
    initiator: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the member who initiated the export",
        },
        email: {
          type: "string",
          description:
            "The email address of the member who initiated the export",
        },
      },
      description: "Details on the member who initiated the export",
    },
    _links: {
      type: "object",
      description:
        "The location and content type of related resources, including the location of the exported file",
      additionalProperties: true,
    },
  },
  required: [
    "id",
    "segmentKey",
    "creationTime",
    "status",
    "sizeBytes",
    "size",
    "initiator",
    "_links",
  ],
};

export default {
  name: "Get Segments Exports",
  description: "Retrieves get segments exports in LaunchDarkly",
  category: "Segments",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, environmentKey, segmentKey, exportID } =
          input.event.inputConfig;
        const endpoint = `/api/v2/segments/${projectKey}/${environmentKey}/${segmentKey}/exports/${exportID}`;

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
