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

// Input schema for Create Flags
const inputSchema: Record<string, AppBlockConfigField> = {
  key: {
    name: "Key",
    description: "A unique key used to reference the flag in your code",
    type: "string",
    required: true,
  },
  name: {
    name: "Name",
    description: "A human-friendly name for the feature flag",
    type: "string",
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
  clientSideAvailability: {
    name: "Client Side Availability",
    description:
      "Which type of client-side SDKs the feature flag is available to",
    type: {
      type: "object",
      properties: {
        usingEnvironmentId: {
          type: "boolean",
          description:
            "Whether to enable availability for client-side SDKs. Defaults to <code>false</code>.",
        },
        usingMobileKey: {
          type: "boolean",
          description:
            "Whether to enable availability for mobile SDKs. Defaults to <code>true</code>.",
        },
      },
      required: ["usingEnvironmentId", "usingMobileKey"],
      description:
        "Which type of client-side SDKs the feature flag is available to",
    },
    required: false,
  },
  clone: {
    name: "Clone",
    description:
      "The key of the feature flag to be cloned. The key identifies the flag in your code. For example, setting `clone=flagKey` copies the full targeting configuration for all environments, including `on/off` state, from the original flag to the new flag.",
    type: "string",
    required: false,
  },
  customProperties: {
    name: "Custom Properties",
    description:
      "Metadata attached to the feature flag, in the form of the property key associated with a name and array of values for the metadata to associate with this flag. Typically used to store data related to an integration.",
    type: {
      type: "object",
    },
    required: false,
  },
  defaults: {
    name: "Defaults",
    description:
      "The indices, from the array of variations, for the variations to serve by default when targeting is on and when targeting is off. These variations will be used for this flag in new environments. If omitted, the first and last variation will be used.",
    type: {
      type: "object",
      properties: {
        onVariation: {
          type: "integer",
          description:
            "The index, from the array of variations for this flag, of the variation to serve by default when targeting is on.",
        },
        offVariation: {
          type: "integer",
          description:
            "The index, from the array of variations for this flag, of the variation to serve by default when targeting is off.",
        },
      },
      required: ["onVariation", "offVariation"],
      description:
        "The indices, from the array of variations, for the variations to serve by default when targeting is on and when targeting is off. These variations will be used for this flag in new environments. If omitted, the first and last variation will be used.",
    },
    required: false,
  },
  description: {
    name: "Description",
    description:
      "Description of the feature flag. Defaults to an empty string.",
    type: "string",
    required: false,
  },
  includeInSnippet: {
    name: "Include In Snippet",
    description:
      "Deprecated, use <code>clientSideAvailability</code>. Whether this flag should be made available to the client-side JavaScript SDK. Defaults to <code>false</code>.",
    type: "boolean",
    required: false,
  },
  initialPrerequisites: {
    name: "Initial Prerequisites",
    description: "Initial set of prerequisite flags for all environments",
    type: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: {
            type: "string",
            description: "Flag key of the prerequisite flag",
          },
          variationId: {
            type: "string",
            description: "ID of a variation of the prerequisite flag",
          },
        },
        required: ["key", "variationId"],
      },
    },
    required: false,
  },
  isFlagOn: {
    name: "Is Flag On",
    description:
      "Whether to automatically turn the flag on across all environments at creation. Defaults to <code>false</code>.",
    type: "boolean",
    required: false,
  },
  maintainerId: {
    name: "Maintainer Id",
    description: "The ID of the member who maintains this feature flag",
    type: "string",
    required: false,
  },
  maintainerTeamKey: {
    name: "Maintainer Team Key",
    description: "The key of the team that maintains this feature flag",
    type: "string",
    required: false,
  },
  migrationSettings: {
    name: "Migration Settings",
    description:
      "Settings relevant to flags where <code>purpose</code> is <code>migration</code>",
    type: {
      type: "object",
      properties: {
        contextKind: {
          type: "string",
          description:
            "Context kind for a migration with 6 stages, where data is being moved",
        },
        stageCount: {
          type: "integer",
          enum: ["2", "4", "6"],
        },
      },
      required: ["stageCount"],
      description:
        "Settings relevant to flags where <code>purpose</code> is <code>migration</code>",
    },
    required: false,
  },
  purpose: {
    name: "Purpose",
    description: "Purpose of the flag",
    type: "string",
    required: false,
  },
  tags: {
    name: "Tags",
    description: "Tags for the feature flag. Defaults to an empty array.",
    type: ["string"],
    required: false,
  },
  temporary: {
    name: "Temporary",
    description:
      "Whether the flag is a temporary flag. Defaults to <code>true</code>.",
    type: "boolean",
    required: false,
  },
  variations: {
    name: "Variations",
    description:
      "An array of possible variations for the flag. The variation values must be unique. If omitted, two boolean variations of <code>true</code> and <code>false</code> will be used.",
    type: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description:
              "The ID of the variation. Leave empty when you are creating a flag.",
          },
          value: {
            description:
              "The value of the variation. For boolean flags, this must be <code>true</code> or <code>false</code>. For multivariate flags, this may be a string, number, or JSON object.",
          },
          description: {
            type: "string",
            description:
              "Description of the variation. Defaults to an empty string, but is omitted from the response if not set.",
          },
          name: {
            type: "string",
            description:
              "A human-friendly name for the variation. Defaults to an empty string, but is omitted from the response if not set.",
          },
        },
        required: ["value"],
      },
    },
    required: false,
  },
};

