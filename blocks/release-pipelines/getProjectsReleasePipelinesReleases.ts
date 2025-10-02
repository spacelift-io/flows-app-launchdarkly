import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Projects Release Pipelines Releases
const inputSchema: Record<string, AppBlockConfigField> = {
  pipelineKey: {
    name: "Pipeline Key",
    description: "The pipeline key",
    type: "string",
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
  filter: {
    name: "Filter",
    description:
      "Accepts filter by `status` and `activePhaseId`. `status` can take a value of `completed` or `active`. `activePhaseId` takes a UUID and will filter results down to releases active on the specified phase. Providing `status equals completed` along with an `activePhaseId` filter will return an error as they are disjoint sets of data. The combination of `status equals active` and `activePhaseId` will return the same results as `activePhaseId` alone.",
    type: "string",
    required: false,
  },
  limit: {
    name: "Limit",
    description: "The maximum number of items to return. Defaults to 20.",
    type: "number",
    required: false,
  },
  offset: {
    name: "Offset",
    description:
      "Where to start in the list. Defaults to 0. Use this with pagination. For example, an offset of 10 skips the first ten items and then returns the next items in the list, up to the query `limit`.",
    type: "number",
    required: false,
  },
};

// Output schema for Get Projects Release Pipelines Releases
const outputSchema = {
  type: "object",
  properties: {
    activeCount: {
      type: "integer",
      description: "The number of active releases",
    },
    completedCount: {
      type: "integer",
      description: "The number of completed releases",
    },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _createdAt: {
            type: "integer",
            description: "Timestamp of when the release was created",
          },
          _completedAt: {
            type: "integer",
            description: "Timestamp of when the release was completed",
          },
          flagKey: {
            type: "string",
            description: "The flag key",
          },
          activePhaseId: {
            type: "string",
            description: "The ID of the currently active release phase",
          },
          _links: {
            type: "object",
            description: "The location and content type of related resources",
            additionalProperties: true,
          },
        },
        required: ["_createdAt", "flagKey", "_links"],
      },
      description:
        "A list of details for each release, across all flags, for this release pipeline",
    },
    phases: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "The phase ID",
          },
          name: {
            type: "string",
            description: "The release phase name",
          },
          releaseCount: {
            type: "integer",
            description: "The number of active releases in this phase",
          },
        },
        required: ["_id", "name", "releaseCount"],
      },
      description:
        "A list of details for each phase, across all releases, for this release pipeline",
    },
    totalCount: {
      type: "integer",
      description: "The total number of releases for this release pipeline",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
  },
  required: [
    "activeCount",
    "completedCount",
    "items",
    "phases",
    "totalCount",
    "_links",
  ],
};

export default {
  name: "Get Projects Release Pipelines Releases",
  description:
    "Retrieves get projects release pipelines releases in LaunchDarkly",
  category: "Release pipelines",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, pipelineKey } = input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/release-pipelines/${pipelineKey}/releases`;

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
