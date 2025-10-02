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

// Input schema for Create Projects Flags Environments Migration Safety Issues
const inputSchema: Record<string, AppBlockConfigField> = {
  environmentKey: {
    name: "Environment Key",
    description: "The environment key",
    type: "string",
    required: true,
  },
  flagKey: {
    name: "Flag Key",
    description: "The migration flag key",
    type: "string",
    required: true,
  },
  instructions: {
    name: "Instructions",
    description:
      "Semantic patch instructions. The same ones that are valid for flags are valid here.",
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
    description: "",
    type: "string",
    required: false,
  },
};

// Output schema for Create Projects Flags Environments Migration Safety Issues
const outputSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      causingRuleId: {
        type: "string",
        description: "The ID of the rule which caused this issue",
      },
      affectedRuleIds: {
        type: "array",
        items: {
          type: "string",
        },
        description:
          "A list of the IDs of the rules which are affected by this issue. <code>fallthrough</code> is a sentinel value for the default rule.",
      },
      issue: {
        type: "string",
        description:
          "A description of the issue that <code>causingRuleId</code> has caused for <code>affectedRuleIds</code>.",
      },
      oldSystemAffected: {
        type: "boolean",
        description:
          "Whether the changes caused by <code>causingRuleId</code> bring inconsistency to the old system",
      },
    },
  },
};

export default {
  name: "Create Projects Flags Environments Migration Safety Issues",
  description:
    "Creates create projects flags environments migration safety issues in LaunchDarkly",
  category: "Feature flags",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, flagKey, environmentKey, ...inputData } =
          input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/flags/${flagKey}/environments/${environmentKey}/migration-safety-issues`;

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
