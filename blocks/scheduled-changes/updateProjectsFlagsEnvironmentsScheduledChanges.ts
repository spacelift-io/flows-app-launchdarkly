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

// Input schema for Update Projects Flags Environments Scheduled Changes
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
    description: "The scheduled change ID",
    type: "string",
    required: true,
  },
  instructions: {
    name: "Instructions",
    description:
      'The instructions to perform when updating. This should be an array with objects that look like <code>{"kind": "update_action"}</code>. Some instructions also require a <code>value</code> field in the array element.',
    type: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: true,
      },
    },
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
  comment: {
    name: "Comment",
    description:
      "Optional comment describing the update to the scheduled changes",
    type: "string",
    required: false,
  },
  ignoreConflicts: {
    name: "Ignore Conflicts",
    description:
      "Whether to succeed (`true`) or fail (`false`) when these new instructions conflict with existing scheduled changes",
    type: "boolean",
    required: false,
  },
};

// Output schema for Update Projects Flags Environments Scheduled Changes
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
  name: "Update Projects Flags Environments Scheduled Changes",
  description:
    "Updates update projects flags environments scheduled changes in LaunchDarkly",
  category: "Scheduled changes",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, featureFlagKey, environmentKey, id, ...inputData } =
          input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/flags/${featureFlagKey}/environments/${environmentKey}/scheduled-changes/${id}`;

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
