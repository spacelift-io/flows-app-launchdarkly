import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Projects Environments Context Attributes2
const inputSchema: Record<string, AppBlockConfigField> = {
  attributeName: {
    name: "Attribute Name",
    description: "The attribute name",
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
  filter: {
    name: "Filter",
    description:
      "A comma-separated list of context filters. This endpoint only accepts `kind` filters, with the `equals` operator, and `value` filters, with the `startsWith` operator. To learn more about the filter syntax, read [Filtering contexts and context instances](https://launchdarkly.com/docs/ld-docs/api/contexts#filtering-contexts-and-context-instances).",
    type: "string",
    required: false,
  },
  limit: {
    name: "Limit",
    description:
      "Specifies the maximum number of items in the collection to return (max: 100, default: 50)",
    type: "number",
    required: false,
  },
};

// Output schema for Get Projects Environments Context Attributes2
const outputSchema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          kind: {
            type: "string",
            description:
              "The kind associated with this collection of context attribute values.",
          },
          values: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  description: "A value for a context attribute.",
                },
                weight: {
                  type: "integer",
                  description:
                    "A relative estimate of the number of contexts seen recently that have a matching value for a given attribute.",
                },
              },
              required: ["name", "weight"],
            },
            description: "A collection of context attribute values.",
          },
        },
        required: ["kind", "values"],
      },
      description:
        "A collection of context attribute value data grouped by kind.",
    },
  },
  required: ["items"],
};

export default {
  name: "Get Projects Environments Context Attributes2",
  description:
    "Retrieves get projects environments context attributes2 in LaunchDarkly",
  category: "Contexts",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, environmentKey, attributeName } =
          input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/environments/${environmentKey}/context-attributes/${attributeName}`;

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
