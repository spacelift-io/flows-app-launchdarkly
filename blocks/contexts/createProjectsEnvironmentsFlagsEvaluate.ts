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

// Input schema for Create Projects Environments Flags Evaluate
const inputSchema: Record<string, AppBlockConfigField> = {
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
  filter: {
    name: "Filter",
    description:
      "A comma-separated list of filters. Each filter is of the form `field operator value`. Supported fields are explained above.",
    type: "string",
    required: false,
  },
  limit: {
    name: "Limit",
    description:
      "The number of feature flags to return. Defaults to -1, which returns all flags",
    type: "number",
    required: false,
  },
  offset: {
    name: "Offset",
    description:
      "Where to start in the list. Use this with pagination. For example, an offset of 10 skips the first ten items and then returns the next items in the list, up to the query `limit`.",
    type: "number",
    required: false,
  },
  sort: {
    name: "Sort",
    description:
      "A comma-separated list of fields to sort by. Fields prefixed by a dash ( - ) sort in descending order",
    type: "string",
    required: false,
  },
};

// Output schema for Create Projects Environments Flags Evaluate
const outputSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Name of the flag.",
          },
          key: {
            type: "string",
            description: "Key of the flag.",
          },
          _value: {
            description:
              "The value of the flag variation that the context receives. If there is no defined default rule, this is null.",
          },
          reason: {
            type: "object",
            properties: {
              kind: {
                type: "string",
                description:
                  "Describes the general reason that LaunchDarkly selected this variation.",
              },
              ruleIndex: {
                type: "integer",
                description:
                  "The positional index of the matching rule if the kind is 'RULE_MATCH'. The index is 0-based.",
              },
              ruleID: {
                type: "string",
                description:
                  "The unique identifier of the matching rule if the kind is 'RULE_MATCH'.",
              },
              prerequisiteKey: {
                type: "string",
                description:
                  "The key of the flag that failed if the kind is 'PREREQUISITE_FAILED'.",
              },
              inExperiment: {
                type: "boolean",
                description:
                  "Indicates whether the context was evaluated as part of an experiment.",
              },
              errorKind: {
                type: "string",
                description: "The specific error type if the kind is 'ERROR'.",
              },
            },
            required: ["kind"],
            description:
              "Contains information about why that variation was selected.",
          },
          _links: {
            type: "object",
            description: "The location and content type of related resources",
            additionalProperties: true,
          },
        },
        required: ["name", "key", "_value", "_links"],
      },
      description: "Details on the flag evaluations for this context instance",
    },
    totalCount: {
      type: "integer",
      description: "The number of flags",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
  },
  required: ["items", "_links"],
};

export default {
  name: "Create Projects Environments Flags Evaluate",
  description:
    "Creates create projects environments flags evaluate in LaunchDarkly",
  category: "Contexts",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, environmentKey, ...inputData } =
          input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/environments/${environmentKey}/flags/evaluate`;

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