// Output schema for Create Flags
const outputSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "A human-friendly name for the feature flag",
    },
    kind: {
      type: "string",
      enum: ["boolean", "multivariate"],
      description: "Kind of feature flag",
    },
    description: {
      type: "string",
      description: "Description of the feature flag",
    },
    key: {
      type: "string",
      description: "A unique key used to reference the flag in your code",
    },
    _version: {
      type: "integer",
      description: "Version of the feature flag",
    },
    creationDate: {
      type: "integer",
      description: "Timestamp of flag creation date",
    },
    includeInSnippet: {
      type: "boolean",
      description:
        "Deprecated, use <code>clientSideAvailability</code>. Whether this flag should be made available to the client-side JavaScript SDK",
    },
    clientSideAvailability: {
      type: "object",
      properties: {
        usingMobileKey: {
          type: "boolean",
        },
        usingEnvironmentId: {
          type: "boolean",
        },
      },
      description:
        "Which type of client-side SDKs the feature flag is available to",
    },
    variations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description:
              "The ID of the variation. Leave empty when you are creating a flag.",
          },
          value: {
            description:
              "The value of the variation. For boolean flags, this must be <code>true</code> or <code>false</code>. For multivariate flags, this may be a string, number, or JSON object.",
          },
          description: {
            type: "string",
            description:
              "Description of the variation. Defaults to an empty string, but is omitted from the response if not set.",
          },
          name: {
            type: "string",
            description:
              "A human-friendly name for the variation. Defaults to an empty string, but is omitted from the response if not set.",
          },
        },
        required: ["value"],
      },
      description: "An array of possible variations for the flag",
    },
    temporary: {
      type: "boolean",
      description: "Whether the flag is a temporary flag",
    },
    tags: {
      type: "array",
      items: {
        type: "string",
      },
      description: "Tags for the feature flag",
    },
    _links: {
      type: "object",
      description: "The location and content type of related resources",
      additionalProperties: true,
    },
    maintainerId: {
      type: "string",
      description: "Associated maintainerId for the feature flag",
    },
    _maintainer: {
      type: "object",
      properties: {
        _links: {
          type: "object",
          description: "The location and content type of related resources",
          additionalProperties: true,
        },
        _id: {
          type: "string",
          description: "The member's ID",
        },
        firstName: {
          type: "string",
          description: "The member's first name",
        },
        lastName: {
          type: "string",
          description: "The member's last name",
        },
        role: {
          type: "string",
          description:
            "The member's base role. If the member has no additional roles, this role will be in effect.",
        },
        email: {
          type: "string",
          description: "The member's email address",
        },
      },
      required: ["_links", "_id", "role", "email"],
      description: "Associated maintainer member info for the feature flag",
    },
    maintainerTeamKey: {
      type: "string",
      description:
        "The key of the associated team that maintains this feature flag",
    },
    _maintainerTeam: {
      type: "object",
      properties: {
        key: {
          type: "string",
          description: "The key of the maintainer team",
        },
        name: {
          type: "string",
          description: "A human-friendly name for the maintainer team",
        },
        _links: {
          type: "object",
          description: "The location and content type of related resources",
          additionalProperties: true,
        },
      },
      required: ["key", "name"],
      description: "Associated maintainer team info for the feature flag",
    },
    goalIds: {
      type: "array",
      items: {
        type: "string",
      },
      description: "Deprecated, use <code>experiments</code> instead",
    },
    experiments: {
      type: "object",
      properties: {
        baselineIdx: {
          type: "integer",
        },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              metricKey: {
                type: "string",
              },
              _metric: {
                type: "object",
                properties: {
                  experimentCount: {
                    type: "integer",
                    description: "The number of experiments using this metric",
                  },
                  metricGroupCount: {
                    type: "integer",
                    description:
                      "The number of metric groups using this metric",
                  },
                  activeExperimentCount: {
                    type: "integer",
                    description:
                      "The number of active experiments using this metric",
                  },
                  activeGuardedRolloutCount: {
                    type: "integer",
                    description:
                      "The number of active guarded rollouts using this metric",
                  },
                  _id: {
                    type: "string",
                    description: "The ID of this metric",
                  },
                  _versionId: {
                    type: "string",
                    description: "The version ID of the metric",
                  },
                  _version: {
                    type: "integer",
                    description: "Version of the metric",
                  },
                  key: {
                    type: "string",
                    description: "A unique key to reference the metric",
                  },
                  name: {
                    type: "string",
                    description: "A human-friendly name for the metric",
                  },
                  kind: {
                    type: "string",
                    enum: ["pageview", "click", "custom"],
                    description: "The kind of event the metric tracks",
                  },
                  _attachedFlagCount: {
                    type: "integer",
                    description:
                      "The number of feature flags currently attached to this metric",
                  },
                  _links: {
                    type: "object",
                    description:
                      "The location and content type of related resources",
                    additionalProperties: true,
                  },
                  _site: {
                    type: "object",
                    description:
                      "Details on how to access the metric in the LaunchDarkly UI",
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
                                  description:
                                    "Actions to perform on a resource",
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
                                  description:
                                    "Actions to perform on a resource",
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
                    description:
                      "Details on the allowed and denied actions for this metric",
                  },
                  tags: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Tags for the metric",
                  },
                  _creationDate: {
                    type: "integer",
                    description: "Timestamp of when the metric was created",
                  },
                  lastModified: {
                    type: "object",
                    properties: {
                      date: {
                        type: "string",
                      },
                    },
                  },
                  maintainerId: {
                    type: "string",
                    description:
                      "The ID of the member who maintains this metric",
                  },
                  _maintainer: {
                    type: "object",
                    required: [],
                    description:
                      "Details on the member who maintains this metric",
                  },
                  description: {
                    type: "string",
                    description: "Description of the metric",
                  },
                  category: {
                    type: "string",
                    description: "The category of the metric",
                  },
                  isNumeric: {
                    type: "boolean",
                    description:
                      "For custom metrics, whether to track numeric changes in value against a baseline (<code>true</code>) or to track a conversion when an end user takes an action (<code>false</code>).",
                  },
                  successCriteria: {
                    type: "string",
                    enum: ["HigherThanBaseline", "LowerThanBaseline"],
                    description: "For custom metrics, the success criteria",
                  },
                  unit: {
                    type: "string",
                    description:
                      "For numeric custom metrics, the unit of measure",
                  },
                  eventKey: {
                    type: "string",
                    description:
                      "For custom metrics, the event key to use in your code",
                  },
                  randomizationUnits: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "An array of randomization units allowed for this metric",
                  },
                  filters: {
                    type: "object",
                    properties: {
                      type: {
                        type: "string",
                        enum: ["group", "contextAttribute", "eventProperty"],
                        description:
                          "Filter type. One of [contextAttribute, eventProperty, group]",
                      },
                      attribute: {
                        type: "string",
                        description:
                          "If not a group node, the context attribute name or event property name to filter on",
                      },
                      op: {
                        type: "string",
                        description: "The function to perform",
                      },
                      values: {
                        type: "array",
                        items: {
                          type: "object",
                        },
                        description:
                          "The context attribute / event property values or group member nodes",
                      },
                      contextKind: {
                        type: "string",
                        description:
                          "For context attribute filters, the context kind.",
                      },
                      negate: {
                        type: "boolean",
                        description:
                          "If set, then take the inverse of the operator. 'in' becomes 'not in'.",
                      },
                    },
                    required: ["type", "op", "values", "negate"],
                    description:
                      "The filters narrowing down the audience based on context attributes or event properties.",
                  },
                  unitAggregationType: {
                    type: "string",
                    enum: ["average", "sum"],
                    description:
                      "The method by which multiple unit event values are aggregated",
                  },
                  analysisType: {
                    type: "string",
                    enum: ["mean", "percentile"],
                    description: "The method for analyzing metric events",
                  },
                  percentileValue: {
                    type: "integer",
                    description:
                      "The percentile for the analysis method. An integer denoting the target percentile between 0 and 100. Required when <code>analysisType</code> is <code>percentile</code>.",
                  },
                  eventDefault: {
                    type: "object",
                    properties: {
                      disabled: {
                        type: "boolean",
                        description:
                          "Whether to disable defaulting missing unit events when calculating results. Defaults to false",
                      },
                      value: {
                        type: "number",
                        description:
                          "The default value applied to missing unit events. Set to 0 when <code>disabled</code> is false. No other values are currently supported.",
                      },
                    },
                  },
                  dataSource: {
                    type: "object",
                    properties: {
                      key: {
                        type: "string",
                      },
                      environmentKey: {
                        type: "string",
                      },
                      _name: {
                        type: "string",
                      },
                      _integrationKey: {
                        type: "string",
                      },
                    },
                  },
                  archived: {
                    type: "boolean",
                    description: "Whether the metric version is archived",
                  },
                  archivedAt: {
                    type: "integer",
                    description:
                      "Timestamp when the metric version was archived",
                  },
                  selector: {
                    type: "string",
                    description: "For click metrics, the CSS selectors",
                  },
                  urls: {
                    type: "array",
                    items: {
                      type: "object",
                      additionalProperties: true,
                    },
                    description:
                      "For click and pageview metrics, the target URLs",
                  },
                },
                required: [
                  "_id",
                  "_versionId",
                  "key",
                  "name",
                  "kind",
                  "_links",
                  "tags",
                  "_creationDate",
                ],
              },
              environments: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              _environmentSettings: {
                type: "object",
                additionalProperties: true,
              },
            },
          },
        },
      },
      required: ["baselineIdx", "items"],
      description: "Experimentation data for the feature flag",
    },
    customProperties: {
      type: "object",
      description:
        "Metadata attached to the feature flag, in the form of the property key associated with a name and array of values for the metadata to associate with this flag. Typically used to store data related to an integration.",
      additionalProperties: true,
    },
    archived: {
      type: "boolean",
      description: "Boolean indicating if the feature flag is archived",
    },
    archivedDate: {
      type: "integer",
      description: "If archived is true, date of archive",
    },
    deprecatedDate: {
      type: "integer",
      description: "If deprecated is true, date of deprecation",
    },
    defaults: {
      type: "object",
      properties: {
        onVariation: {
          type: "integer",
          description:
            "The index, from the array of variations for this flag, of the variation to serve by default when targeting is on.",
        },
        offVariation: {
          type: "integer",
          description:
            "The index, from the array of variations for this flag, of the variation to serve by default when targeting is off.",
        },
      },
      required: ["onVariation", "offVariation"],
      description:
        "The indices, from the array of variations, for the variations to serve by default when targeting is on and when targeting is off. These variations will be used for this flag in new environments. If omitted, the first and last variation will be used.",
    },
    _purpose: {
      type: "string",
    },
    migrationSettings: {
      type: "object",
      properties: {
        contextKind: {
          type: "string",
          description:
            "The context kind targeted by this migration flag. Only applicable for six-stage migrations.",
        },
        stageCount: {
          type: "integer",
          description: "The number of stages for this migration flag",
        },
      },
      description: "Migration-related settings for the flag",
    },
    environments: {
      type: "object",
      description:
        "Details on the environments for this flag. Only returned if the request is filtered by environment, using the <code>filterEnv</code> query parameter.",
      additionalProperties: true,
    },
  },
  required: [
    "name",
    "kind",
    "key",
    "_version",
    "creationDate",
    "variations",
    "temporary",
    "tags",
    "_links",
    "experiments",
    "customProperties",
    "archived",
  ],
};

export default {
  name: "Create Flags",
  description: "Creates create flags in LaunchDarkly",
  category: "Feature flags",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, ...inputData } = input.event.inputConfig;
        const endpoint = `/api/v2/flags/${projectKey}`;

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
