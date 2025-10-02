import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Projects Flags Environments Scheduled Changes2
const inputSchema: Record<string, AppBlockConfigField> = {
  environmentKey: {
    name: "Environment Key",
    description: "The environment key",
    type: "string",
    required: true,
  },
  featureFlagKey: {
    name: "Feature Flag Key",
    description: "The feature flag key",
    type: "string",
    required: true,
  },
  id: {
    name: "Id",
    description: "The scheduled change id",
    type: "string",
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
};

// Output schema for Get Projects Flags Environments Scheduled Changes2
const outputSchema = {
  type: "object",
  properties: {
    _id: {
      type: "string",
      description: "The ID of this scheduled change",
    },
    _creationDate: {
      type: "integer",
      description: "Timestamp of when the scheduled change was created",
    },
    _maintainerId: {
      type: "string",
      description: "The ID of the scheduled change maintainer",
    },
    _version: {
      type: "integer",
      description: "Version of the scheduled change",
    },
    executionDate: {
      type: "integer",
      description: "When the scheduled changes should be executed",
    },
    instructions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: true,
      },
      description:
        "The actions to perform on the execution date for these scheduled changes",
    },
    conflicts: {
      description: "Details on any conflicting scheduled changes",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
  },
  required: [
    "_id",
    "_creationDate",
    "_maintainerId",
    "_version",
    "executionDate",
    "instructions",
  ],
};

export default {
  name: "Get Projects Flags Environments Scheduled Changes2",
  description:
    "Retrieves get projects flags environments scheduled changes2 in LaunchDarkly",
  category: "Scheduled changes",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, featureFlagKey, environmentKey, id } =
          input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/flags/${featureFlagKey}/environments/${environmentKey}/scheduled-changes/${id}`;

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
