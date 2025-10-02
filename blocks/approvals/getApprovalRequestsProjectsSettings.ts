import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Get Approval Requests Projects Settings
const inputSchema: Record<string, AppBlockConfigField> = {
  projectKey: {
    name: "Project Key",
    description: "",
    type: "string",
    required: true,
  },
  environmentKey: {
    name: "Environment Key",
    description:
      "An environment key filter to apply to the approval request settings.",
    type: "string",
    required: false,
  },
  expand: {
    name: "Expand",
    description:
      "A comma-separated list of fields to expand in the response. Options include 'default' and 'strict'.",
    type: "string",
    required: false,
  },
  resourceKind: {
    name: "Resource Kind",
    description:
      "A resource kind filter to apply to the approval request settings.",
    type: "string",
    required: false,
  },
};

// Output schema for Get Approval Requests Projects Settings
const outputSchema = {
  type: "object",
  additionalProperties: true,
};

export default {
  name: "Get Approval Requests Projects Settings",
  description:
    "Retrieves get approval requests projects settings in LaunchDarkly",
  category: "Approvals",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey } = input.event.inputConfig;
        const endpoint = `/api/v2/approval-requests/projects/${projectKey}/settings`;

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
