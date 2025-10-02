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

// Input schema for Create Projects Environments Segments Evaluate
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
};

// Output schema for Create Projects Environments Segments Evaluate
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
            description: "A human-friendly name for the segment",
          },
          key: {
            type: "string",
            description: "A unique key used to reference the segment",
          },
          description: {
            type: "string",
            description: "A description of the segment's purpose",
          },
          unbounded: {
            type: "boolean",
            description:
              "Whether this is an unbounded segment. Unbounded segments, also called big segments, may be list-based segments with more than 15,000 entries, or synced segments.",
          },
          external: {
            type: "string",
            description:
              "If the segment is a synced segment, the name of the external source",
          },
          isMember: {
            type: "boolean",
            description:
              "Whether the context is a member of this segment, either by explicit inclusion or by rule matching",
          },
          isIndividuallyTargeted: {
            type: "boolean",
            description:
              "Whether the context is explicitly included in this segment",
          },
          isRuleTargeted: {
            type: "boolean",
            description:
              "Whether the context is captured by this segment's rules. The value of this field is undefined if the context is also explicitly included (<code>isIndividuallyTargeted</code> is <code>true</code>).",
          },
          _links: {
            type: "object",
            description: "The location and content type of related resources",
            additionalProperties: true,
          },
        },
        required: [
          "name",
          "key",
          "description",
          "unbounded",
          "external",
          "isMember",
          "isIndividuallyTargeted",
          "isRuleTargeted",
          "_links",
        ],
      },
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
  name: "Create Projects Environments Segments Evaluate",
  description:
    "Creates create projects environments segments evaluate in LaunchDarkly",
  category: "Segments",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, environmentKey, ...inputData } =
          input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/environments/${environmentKey}/segments/evaluate`;

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
