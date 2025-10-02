import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Engineering Insights Deployments2
const inputSchema: Record<string, AppBlockConfigField> = {
  deploymentID: {
    name: "Deployment I D",
    description: "The deployment ID",
    type: "string",
    required: true,
  },
  expand: {
    name: "Expand",
    description:
      "Expand properties in response. Options: `pullRequests`, `flagReferences`",
    type: "string",
    required: false,
  },
};

// Output schema for Get Engineering Insights Deployments2
const outputSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "The deployment ID",
    },
    applicationKey: {
      type: "string",
      description: "The application key",
    },
    applicationVersion: {
      type: "string",
      description: "The application version",
    },
    startedAt: {
      type: "integer",
      description: "The time the deployment started",
    },
    endedAt: {
      type: "integer",
      description: "The time the deployment ended",
    },
    durationMs: {
      type: "integer",
      description: "The duration of the deployment in milliseconds",
    },
    status: {
      type: "string",
      description: "The status of the deployment",
    },
    kind: {
      type: "string",
      description: "The kind of deployment",
    },
    active: {
      type: "boolean",
      description: "Whether the deployment is active",
    },
    metadata: {
      type: "object",
      description: "The metadata associated with the deployment",
      additionalProperties: true,
    },
    archived: {
      type: "boolean",
      description: "Whether the deployment is archived",
    },
    environmentKey: {
      type: "string",
      description: "The environment key",
    },
    numberOfContributors: {
      type: "integer",
      description: "The number of contributors",
    },
    numberOfPullRequests: {
      type: "integer",
      description: "The number of pull requests",
    },
    linesAdded: {
      type: "integer",
      description: "The number of lines added",
    },
    linesDeleted: {
      type: "integer",
      description: "The number of lines deleted",
    },
    leadTime: {
      type: "integer",
      description:
        "The total lead time from first commit to deployment end in milliseconds",
    },
    pullRequests: {
      type: "object",
      properties: {
        totalCount: {
          type: "integer",
          description: "The total number of pull requests",
        },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "The pull request internal ID",
              },
              externalId: {
                type: "string",
                description: "The pull request number",
              },
              status: {
                type: "string",
                description: "The pull request status",
              },
              author: {
                type: "string",
                description: "The pull request author",
              },
              createTime: {
                type: "integer",
                description: "The pull request create time",
              },
              mergeTime: {
                type: "integer",
                description: "The pull request merge time",
              },
              mergeCommitKey: {
                type: "string",
                description: "The pull request merge commit key",
              },
              baseCommitKey: {
                type: "string",
                description: "The pull request base commit key",
              },
              headCommitKey: {
                type: "string",
                description: "The pull request head commit key",
              },
              filesChanged: {
                type: "integer",
                description: "The number of files changed",
              },
              linesAdded: {
                type: "integer",
                description: "The number of lines added",
              },
              linesDeleted: {
                type: "integer",
                description: "The number of lines deleted",
              },
              url: {
                type: "string",
                description: "The pull request URL",
              },
              deployments: {
                type: "object",
                properties: {
                  totalCount: {
                    type: "integer",
                    description: "The total number of deployments",
                  },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                    },
                    description: "A list of deployments",
                  },
                  _links: {
                    type: "object",
                    description:
                      "The location and content type of related resources",
                    additionalProperties: true,
                  },
                },
                required: ["totalCount", "items"],
                description:
                  "A list of deployments associated with the pull request",
              },
              flagReferences: {
                type: "object",
                properties: {
                  totalCount: {
                    type: "integer",
                    description: "The total number of flag references",
                  },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        projectKey: {
                          type: "string",
                          description: "The project key",
                        },
                        flagKey: {
                          type: "string",
                          description: "The flag key",
                        },
                        referencesAdded: {
                          type: "integer",
                          description: "The number of references added",
                        },
                        referencesRemoved: {
                          type: "integer",
                          description: "The number of references removed",
                        },
                      },
                      required: [
                        "projectKey",
                        "flagKey",
                        "referencesAdded",
                        "referencesRemoved",
                      ],
                    },
                    description: "A list of flag references",
                  },
                },
                required: ["totalCount", "items"],
                description:
                  "A list of flag references associated with the pull request",
              },
              leadTime: {
                type: "object",
                properties: {
                  codingDurationMs: {
                    type: "integer",
                    description: "The coding duration in milliseconds",
                  },
                  reviewDurationMs: {
                    type: "integer",
                    description: "The review duration in milliseconds",
                  },
                  maxWaitDurationMs: {
                    type: "integer",
                    description:
                      "The max wait duration between merge time and deploy start time in milliseconds",
                  },
                  avgWaitDurationMs: {
                    type: "integer",
                    description:
                      "The average wait duration between merge time and deploy start time in milliseconds",
                  },
                  maxDeployDurationMs: {
                    type: "integer",
                    description: "The max deploy duration in milliseconds",
                  },
                  avgDeployDurationMs: {
                    type: "integer",
                    description: "The average deploy duration in milliseconds",
                  },
                  maxTotalLeadTimeMs: {
                    type: "integer",
                    description: "The max total lead time in milliseconds",
                  },
                  avgTotalLeadTimeMs: {
                    type: "integer",
                    description: "The average total lead time in milliseconds",
                  },
                },
                required: ["codingDurationMs"],
                description:
                  "The lead time for the pull request in a given environment",
              },
            },
            required: [
              "id",
              "externalId",
              "status",
              "author",
              "createTime",
              "baseCommitKey",
              "headCommitKey",
              "filesChanged",
              "linesAdded",
              "linesDeleted",
              "url",
            ],
          },
          description: "A list of pull requests",
        },
        _links: {
          type: "object",
          description: "The location and content type of related resources",
          additionalProperties: true,
        },
      },
      required: ["totalCount", "items"],
      description: "The pull requests contained in the deployment",
    },
    flagReferences: {
      type: "object",
      required: [],
      description: "The flag references contained in the deployment",
    },
    leadTimeStages: {
      type: "object",
      properties: {
        codingDurationMs: {
          type: "integer",
          description: "The coding duration in milliseconds",
        },
        reviewDurationMs: {
          type: "integer",
          description: "The review duration in milliseconds",
        },
        waitDurationMs: {
          type: "integer",
          description:
            "The wait duration between merge time and deploy start time in milliseconds",
        },
        deployDurationMs: {
          type: "integer",
          description: "The deploy duration in milliseconds",
        },
        totalLeadTimeMs: {
          type: "integer",
          description: "The total lead time in milliseconds",
        },
      },
      required: ["codingDurationMs"],
      description: "The lead time stages for the deployment",
    },
  },
  required: [
    "id",
    "applicationKey",
    "applicationVersion",
    "startedAt",
    "status",
    "kind",
    "active",
    "archived",
    "environmentKey",
    "numberOfContributors",
    "numberOfPullRequests",
    "linesAdded",
    "linesDeleted",
    "leadTime",
  ],
};

export default {
  name: "Get Engineering Insights Deployments2",
  description:
    "Retrieves get engineering insights deployments2 in LaunchDarkly",
  category: "Insights deployments",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { deploymentID } = input.event.inputConfig;
        const endpoint = `/api/v2/engineering-insights/deployments/${deploymentID}`;

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
