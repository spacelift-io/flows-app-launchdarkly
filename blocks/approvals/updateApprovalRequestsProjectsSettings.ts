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

// Input schema for Update Approval Requests Projects Settings
const inputSchema: Record<string, AppBlockConfigField> = {
  environmentKey: {
    name: "Environment Key",
    description: "",
    type: "string",
    required: true,
  },
  projectKey: {
    name: "Project Key",
    description: "",
    type: "string",
    required: true,
  },
  resourceKind: {
    name: "Resource Kind",
    description: "",
    type: "string",
    required: true,
  },
  autoApplyApprovedChanges: {
    name: "Auto Apply Approved Changes",
    description:
      "Automatically apply changes that have been approved by all reviewers. This field is only applicable for approval services other than LaunchDarkly.\n",
    type: "boolean",
    required: false,
  },
  bypassApprovalsForPendingChanges: {
    name: "Bypass Approvals For Pending Changes",
    description: "Whether to skip approvals for pending changes",
    type: "boolean",
    required: false,
  },
  canApplyDeclinedChanges: {
    name: "Can Apply Declined Changes",
    description:
      "Allow applying the change as long as at least one person has approved",
    type: "boolean",
    required: false,
  },
  canReviewOwnRequest: {
    name: "Can Review Own Request",
    description:
      "Allow someone who makes an approval request to apply their own change",
    type: "boolean",
    required: false,
  },
  minNumApprovals: {
    name: "Min Num Approvals",
    description:
      "Sets the amount of approvals required before a member can apply a change. The minimum is one and the maximum is five.\n",
    type: "number",
    required: false,
  },
  required: {
    name: "Required",
    description: "",
    type: {
      type: "array",
      items: {
        type: "object",
      },
    },
    required: false,
  },
  requiredApprovalTags: {
    name: "Required Approval Tags",
    description:
      "Require approval only on flags with the provided tags. Otherwise all flags will require approval.\n",
    type: ["string"],
    required: false,
  },
  serviceConfig: {
    name: "Service Config",
    description: "Arbitrary service-specific configuration",
    type: {
      type: "object",
    },
    required: false,
  },
  serviceKind: {
    name: "Service Kind",
    description: "Which service to use for managing approvals",
    type: "string",
    required: false,
  },
  serviceKindConfigurationId: {
    name: "Service Kind Configuration Id",
    description:
      "Optional integration configuration ID of a custom approval integration. This is an Enterprise-only feature.\n",
    type: "string",
    required: false,
  },
};

// Output schema for Update Approval Requests Projects Settings
const outputSchema = {
  type: "object",
  additionalProperties: true,
};

export default {
  name: "Update Approval Requests Projects Settings",
  description:
    "Updates update approval requests projects settings in LaunchDarkly",
  category: "Approvals",

  inputs: {
    default: {
      config: inputSchema,
      onEvent: async (input: EventInput) => {
        const { projectKey, ...inputData } = input.event.inputConfig;
        const endpoint = `/api/v2/approval-requests/projects/${projectKey}/settings`;

        const apiKey = input.app.config.apiKey as string;
        const baseUrl = input.app.config.baseUrl as string;

        await events.emit(
          await makeLaunchDarklyApiRequest(apiKey, baseUrl, endpoint, {
            method: "PATCH",
            body: filterDefinedParams(inputData),
          }),
        );
      },
    },
  },

  outputs: { default: { default: true, type: outputSchema } },
} as AppBlock;
