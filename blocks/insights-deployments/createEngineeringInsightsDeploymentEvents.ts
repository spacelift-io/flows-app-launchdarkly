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

// Input schema for Create Engineering Insights Deployment Events
const inputSchema: Record<string, AppBlockConfigField> = {
  applicationKey: {
    name: "Application Key",
    description:
      "The application key. This defines the granularity at which you want to view your insights metrics. Typically it is the name of one of the GitHub repositories that you use in this project.<br/><br/>LaunchDarkly automatically creates a new application each time you send a unique application key.",
    type: "string",
    required: true,
  },
  environmentKey: {
    name: "Environment Key",
    description: "The environment key",
    type: "string",
    required: true,
  },
  eventType: {
    name: "Event Type",
    description: "The event type",
    type: "string",
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "The project key",
    type: "string",
    required: true,
  },
  version: {
    name: "Version",
    description:
      "The application version. You can set the application version to any string that includes only letters, numbers, periods (<code>.</code>), hyphens (<code>-</code>), or underscores (<code>_</code>).<br/><br/>We recommend setting the application version to at least the first seven characters of the SHA or to the tag of the GitHub commit for this deployment.",
    type: "string",
    required: true,
  },
  applicationKind: {
    name: "Application Kind",
    description: "The kind of application. Default: <code>server</code>",
    type: "string",
    required: false,
  },
  applicationName: {
    name: "Application Name",
    description:
      "The application name. This defines how the application is displayed",
    type: "string",
    required: false,
  },
  deploymentMetadata: {
    name: "Deployment Metadata",
    description: "A JSON object containing metadata about the deployment",
    type: {
      type: "object",
    },
    required: false,
  },
  eventMetadata: {
    name: "Event Metadata",
    description: "A JSON object containing metadata about the event",
    type: {
      type: "object",
    },
    required: false,
  },
  eventTime: {
    name: "Event Time",
    description:
      "The time, in Unix milliseconds, when the event occurred. If not included, the time will default to when the event is processed and stored in LaunchDarkly.",
    type: "number",
    required: false,
  },
  versionName: {
    name: "Version Name",
    description: "The version name. This defines how the version is displayed",
    type: "string",
    required: false,
  },
};

// Output schema for Create Engineering Insights Deployment Events
const outputSchema = {};

export default {
  name: "Create Engineering Insights Deployment Events",
  description:
    "Creates create engineering insights deployment events in LaunchDarkly",
  category: "Insights deployments",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const inputData = input.event.inputConfig;
        const endpoint = `/api/v2/engineering-insights/deployment-events`;

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
