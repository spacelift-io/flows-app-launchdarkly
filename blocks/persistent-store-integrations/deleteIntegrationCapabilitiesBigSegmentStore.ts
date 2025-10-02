import {
  AppBlock,
  events,
  EventInput,
  AppBlockConfigField,
} from "@slflows/sdk/v1";
import { makeLaunchDarklyApiRequest } from "../../utils/apiHelpers.ts";

// Input schema for Delete Integration Capabilities Big Segment Store
const inputSchema: Record<string, AppBlockConfigField> = {
  environmentKey: {
    name: "Environment Key",
    description: "The environment key",
    type: "string",
    required: true,
  },
  integrationId: {
    name: "Integration Id",
    description: "The integration ID",
    type: "string",
    required: true,
  },
  integrationKey: {
    name: "Integration Key",
    description: "The integration key, either `redis` or `dynamodb`",
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

// Output schema for Delete Integration Capabilities Big Segment Store
const outputSchema = {};

export default {
  name: "Delete Integration Capabilities Big Segment Store",
  description:
    "Deletes delete integration capabilities big segment store in LaunchDarkly",
  category: "Persistent store integrations",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, environmentKey, integrationKey, integrationId } =
          input.event.inputConfig;
        const endpoint = `/api/v2/integration-capabilities/big-segment-store/${projectKey}/${environmentKey}/${integrationKey}/${integrationId}`;

        const apiKey = input.app.config.apiKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        await events.emit(
          await makeLaunchDarklyApiRequest(apiKey, baseUrl, endpoint, {
            method: "DELETE",
          }),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
