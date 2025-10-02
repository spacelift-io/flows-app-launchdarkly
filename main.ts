import { defineApp } from "@slflows/sdk/v1";
import { blocks } from "./blocks/index.ts";

export const app = defineApp({
  name: "LaunchDarkly",
  installationInstructions:
    "LaunchDarkly feature management platform integration.\n\nTo install:\n1. Create an API access token in LaunchDarkly (Settings > Authorization)\n2. Add your API token\n3. Configure the base URL (defaults to https://app.launchdarkly.com)\n4. Start using the blocks in your flows",

  blocks,

  config: {
    apiKey: {
      name: "API Key",
      description: "Your LaunchDarkly API access token",
      type: "string",
      required: true,
      sensitive: true,
    },
    baseUrl: {
      name: "Base URL",
      description: "LaunchDarkly API base URL",
      type: "string",
      required: false,
      default: "https://app.launchdarkly.com",
    },
  },
});
