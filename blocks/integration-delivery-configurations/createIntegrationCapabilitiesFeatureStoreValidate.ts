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

// Input schema for Create Integration Capabilities Feature Store Validate
const inputSchema: Record<string, AppBlockConfigField> = {
  environmentKey: {
    name: "Environment Key",
    description: "The environment key",
    type: "string",
    required: true,
  },
  id: {
    name: "Id",
    description: "The configuration ID",
    type: "string",
    required: true,
  },
  integrationKey: {
    name: "Integration Key",
    description: "The integration key",
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

// Output schema for Create Integration Capabilities Feature Store Validate
const outputSchema = {
  type: "object",
  properties: {
    statusCode: {
      type: "integer",
      description: "The status code returned by the validation",
    },
    error: {
      type: "string",
    },
    timestamp: {
      type: "integer",
      description: "Timestamp of when the validation was performed",
    },
    responseBody: {
      type: "string",
      description: "JSON response to the validation request",
    },
  },
};

export default {
  name: "Create Integration Capabilities Feature Store Validate",
  description:
    "Creates create integration capabilities feature store validate in LaunchDarkly",
  category: "Integration delivery configurations",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, environmentKey, integrationKey, id, ...inputData } =
          input.event.inputConfig;
        const endpoint = `/api/v2/integration-capabilities/featureStore/${projectKey}/${environmentKey}/${integrationKey}/${id}/validate`;

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
