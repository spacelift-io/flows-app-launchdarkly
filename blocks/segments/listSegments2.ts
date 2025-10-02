import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for List Segments2
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
  segmentKey: {
    name: "Segment Key",
    description: "The segment key",
    type: "string",
    required: true,
  },
};

// Output schema for List Segments2
const outputSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "A human-friendly name for the segment.",
    },
    description: {
      type: "string",
      description:
        "A description of the segment's purpose. Defaults to <code>null</code> and is omitted in the response if not provided.",
    },
    tags: {
      type: "array",
      items: {
        type: "string",
      },
      description: "Tags for the segment. Defaults to an empty array.",
    },
    creationDate: {
      type: "integer",
      description: "Timestamp of when the segment was created",
    },
    lastModifiedDate: {
      type: "integer",
      description: "Timestamp of when the segment was last modified",
    },
    key: {
      type: "string",
      description: "A unique key used to reference the segment",
    },
    included: {
      type: "array",
      items: {
        type: "string",
      },
      description:
        "An array of keys for included targets. Included individual targets are always segment members, regardless of segment rules. For list-based segments over 15,000 entries, also called big segments, this array is either empty or omitted.",
    },
    excluded: {
      type: "array",
      items: {
        type: "string",
      },
      description:
        "An array of keys for excluded targets. Segment rules bypass individual excluded targets, so they will never be included based on rules. Excluded targets may still be included explicitly. This value is omitted for list-based segments over 15,000 entries, also called big segments.",
    },
    includedContexts: {
      type: "array",
      items: {
        type: "object",
        properties: {
          values: {
            type: "array",
            items: {
              type: "string",
            },
          },
          contextKind: {
            type: "string",
          },
        },
      },
    },
    excludedContexts: {
      type: "array",
      items: {
        type: "object",
      },
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    rules: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _id: {
            type: "string",
          },
          clauses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                _id: {
                  type: "string",
                },
                attribute: {
                  type: "string",
                },
                op: {
                  type: "string",
                },
                values: {
                  type: "array",
                  items: {
                    type: "object",
                  },
                },
                contextKind: {
                  type: "string",
                },
                negate: {
                  type: "boolean",
                },
              },
              required: ["attribute", "op", "values", "negate"],
            },
          },
          weight: {
            type: "integer",
          },
          rolloutContextKind: {
            type: "string",
          },
          bucketBy: {
            type: "string",
          },
          description: {
            type: "string",
          },
        },
        required: ["clauses"],
      },
      description: "An array of the targeting rules for this segment.",
    },
    version: {
      type: "integer",
      description: "Version of the segment",
    },
    deleted: {
      type: "boolean",
      description: "Whether the segment has been deleted",
    },
    _access: {
      type: "object",
      properties: {
        denied: {
          type: "array",
          items: {
            type: "object",
            properties: {
              action: {
                type: "string",
              },
              reason: {
                type: "object",
                properties: {
                  resources: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Resource specifier strings",
                  },
                  notResources: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Targeted resources are the resources NOT in this list. The <code>resources</code> and <code>notActions</code> fields must be empty to use this field.",
                  },
                  actions: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Actions to perform on a resource",
                  },
                  notActions: {
                    type: "array",
                    items: {
                      type: "object",
                    },
                    description:
                      "Targeted actions are the actions NOT in this list. The <code>actions</code> and <code>notResources</code> fields must be empty to use this field.",
                  },
                  effect: {
                    type: "string",
                    enum: ["allow", "deny"],
                    description:
                      "Whether this statement should allow or deny actions on the resources.",
                  },
                  role_name: {
                    type: "string",
                  },
                },
                required: ["effect"],
              },
            },
            required: ["action", "reason"],
          },
        },
        allowed: {
          type: "array",
          items: {
            type: "object",
            properties: {
              reason: {
                type: "object",
                properties: {
                  resources: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Resource specifier strings",
                  },
                  notResources: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Targeted resources are the resources NOT in this list. The <code>resources</code> and <code>notActions</code> fields must be empty to use this field.",
                  },
                  actions: {
                    type: "array",
                    items: {
                      type: "object",
                    },
                    description: "Actions to perform on a resource",
                  },
                  notActions: {
                    type: "array",
                    items: {
                      type: "object",
                    },
                    description:
                      "Targeted actions are the actions NOT in this list. The <code>actions</code> and <code>notResources</code> fields must be empty to use this field.",
                  },
                  effect: {
                    type: "string",
                    enum: ["allow", "deny"],
                    description:
                      "Whether this statement should allow or deny actions on the resources.",
                  },
                  role_name: {
                    type: "string",
                  },
                },
                required: ["effect"],
              },
            },
            required: ["reason"],
          },
        },
      },
      required: ["denied", "allowed"],
    },
    _flags: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The flag name",
          },
          key: {
            type: "string",
            description: "The flag key",
          },
          _links: {
            type: "object",
            additionalProperties: true,
          },
        },
        required: ["name", "key"],
      },
      description:
        "A list of flags targeting this segment. Only included when getting a single segment, using the <code>getSegment</code> endpoint.",
    },
    unbounded: {
      type: "boolean",
      description:
        "Whether this is a standard segment (<code>false</code>) or a big segment (<code>true</code>). Standard segments include rule-based segments and smaller list-based segments. Big segments include larger list-based segments and synced segments. If omitted, the segment is a standard segment.",
    },
    unboundedContextKind: {
      type: "string",
      description: "For big segments, the targeted context kind.",
    },
    generation: {
      type: "integer",
      description:
        "For big segments, how many times this segment has been created.",
    },
    _unboundedMetadata: {
      type: "object",
      properties: {
        envId: {
          type: "string",
        },
        segmentId: {
          type: "string",
        },
        version: {
          type: "integer",
        },
        includedCount: {
          type: "integer",
        },
        excludedCount: {
          type: "integer",
        },
        lastModified: {
          type: "integer",
        },
        deleted: {
          type: "boolean",
        },
      },
      description:
        "Details on the external data store backing this segment. Only applies to big segments.",
    },
    _external: {
      type: "string",
      description:
        "The external data store backing this segment. Only applies to synced segments.",
    },
    _externalLink: {
      type: "string",
      description:
        "The URL for the external data store backing this segment. Only applies to synced segments.",
    },
    _importInProgress: {
      type: "boolean",
      description:
        "Whether an import is currently in progress for the specified segment. Only applies to big segments.",
    },
  },
  required: [
    "name",
    "tags",
    "creationDate",
    "lastModifiedDate",
    "key",
    "_links",
    "rules",
    "version",
    "deleted",
    "generation",
  ],
};

export default {
  name: "List Segments2",
  description: "Retrieves list segments2 in LaunchDarkly",
  category: "Segments",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, environmentKey, segmentKey } =
          input.event.inputConfig;
        const endpoint = `/api/v2/segments/${projectKey}/${environmentKey}/${segmentKey}`;

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
