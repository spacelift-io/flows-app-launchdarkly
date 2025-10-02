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

// Input schema for Create Projects Views Link
const inputSchema: Record<string, AppBlockConfigField> = {
  projectKey: {
    name: "Project Key",
    description: "",
    type: "string",
    required: true,
  },
  resourceType: {
    name: "Resource Type",
    description: "",
    type: "string",
    required: true,
  },
  viewKey: {
    name: "View Key",
    description: "",
    type: "string",
    required: true,
  },
};

// Output schema for Create Projects Views Link
const outputSchema = {
  type: "object",
  properties: {
    successCount: {
      type: "integer",
      description: "The number of resources successfully linked.",
    },
    failureCount: {
      type: "integer",
      description: "The number of resources that failed to link.",
    },
    linkedResources: {
      type: "object",
      properties: {
        _links: {
          type: "object",
          properties: {
            first: {
              type: "object",
              properties: {
                href: {
                  type: "string",
                },
                type: {
                  type: "string",
                },
              },
            },
          },
        },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _links: {
                type: "object",
                properties: {
                  self: {
                    type: "object",
                    properties: {
                      href: {
                        type: "string",
                      },
                      type: {
                        type: "string",
                      },
                    },
                    required: ["href", "type"],
                  },
                },
                required: ["self"],
                description:
                  "The location and content type of related resources",
              },
              resourceKey: {
                type: "string",
                description:
                  "Key of the resource (flag, segment, AI config or metric)",
              },
              environmentId: {
                type: "string",
                description:
                  "Environment ID of the resource (only present for segments)",
              },
              environmentKey: {
                type: "string",
                description:
                  "Environment Key of the resource (only present for segments)",
              },
              resourceType: {
                type: "string",
                enum: ["flag", "segment", "metric", "aiConfig"],
              },
              linkedAt: {
                type: "integer",
              },
              resourceDetails: {
                type: "object",
                properties: {
                  view: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        description: "Unique ID of this view",
                      },
                      accountId: {
                        type: "string",
                        description: "ID of the account that owns this view",
                      },
                      projectId: {
                        type: "string",
                        description: "ID of the project this view belongs to",
                      },
                      projectKey: {
                        type: "string",
                        description: "Key of the project this view belongs to",
                      },
                      key: {
                        type: "string",
                        description:
                          "Unique key for the view within the account/project",
                      },
                      name: {
                        type: "string",
                        description: "Human-readable name for the view",
                      },
                      description: {
                        type: "string",
                        description:
                          "Optional detailed description of the view",
                      },
                      generateSdkKeys: {
                        type: "boolean",
                        description:
                          "Whether to generate SDK keys for this view. Defaults to false.",
                      },
                      version: {
                        type: "integer",
                        description: "Version number for tracking changes",
                      },
                      tags: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description: "Tags associated with this view",
                      },
                      createdAt: {
                        type: "integer",
                      },
                      updatedAt: {
                        type: "integer",
                      },
                      archived: {
                        type: "boolean",
                        description: "Whether this view is archived",
                      },
                      archivedAt: {
                        type: "integer",
                      },
                      deletedAt: {
                        type: "integer",
                      },
                      deleted: {
                        type: "boolean",
                        description: "Whether this view is deleted",
                      },
                      maintainer: {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                          },
                          kind: {
                            type: "string",
                          },
                          maintainerMember: {
                            type: "object",
                            properties: {
                              id: {
                                type: "string",
                              },
                              email: {
                                type: "string",
                              },
                              role: {
                                type: "string",
                              },
                              firstName: {
                                type: "string",
                              },
                              lastName: {
                                type: "string",
                              },
                            },
                            required: ["email", "id", "role"],
                          },
                          maintainerTeam: {
                            type: "object",
                            properties: {
                              id: {
                                type: "string",
                              },
                              key: {
                                type: "string",
                              },
                              name: {
                                type: "string",
                              },
                            },
                            required: ["id", "key", "name"],
                          },
                        },
                        required: ["id", "kind"],
                      },
                      flagsSummary: {
                        type: "object",
                        properties: {
                          count: {
                            type: "integer",
                          },
                          linkedFlags: {
                            type: "object",
                            properties: {
                              items: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    key: {
                                      type: "string",
                                    },
                                    name: {
                                      type: "string",
                                    },
                                    links: {
                                      type: "object",
                                    },
                                  },
                                  required: ["key", "links", "name"],
                                },
                              },
                              totalCount: {
                                type: "integer",
                              },
                            },
                            required: ["items", "totalCount"],
                          },
                        },
                        required: ["count"],
                      },
                      segmentsSummary: {
                        type: "object",
                        properties: {
                          count: {
                            type: "integer",
                          },
                          linkedSegments: {
                            type: "object",
                            properties: {
                              items: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    key: {
                                      type: "string",
                                    },
                                    name: {
                                      type: "string",
                                    },
                                    environmentId: {
                                      type: "string",
                                    },
                                  },
                                  required: ["environmentId", "key", "name"],
                                },
                              },
                              totalCount: {
                                type: "integer",
                              },
                            },
                            required: ["items", "totalCount"],
                          },
                        },
                        required: ["count"],
                      },
                      metricsSummary: {
                        type: "object",
                        properties: {
                          count: {
                            type: "integer",
                          },
                        },
                        required: ["count"],
                      },
                      aiConfigsSummary: {
                        type: "object",
                        properties: {
                          count: {
                            type: "integer",
                          },
                        },
                        required: ["count"],
                      },
                      resourceSummary: {
                        type: "object",
                        properties: {
                          flagCount: {
                            type: "integer",
                          },
                          segmentCount: {
                            type: "integer",
                          },
                          metricCount: {
                            type: "integer",
                          },
                          aiConfigCount: {
                            type: "integer",
                          },
                          totalCount: {
                            type: "integer",
                          },
                        },
                        required: ["flagCount", "totalCount"],
                      },
                      flagsExpanded: {
                        type: "object",
                        properties: {
                          items: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                key: {
                                  type: "string",
                                  description:
                                    "A unique key used to reference the flag",
                                },
                                name: {
                                  type: "string",
                                  description:
                                    "A human-friendly name for the flag",
                                },
                                description: {
                                  type: "string",
                                  description: "Description of the flag",
                                },
                                creationDate: {
                                  type: "integer",
                                  description: "Creation date in milliseconds",
                                },
                                version: {
                                  type: "integer",
                                  description: "Version of the flag",
                                },
                                archived: {
                                  type: "boolean",
                                  description: "Whether the flag is archived",
                                },
                                tags: {
                                  type: "array",
                                  items: {
                                    type: "string",
                                  },
                                  description: "Tags for the flag",
                                },
                                temporary: {
                                  type: "boolean",
                                  description: "Whether the flag is temporary",
                                },
                                includeInSnippet: {
                                  type: "boolean",
                                  description: "Whether to include in snippet",
                                },
                              },
                              required: ["key", "name"],
                              description:
                                "Flag representation for Views API - contains only fields actually used by the Views service",
                            },
                          },
                          totalCount: {
                            type: "integer",
                          },
                        },
                        required: ["items", "totalCount"],
                        description:
                          "Details on linked flags for a view - requires passing the 'allFlags' expand field",
                      },
                      segmentsExpanded: {
                        type: "object",
                        properties: {
                          items: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                key: {
                                  type: "string",
                                  description:
                                    "A unique key used to reference the segment",
                                },
                                name: {
                                  type: "string",
                                  description:
                                    "A human-friendly name for the segment",
                                },
                                environmentId: {
                                  type: "string",
                                  description: "Environment ID of the segment",
                                },
                                environmentKey: {
                                  type: "string",
                                  description: "Environment key of the segment",
                                },
                                description: {
                                  type: "string",
                                  description: "Description of the segment",
                                },
                                creationDate: {
                                  type: "integer",
                                  description: "Creation date in milliseconds",
                                },
                                lastModifiedDate: {
                                  type: "integer",
                                  description:
                                    "Last modification date in milliseconds",
                                },
                                deleted: {
                                  type: "boolean",
                                  description: "Whether the segment is deleted",
                                },
                                tags: {
                                  type: "array",
                                  items: {
                                    type: "string",
                                  },
                                  description: "Tags for the segment",
                                },
                                unbounded: {
                                  type: "boolean",
                                  description:
                                    "Whether the segment is unbounded",
                                },
                                version: {
                                  type: "integer",
                                  description: "Version of the segment",
                                },
                                generation: {
                                  type: "integer",
                                  description: "Generation of the segment",
                                },
                              },
                              required: ["key", "name"],
                              description:
                                "Segment representation for Views API - contains only fields actually used by the Views service",
                            },
                          },
                          totalCount: {
                            type: "integer",
                          },
                        },
                        required: ["items", "totalCount"],
                        description:
                          "Details on linked segments for a view - requires passing the 'allSegments' expand field",
                      },
                      metricsExpanded: {
                        type: "object",
                        properties: {
                          items: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                key: {
                                  type: "string",
                                  description:
                                    "A unique key used to reference the metric",
                                },
                                name: {
                                  type: "string",
                                  description:
                                    "A human-friendly name for the metric",
                                },
                                creationDate: {
                                  type: "integer",
                                  description: "Creation date in milliseconds",
                                },
                                lastModified: {
                                  type: "integer",
                                  description:
                                    "Last modification date in milliseconds",
                                },
                                isActive: {
                                  type: "boolean",
                                  description: "Whether the metric is active",
                                },
                                eventKey: {
                                  type: "string",
                                  description: "Event key for the metric",
                                },
                                _id: {
                                  type: "string",
                                  description: "ID of the metric",
                                },
                                _versionId: {
                                  type: "string",
                                  description: "Version ID of the metric",
                                },
                                kind: {
                                  type: "string",
                                  description: "Kind of the Metric",
                                },
                                category: {
                                  type: "string",
                                  description: "Category of the Metric",
                                },
                                description: {
                                  type: "string",
                                  description: "Description of the Metric",
                                },
                                isNumeric: {
                                  type: "boolean",
                                },
                                lastSeen: {
                                  type: "integer",
                                  description: "Last seen date in milliseconds",
                                },
                              },
                              description:
                                "Metric representation for Views API - contains only fields actually used by the Views service",
                            },
                          },
                          totalCount: {
                            type: "integer",
                          },
                        },
                        required: ["items", "totalCount"],
                      },
                      aiConfigsExpanded: {
                        type: "object",
                        properties: {
                          items: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                key: {
                                  type: "string",
                                  description:
                                    "A unique key used to reference the AI config",
                                },
                                name: {
                                  type: "string",
                                  description:
                                    "A human-friendly name for the AI config",
                                },
                                tags: {
                                  type: "array",
                                  items: {
                                    type: "string",
                                  },
                                  description: "Tags for the AI config",
                                },
                                description: {
                                  type: "string",
                                  description: "Description of the AI config",
                                },
                                version: {
                                  type: "integer",
                                  description: "Version of the AI config",
                                },
                                createdAt: {
                                  type: "integer",
                                  description: "Creation date in milliseconds",
                                },
                                updatedAt: {
                                  type: "integer",
                                  description:
                                    "Last modification date in milliseconds",
                                },
                                flagKey: {
                                  type: "string",
                                  description:
                                    "Key of the flag that this AI config is attached to",
                                },
                              },
                              description:
                                "AI Config representation for Views API - contains only fields actually used by the Views service",
                            },
                          },
                          totalCount: {
                            type: "integer",
                          },
                        },
                        required: ["items", "totalCount"],
                      },
                      resourcesExpanded: {
                        type: "object",
                        properties: {
                          items: {
                            type: "object",
                            properties: {
                              flags: {
                                type: "object",
                                properties: {
                                  items: {
                                    type: "array",
                                    items: {
                                      type: "object",
                                    },
                                  },
                                  totalCount: {
                                    type: "integer",
                                  },
                                },
                                required: ["items", "totalCount"],
                              },
                              segments: {
                                type: "object",
                                properties: {
                                  items: {
                                    type: "array",
                                    items: {
                                      type: "object",
                                    },
                                  },
                                  totalCount: {
                                    type: "integer",
                                  },
                                },
                                required: ["items", "totalCount"],
                              },
                              aiConfigs: {
                                type: "object",
                                properties: {
                                  items: {
                                    type: "array",
                                    items: {
                                      type: "object",
                                    },
                                  },
                                  totalCount: {
                                    type: "integer",
                                  },
                                },
                                required: ["items", "totalCount"],
                              },
                              metrics: {
                                type: "object",
                                properties: {
                                  items: {
                                    type: "array",
                                    items: {
                                      type: "object",
                                    },
                                  },
                                  totalCount: {
                                    type: "integer",
                                  },
                                },
                                required: ["items", "totalCount"],
                              },
                            },
                            required: ["flags"],
                          },
                          totalCount: {
                            type: "integer",
                          },
                        },
                        required: ["items", "totalCount"],
                        description:
                          "Details on linked resources for a view - requires passing the 'allResources' expand field",
                      },
                    },
                    required: [
                      "accountId",
                      "archived",
                      "createdAt",
                      "deleted",
                      "description",
                      "generateSdkKeys",
                      "id",
                      "key",
                      "name",
                      "projectId",
                      "projectKey",
                      "tags",
                      "updatedAt",
                      "version",
                    ],
                  },
                },
              },
            },
            required: ["_links", "linkedAt", "resourceKey", "resourceType"],
          },
        },
        totalCount: {
          type: "integer",
        },
      },
      required: ["items", "totalCount"],
    },
    failedResources: {
      type: "array",
      items: {
        type: "object",
        properties: {
          resourceKey: {
            type: "string",
            description: "The key of the resource that failed to link.",
          },
          environmentId: {
            type: "string",
            description:
              "Environment ID of the resource (only present for segments)",
          },
          resourceType: {
            type: "string",
            enum: ["flag", "segment", "metric", "aiConfig"],
            description: "The type of the resource that failed to link.",
          },
          errorMessage: {
            type: "string",
            description: "The reason why linking this resource failed.",
          },
        },
        required: ["errorMessage", "resourceKey", "resourceType"],
      },
      description: "Details of resources that failed to link.",
    },
  },
  required: ["failureCount", "successCount"],
};

export default {
  name: "Create Projects Views Link",
  description: "Creates create projects views link in LaunchDarkly",
  category: "Views",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, viewKey, resourceType, ...inputData } =
          input.event.inputConfig;
        const endpoint = `/api/v2/projects/${projectKey}/views/${viewKey}/link/${resourceType}`;

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
