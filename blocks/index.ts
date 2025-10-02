import createProjectsAiConfigs from "./ai-configs/createProjectsAiConfigs.ts";
import createProjectsAiConfigsModelConfigs from "./ai-configs/createProjectsAiConfigsModelConfigs.ts";
import createProjectsAiConfigsModelConfigsRestricted from "./ai-configs/createProjectsAiConfigsModelConfigsRestricted.ts";
import createProjectsAiConfigsVariations from "./ai-configs/createProjectsAiConfigsVariations.ts";
import createProjectsAiTools from "./ai-configs/createProjectsAiTools.ts";
import deleteProjectsAiConfigs from "./ai-configs/deleteProjectsAiConfigs.ts";
import deleteProjectsAiConfigsModelConfigs from "./ai-configs/deleteProjectsAiConfigsModelConfigs.ts";
import deleteProjectsAiConfigsModelConfigsRestricted from "./ai-configs/deleteProjectsAiConfigsModelConfigsRestricted.ts";
import deleteProjectsAiConfigsVariations from "./ai-configs/deleteProjectsAiConfigsVariations.ts";
import deleteProjectsAiTools from "./ai-configs/deleteProjectsAiTools.ts";
import getProjectsAiConfigs from "./ai-configs/getProjectsAiConfigs.ts";
import getProjectsAiConfigs2 from "./ai-configs/getProjectsAiConfigs2.ts";
import getProjectsAiConfigsMetrics from "./ai-configs/getProjectsAiConfigsMetrics.ts";
import getProjectsAiConfigsMetricsByVariation from "./ai-configs/getProjectsAiConfigsMetricsByVariation.ts";
import getProjectsAiConfigsModelConfigs from "./ai-configs/getProjectsAiConfigsModelConfigs.ts";
import getProjectsAiConfigsModelConfigs2 from "./ai-configs/getProjectsAiConfigsModelConfigs2.ts";
import getProjectsAiConfigsTargeting from "./ai-configs/getProjectsAiConfigsTargeting.ts";
import getProjectsAiConfigsVariations from "./ai-configs/getProjectsAiConfigsVariations.ts";
import getProjectsAiTools from "./ai-configs/getProjectsAiTools.ts";
import getProjectsAiTools2 from "./ai-configs/getProjectsAiTools2.ts";
import getProjectsAiToolsVersions from "./ai-configs/getProjectsAiToolsVersions.ts";
import updateProjectsAiConfigs from "./ai-configs/updateProjectsAiConfigs.ts";
import updateProjectsAiConfigsTargeting from "./ai-configs/updateProjectsAiConfigsTargeting.ts";
import updateProjectsAiConfigsVariations from "./ai-configs/updateProjectsAiConfigsVariations.ts";
import updateProjectsAiTools from "./ai-configs/updateProjectsAiTools.ts";
import createTokens from "./access-tokens/createTokens.ts";
import createTokensReset from "./access-tokens/createTokensReset.ts";
import deleteTokens from "./access-tokens/deleteTokens.ts";
import listTokens from "./access-tokens/listTokens.ts";
import listTokens2 from "./access-tokens/listTokens2.ts";
import updateTokens from "./access-tokens/updateTokens.ts";
import createMembers from "./account-members/createMembers.ts";
import createMembersTeams from "./account-members/createMembersTeams.ts";
import deleteMembers from "./account-members/deleteMembers.ts";
import listMembers from "./account-members/listMembers.ts";
import listMembers2 from "./account-members/listMembers2.ts";
import updateMembers from "./account-members/updateMembers.ts";
import updateMembers2 from "./account-members/updateMembers2.ts";
import getUsageClientsideContexts from "./account-usage/getUsageClientsideContexts.ts";
import getUsageDataExportEvents from "./account-usage/getUsageDataExportEvents.ts";
import getUsageEvaluations from "./account-usage/getUsageEvaluations.ts";
import getUsageEvents from "./account-usage/getUsageEvents.ts";
import getUsageExperimentationEvents from "./account-usage/getUsageExperimentationEvents.ts";
import getUsageExperimentationKeys from "./account-usage/getUsageExperimentationKeys.ts";
import getUsageMau from "./account-usage/getUsageMau.ts";
import getUsageMauBycategory from "./account-usage/getUsageMauBycategory.ts";
import getUsageMauSdks from "./account-usage/getUsageMauSdks.ts";
import getUsageObservabilityErrors from "./account-usage/getUsageObservabilityErrors.ts";
import getUsageObservabilityLogs from "./account-usage/getUsageObservabilityLogs.ts";
import getUsageObservabilitySessions from "./account-usage/getUsageObservabilitySessions.ts";
import getUsageObservabilityTraces from "./account-usage/getUsageObservabilityTraces.ts";
import getUsageServersideContexts from "./account-usage/getUsageServersideContexts.ts";
import getUsageServiceConnections from "./account-usage/getUsageServiceConnections.ts";
import getUsageStreams from "./account-usage/getUsageStreams.ts";
import getUsageStreamsBysdkversion from "./account-usage/getUsageStreamsBysdkversion.ts";
import getUsageStreamsSdkversions from "./account-usage/getUsageStreamsSdkversions.ts";
import getUsageTotalContexts from "./account-usage/getUsageTotalContexts.ts";
import createAnnouncements from "./announcements/createAnnouncements.ts";
import deleteAnnouncements from "./announcements/deleteAnnouncements.ts";
import listAnnouncements from "./announcements/listAnnouncements.ts";
import updateAnnouncements from "./announcements/updateAnnouncements.ts";
import deleteApplications from "./applications/deleteApplications.ts";
import deleteApplicationsVersions from "./applications/deleteApplicationsVersions.ts";
import getApplicationsVersions from "./applications/getApplicationsVersions.ts";
import listApplications from "./applications/listApplications.ts";
import listApplications2 from "./applications/listApplications2.ts";
import updateApplications from "./applications/updateApplications.ts";
import updateApplicationsVersions from "./applications/updateApplicationsVersions.ts";
import createApprovalRequests from "./approvals/createApprovalRequests.ts";
import createApprovalRequestsApply from "./approvals/createApprovalRequestsApply.ts";
import createApprovalRequestsReviews from "./approvals/createApprovalRequestsReviews.ts";
import createProjectsFlagsEnvironmentsApprovalRequests from "./approvals/createProjectsFlagsEnvironmentsApprovalRequests.ts";
import createProjectsFlagsEnvironmentsApprovalRequestsApply from "./approvals/createProjectsFlagsEnvironmentsApprovalRequestsApply.ts";
import createProjectsFlagsEnvironmentsApprovalRequestsFlagCopy from "./approvals/createProjectsFlagsEnvironmentsApprovalRequestsFlagCopy.ts";
import createProjectsFlagsEnvironmentsApprovalRequestsReviews from "./approvals/createProjectsFlagsEnvironmentsApprovalRequestsReviews.ts";
import deleteApprovalRequests from "./approvals/deleteApprovalRequests.ts";
import deleteProjectsFlagsEnvironmentsApprovalRequests from "./approvals/deleteProjectsFlagsEnvironmentsApprovalRequests.ts";
import getApprovalRequestsProjectsSettings from "./approvals/getApprovalRequestsProjectsSettings.ts";
import getProjectsFlagsEnvironmentsApprovalRequests from "./approvals/getProjectsFlagsEnvironmentsApprovalRequests.ts";
import getProjectsFlagsEnvironmentsApprovalRequests2 from "./approvals/getProjectsFlagsEnvironmentsApprovalRequests2.ts";
import listApprovalRequests from "./approvals/listApprovalRequests.ts";
import listApprovalRequests2 from "./approvals/listApprovalRequests2.ts";
import updateApprovalRequests from "./approvals/updateApprovalRequests.ts";
import updateApprovalRequestsProjectsSettings from "./approvals/updateApprovalRequestsProjectsSettings.ts";
import updateProjectsFlagsEnvironmentsApprovalRequests from "./approvals/updateProjectsFlagsEnvironmentsApprovalRequests.ts";
import createAuditlog from "./audit-log/createAuditlog.ts";
import listAuditlog from "./audit-log/listAuditlog.ts";
import listAuditlog2 from "./audit-log/listAuditlog2.ts";
import createCodeRefsRepositories from "./code-references/createCodeRefsRepositories.ts";
import createCodeRefsRepositoriesBranchDeleteTasks from "./code-references/createCodeRefsRepositoriesBranchDeleteTasks.ts";
import createCodeRefsRepositoriesBranchesExtinctionEvents from "./code-references/createCodeRefsRepositoriesBranchesExtinctionEvents.ts";
import deleteCodeRefsRepositories from "./code-references/deleteCodeRefsRepositories.ts";
import getCodeRefsExtinctions from "./code-references/getCodeRefsExtinctions.ts";
import getCodeRefsRepositories from "./code-references/getCodeRefsRepositories.ts";
import getCodeRefsRepositories2 from "./code-references/getCodeRefsRepositories2.ts";
import getCodeRefsRepositoriesBranches from "./code-references/getCodeRefsRepositoriesBranches.ts";
import getCodeRefsRepositoriesBranches2 from "./code-references/getCodeRefsRepositoriesBranches2.ts";
import getCodeRefsStatistics from "./code-references/getCodeRefsStatistics.ts";
import getCodeRefsStatistics2 from "./code-references/getCodeRefsStatistics2.ts";
import updateCodeRefsRepositories from "./code-references/updateCodeRefsRepositories.ts";
import updateCodeRefsRepositoriesBranches from "./code-references/updateCodeRefsRepositoriesBranches.ts";
import updateProjectsEnvironmentsContextsFlags from "./context-settings/updateProjectsEnvironmentsContextsFlags.ts";
import createProjectsEnvironmentsContextInstancesSearch from "./contexts/createProjectsEnvironmentsContextInstancesSearch.ts";
import createProjectsEnvironmentsContextsSearch from "./contexts/createProjectsEnvironmentsContextsSearch.ts";
import createProjectsEnvironmentsFlagsEvaluate from "./contexts/createProjectsEnvironmentsFlagsEvaluate.ts";
import deleteProjectsEnvironmentsContextInstances from "./contexts/deleteProjectsEnvironmentsContextInstances.ts";
import getProjectsContextKinds from "./contexts/getProjectsContextKinds.ts";
import getProjectsEnvironmentsContextAttributes from "./contexts/getProjectsEnvironmentsContextAttributes.ts";
import getProjectsEnvironmentsContextAttributes2 from "./contexts/getProjectsEnvironmentsContextAttributes2.ts";
import getProjectsEnvironmentsContextInstances from "./contexts/getProjectsEnvironmentsContextInstances.ts";
import getProjectsEnvironmentsContexts from "./contexts/getProjectsEnvironmentsContexts.ts";
import updateProjectsContextKinds from "./contexts/updateProjectsContextKinds.ts";
import createRoles from "./custom-roles/createRoles.ts";
import deleteRoles from "./custom-roles/deleteRoles.ts";
import listRoles from "./custom-roles/listRoles.ts";
import listRoles2 from "./custom-roles/listRoles2.ts";
import updateRoles from "./custom-roles/updateRoles.ts";
import createDestinations from "./data-export-destinations/createDestinations.ts";
import createDestinationsGenerateWarehouseDestinationKeyPair from "./data-export-destinations/createDestinationsGenerateWarehouseDestinationKeyPair.ts";
import deleteDestinations from "./data-export-destinations/deleteDestinations.ts";
import listDestinations from "./data-export-destinations/listDestinations.ts";
import listDestinations2 from "./data-export-destinations/listDestinations2.ts";
import updateDestinations from "./data-export-destinations/updateDestinations.ts";
import createProjectsEnvironments from "./environments/createProjectsEnvironments.ts";
import createProjectsEnvironmentsApiKey from "./environments/createProjectsEnvironmentsApiKey.ts";
import createProjectsEnvironmentsMobileKey from "./environments/createProjectsEnvironmentsMobileKey.ts";
import deleteProjectsEnvironments from "./environments/deleteProjectsEnvironments.ts";
import getProjectsEnvironments from "./environments/getProjectsEnvironments.ts";
import getProjectsEnvironments2 from "./environments/getProjectsEnvironments2.ts";
import updateProjectsEnvironments from "./environments/updateProjectsEnvironments.ts";
import createProjectsEnvironmentsExperiments from "./experiments/createProjectsEnvironmentsExperiments.ts";
import createProjectsEnvironmentsExperimentsIterations from "./experiments/createProjectsEnvironmentsExperimentsIterations.ts";
import getProjectsEnvironmentsExperiments from "./experiments/getProjectsEnvironmentsExperiments.ts";
import getProjectsEnvironmentsExperiments2 from "./experiments/getProjectsEnvironmentsExperiments2.ts";
import getProjectsExperimentationSettings from "./experiments/getProjectsExperimentationSettings.ts";
import updateProjectsEnvironmentsExperiments from "./experiments/updateProjectsEnvironmentsExperiments.ts";
import updateProjectsExperimentationSettings from "./experiments/updateProjectsExperimentationSettings.ts";
import createFlags from "./feature-flags/createFlags.ts";
import createFlagsCopy from "./feature-flags/createFlagsCopy.ts";
import createProjectsFlagsEnvironmentsMigrationSafetyIssues from "./feature-flags/createProjectsFlagsEnvironmentsMigrationSafetyIssues.ts";
import deleteFlags from "./feature-flags/deleteFlags.ts";
import getFlagsDependentFlags from "./feature-flags/getFlagsDependentFlags.ts";
import getFlagsDependentFlags2 from "./feature-flags/getFlagsDependentFlags2.ts";
import getFlagsExpiringTargets from "./feature-flags/getFlagsExpiringTargets.ts";
import getFlagsExpiringUserTargets from "./feature-flags/getFlagsExpiringUserTargets.ts";
import listFlagStatus from "./feature-flags/listFlagStatus.ts";
import listFlagStatuses from "./feature-flags/listFlagStatuses.ts";
import listFlagStatuses2 from "./feature-flags/listFlagStatuses2.ts";
import listFlags from "./feature-flags/listFlags.ts";
import listFlags2 from "./feature-flags/listFlags2.ts";
import updateFlags from "./feature-flags/updateFlags.ts";
import updateFlagsExpiringTargets from "./feature-flags/updateFlagsExpiringTargets.ts";
import updateFlagsExpiringUserTargets from "./feature-flags/updateFlagsExpiringUserTargets.ts";
import createIntegrationCapabilitiesFlagImport from "./flag-import-configurations/createIntegrationCapabilitiesFlagImport.ts";
import createIntegrationCapabilitiesFlagImportTrigger from "./flag-import-configurations/createIntegrationCapabilitiesFlagImportTrigger.ts";
import deleteIntegrationCapabilitiesFlagImport from "./flag-import-configurations/deleteIntegrationCapabilitiesFlagImport.ts";
import getIntegrationCapabilitiesFlagImport from "./flag-import-configurations/getIntegrationCapabilitiesFlagImport.ts";
import getIntegrationCapabilitiesFlagImport2 from "./flag-import-configurations/getIntegrationCapabilitiesFlagImport2.ts";
import updateIntegrationCapabilitiesFlagImport from "./flag-import-configurations/updateIntegrationCapabilitiesFlagImport.ts";
import createFlagLinksProjectsFlags from "./flag-links/createFlagLinksProjectsFlags.ts";
import deleteFlagLinksProjectsFlags from "./flag-links/deleteFlagLinksProjectsFlags.ts";
import getFlagLinksProjectsFlags from "./flag-links/getFlagLinksProjectsFlags.ts";
import updateFlagLinksProjectsFlags from "./flag-links/updateFlagLinksProjectsFlags.ts";
import createFlagsTriggers from "./flag-triggers/createFlagsTriggers.ts";
import deleteFlagsTriggers from "./flag-triggers/deleteFlagsTriggers.ts";
import getFlagsTriggers from "./flag-triggers/getFlagsTriggers.ts";
import getFlagsTriggers2 from "./flag-triggers/getFlagsTriggers2.ts";
import updateFlagsTriggers from "./flag-triggers/updateFlagsTriggers.ts";
import deleteProjectsFlagsEnvironmentsFollowers from "./follow-flags/deleteProjectsFlagsEnvironmentsFollowers.ts";
import getProjectsEnvironmentsFollowers from "./follow-flags/getProjectsEnvironmentsFollowers.ts";
import getProjectsFlagsEnvironmentsFollowers from "./follow-flags/getProjectsFlagsEnvironmentsFollowers.ts";
import updateProjectsFlagsEnvironmentsFollowers from "./follow-flags/updateProjectsFlagsEnvironmentsFollowers.ts";
import createProjectsEnvironmentsHoldouts from "./holdouts/createProjectsEnvironmentsHoldouts.ts";
import getProjectsEnvironmentsHoldouts from "./holdouts/getProjectsEnvironmentsHoldouts.ts";
import getProjectsEnvironmentsHoldouts2 from "./holdouts/getProjectsEnvironmentsHoldouts2.ts";
import getProjectsEnvironmentsHoldoutsId from "./holdouts/getProjectsEnvironmentsHoldoutsId.ts";
import updateProjectsEnvironmentsHoldouts from "./holdouts/updateProjectsEnvironmentsHoldouts.ts";
import getEngineeringInsightsChartsDeploymentsFrequency from "./insights-charts/getEngineeringInsightsChartsDeploymentsFrequency.ts";
import getEngineeringInsightsChartsFlagsStale from "./insights-charts/getEngineeringInsightsChartsFlagsStale.ts";
import getEngineeringInsightsChartsFlagsStatus from "./insights-charts/getEngineeringInsightsChartsFlagsStatus.ts";
import getEngineeringInsightsChartsLeadTime from "./insights-charts/getEngineeringInsightsChartsLeadTime.ts";
import getEngineeringInsightsChartsReleasesFrequency from "./insights-charts/getEngineeringInsightsChartsReleasesFrequency.ts";
import createEngineeringInsightsDeploymentEvents from "./insights-deployments/createEngineeringInsightsDeploymentEvents.ts";
import getEngineeringInsightsDeployments from "./insights-deployments/getEngineeringInsightsDeployments.ts";
import getEngineeringInsightsDeployments2 from "./insights-deployments/getEngineeringInsightsDeployments2.ts";
import updateEngineeringInsightsDeployments from "./insights-deployments/updateEngineeringInsightsDeployments.ts";
import getEngineeringInsightsFlagEvents from "./insights-flag-events/getEngineeringInsightsFlagEvents.ts";
import getEngineeringInsightsPullRequests from "./insights-pull-requests/getEngineeringInsightsPullRequests.ts";
import deleteEngineeringInsightsRepositoriesProjects from "./insights-repositories/deleteEngineeringInsightsRepositoriesProjects.ts";
import getEngineeringInsightsRepositories from "./insights-repositories/getEngineeringInsightsRepositories.ts";
import updateEngineeringInsightsRepositoriesProjects from "./insights-repositories/updateEngineeringInsightsRepositoriesProjects.ts";
import createEngineeringInsightsInsightsGroup from "./insights-scores/createEngineeringInsightsInsightsGroup.ts";
import deleteEngineeringInsightsInsightsGroups from "./insights-scores/deleteEngineeringInsightsInsightsGroups.ts";
import getEngineeringInsightsInsightsGroups from "./insights-scores/getEngineeringInsightsInsightsGroups.ts";
import getEngineeringInsightsInsightsGroups2 from "./insights-scores/getEngineeringInsightsInsightsGroups2.ts";
import getEngineeringInsightsInsightsScores from "./insights-scores/getEngineeringInsightsInsightsScores.ts";
import updateEngineeringInsightsInsightsGroups from "./insights-scores/updateEngineeringInsightsInsightsGroups.ts";
import createIntegrations from "./integration-audit-log-subscriptions/createIntegrations.ts";
import deleteIntegrations from "./integration-audit-log-subscriptions/deleteIntegrations.ts";
import listIntegrations from "./integration-audit-log-subscriptions/listIntegrations.ts";
import listIntegrations2 from "./integration-audit-log-subscriptions/listIntegrations2.ts";
import updateIntegrations from "./integration-audit-log-subscriptions/updateIntegrations.ts";
import createIntegrationCapabilitiesFeatureStore from "./integration-delivery-configurations/createIntegrationCapabilitiesFeatureStore.ts";
import createIntegrationCapabilitiesFeatureStoreValidate from "./integration-delivery-configurations/createIntegrationCapabilitiesFeatureStoreValidate.ts";
import deleteIntegrationCapabilitiesFeatureStore from "./integration-delivery-configurations/deleteIntegrationCapabilitiesFeatureStore.ts";
import getIntegrationCapabilitiesFeatureStore from "./integration-delivery-configurations/getIntegrationCapabilitiesFeatureStore.ts";
import getIntegrationCapabilitiesFeatureStore2 from "./integration-delivery-configurations/getIntegrationCapabilitiesFeatureStore2.ts";
import getIntegrationCapabilitiesFeatureStore3 from "./integration-delivery-configurations/getIntegrationCapabilitiesFeatureStore3.ts";
import updateIntegrationCapabilitiesFeatureStore from "./integration-delivery-configurations/updateIntegrationCapabilitiesFeatureStore.ts";
import createIntegrationConfigurationsKeys from "./integrations/createIntegrationConfigurationsKeys.ts";
import deleteIntegrationConfigurations from "./integrations/deleteIntegrationConfigurations.ts";
import getIntegrationConfigurationsKeys from "./integrations/getIntegrationConfigurationsKeys.ts";
import listIntegrationConfigurations from "./integrations/listIntegrationConfigurations.ts";
import updateIntegrationConfigurations from "./integrations/updateIntegrationConfigurations.ts";
import createProjectsLayers from "./layers/createProjectsLayers.ts";
import getProjectsLayers from "./layers/getProjectsLayers.ts";
import updateProjectsLayers from "./layers/updateProjectsLayers.ts";
import createMetrics from "./metrics/createMetrics.ts";
import createProjectsMetricGroups from "./metrics/createProjectsMetricGroups.ts";
import deleteMetrics from "./metrics/deleteMetrics.ts";
import deleteProjectsMetricGroups from "./metrics/deleteProjectsMetricGroups.ts";
import getProjectsMetricGroups from "./metrics/getProjectsMetricGroups.ts";
import getProjectsMetricGroups2 from "./metrics/getProjectsMetricGroups2.ts";
import listMetrics from "./metrics/listMetrics.ts";
import listMetrics2 from "./metrics/listMetrics2.ts";
import updateMetrics from "./metrics/updateMetrics.ts";
import updateProjectsMetricGroups from "./metrics/updateProjectsMetricGroups.ts";
import createOauthClients from "./oauth2-clients/createOauthClients.ts";
import deleteOauthClients from "./oauth2-clients/deleteOauthClients.ts";
import getOauthClients from "./oauth2-clients/getOauthClients.ts";
import getOauthClients2 from "./oauth2-clients/getOauthClients2.ts";
import updateOauthClients from "./oauth2-clients/updateOauthClients.ts";
import list from "./other/list.ts";
import listCallerIdentity from "./other/listCallerIdentity.ts";
import listOpenapiJson from "./other/listOpenapiJson.ts";
import listPublicIpList from "./other/listPublicIpList.ts";
import listVersions from "./other/listVersions.ts";
import createIntegrationCapabilitiesBigSegmentStore from "./persistent-store-integrations/createIntegrationCapabilitiesBigSegmentStore.ts";
import deleteIntegrationCapabilitiesBigSegmentStore from "./persistent-store-integrations/deleteIntegrationCapabilitiesBigSegmentStore.ts";
import getIntegrationCapabilitiesBigSegmentStore from "./persistent-store-integrations/getIntegrationCapabilitiesBigSegmentStore.ts";
import getIntegrationCapabilitiesBigSegmentStore2 from "./persistent-store-integrations/getIntegrationCapabilitiesBigSegmentStore2.ts";
import updateIntegrationCapabilitiesBigSegmentStore from "./persistent-store-integrations/updateIntegrationCapabilitiesBigSegmentStore.ts";
import createProjects from "./projects/createProjects.ts";
import deleteProjects from "./projects/deleteProjects.ts";
import getProjectsFlagDefaults from "./projects/getProjectsFlagDefaults.ts";
import listProjects from "./projects/listProjects.ts";
import listProjects2 from "./projects/listProjects2.ts";
import updateProjects from "./projects/updateProjects.ts";
import updateProjectsFlagDefaults from "./projects/updateProjectsFlagDefaults.ts";
import updateProjectsFlagDefaults2 from "./projects/updateProjectsFlagDefaults2.ts";
import createAccountRelayAutoConfigs from "./relay-proxy-configurations/createAccountRelayAutoConfigs.ts";
import createAccountRelayAutoConfigsReset from "./relay-proxy-configurations/createAccountRelayAutoConfigsReset.ts";
import deleteAccountRelayAutoConfigs from "./relay-proxy-configurations/deleteAccountRelayAutoConfigs.ts";
import getAccountRelayAutoConfigs from "./relay-proxy-configurations/getAccountRelayAutoConfigs.ts";
import getAccountRelayAutoConfigs2 from "./relay-proxy-configurations/getAccountRelayAutoConfigs2.ts";
import updateAccountRelayAutoConfigs from "./relay-proxy-configurations/updateAccountRelayAutoConfigs.ts";
import createProjectsReleasePipelines from "./release-pipelines/createProjectsReleasePipelines.ts";
import deleteProjectsReleasePipelines from "./release-pipelines/deleteProjectsReleasePipelines.ts";
import getProjectsReleasePipelines from "./release-pipelines/getProjectsReleasePipelines.ts";
import getProjectsReleasePipelines2 from "./release-pipelines/getProjectsReleasePipelines2.ts";
import getProjectsReleasePipelinesReleases from "./release-pipelines/getProjectsReleasePipelinesReleases.ts";
import updateProjectsReleasePipelines from "./release-pipelines/updateProjectsReleasePipelines.ts";
import createProjectsReleasePolicies from "./release-policies/createProjectsReleasePolicies.ts";
import createProjectsReleasePoliciesOrder from "./release-policies/createProjectsReleasePoliciesOrder.ts";
import deleteProjectsReleasePolicies from "./release-policies/deleteProjectsReleasePolicies.ts";
import getProjectsReleasePolicies from "./release-policies/getProjectsReleasePolicies.ts";
import getProjectsReleasePolicies2 from "./release-policies/getProjectsReleasePolicies2.ts";
import updateProjectsReleasePolicies from "./release-policies/updateProjectsReleasePolicies.ts";
import deleteFlagsRelease from "./releases/deleteFlagsRelease.ts";
import getFlagsRelease from "./releases/getFlagsRelease.ts";
import updateFlagsRelease from "./releases/updateFlagsRelease.ts";
import updateProjectsFlagsRelease from "./releases/updateProjectsFlagsRelease.ts";
import updateProjectsFlagsReleasePhases from "./releases/updateProjectsFlagsReleasePhases.ts";
import createProjectsFlagsEnvironmentsScheduledChanges from "./scheduled-changes/createProjectsFlagsEnvironmentsScheduledChanges.ts";
import deleteProjectsFlagsEnvironmentsScheduledChanges from "./scheduled-changes/deleteProjectsFlagsEnvironmentsScheduledChanges.ts";
import getProjectsFlagsEnvironmentsScheduledChanges from "./scheduled-changes/getProjectsFlagsEnvironmentsScheduledChanges.ts";
import getProjectsFlagsEnvironmentsScheduledChanges2 from "./scheduled-changes/getProjectsFlagsEnvironmentsScheduledChanges2.ts";
import updateProjectsFlagsEnvironmentsScheduledChanges from "./scheduled-changes/updateProjectsFlagsEnvironmentsScheduledChanges.ts";
import createProjectsEnvironmentsSegmentsEvaluate from "./segments/createProjectsEnvironmentsSegmentsEvaluate.ts";
import createSegments from "./segments/createSegments.ts";
import createSegmentsContexts from "./segments/createSegmentsContexts.ts";
import createSegmentsExports from "./segments/createSegmentsExports.ts";
import createSegmentsImports from "./segments/createSegmentsImports.ts";
import createSegmentsUsers from "./segments/createSegmentsUsers.ts";
import deleteSegments from "./segments/deleteSegments.ts";
import getSegmentsContexts from "./segments/getSegmentsContexts.ts";
import getSegmentsExpiringTargets from "./segments/getSegmentsExpiringTargets.ts";
import getSegmentsExpiringUserTargets from "./segments/getSegmentsExpiringUserTargets.ts";
import getSegmentsExports from "./segments/getSegmentsExports.ts";
import getSegmentsImports from "./segments/getSegmentsImports.ts";
import getSegmentsUsers from "./segments/getSegmentsUsers.ts";
import listSegments from "./segments/listSegments.ts";
import listSegments2 from "./segments/listSegments2.ts";
import updateSegments from "./segments/updateSegments.ts";
import updateSegmentsExpiringTargets from "./segments/updateSegmentsExpiringTargets.ts";
import updateSegmentsExpiringUserTargets from "./segments/updateSegmentsExpiringUserTargets.ts";
import listTags from "./tags/listTags.ts";
import createTeams from "./teams/createTeams.ts";
import createTeamsMembers from "./teams/createTeamsMembers.ts";
import deleteTeams from "./teams/deleteTeams.ts";
import getTeamsMaintainers from "./teams/getTeamsMaintainers.ts";
import getTeamsRoles from "./teams/getTeamsRoles.ts";
import listTeams from "./teams/listTeams.ts";
import listTeams2 from "./teams/listTeams2.ts";
import updateTeams from "./teams/updateTeams.ts";
import updateTeams2 from "./teams/updateTeams2.ts";
import createProjectsViews from "./views/createProjectsViews.ts";
import createProjectsViewsLink from "./views/createProjectsViewsLink.ts";
import deleteProjectsViews from "./views/deleteProjectsViews.ts";
import deleteProjectsViewsLink from "./views/deleteProjectsViewsLink.ts";
import getProjectsViewAssociations from "./views/getProjectsViewAssociations.ts";
import getProjectsViews from "./views/getProjectsViews.ts";
import getProjectsViews2 from "./views/getProjectsViews2.ts";
import getProjectsViewsLinked from "./views/getProjectsViewsLinked.ts";
import updateProjectsViews from "./views/updateProjectsViews.ts";
import createWebhooks from "./webhooks/createWebhooks.ts";
import deleteWebhooks from "./webhooks/deleteWebhooks.ts";
import listWebhooks from "./webhooks/listWebhooks.ts";
import listWebhooks2 from "./webhooks/listWebhooks2.ts";
import updateWebhooks from "./webhooks/updateWebhooks.ts";
import createTemplates from "./workflow-templates/createTemplates.ts";
import deleteTemplates from "./workflow-templates/deleteTemplates.ts";
import listTemplates from "./workflow-templates/listTemplates.ts";
import createProjectsFlagsEnvironmentsWorkflows from "./workflows/createProjectsFlagsEnvironmentsWorkflows.ts";
import deleteProjectsFlagsEnvironmentsWorkflows from "./workflows/deleteProjectsFlagsEnvironmentsWorkflows.ts";
import getProjectsFlagsEnvironmentsWorkflows from "./workflows/getProjectsFlagsEnvironmentsWorkflows.ts";
import getProjectsFlagsEnvironmentsWorkflows2 from "./workflows/getProjectsFlagsEnvironmentsWorkflows2.ts";

export const blocks = {
  createProjectsAiConfigs,
  createProjectsAiConfigsModelConfigs,
  createProjectsAiConfigsModelConfigsRestricted,
  createProjectsAiConfigsVariations,
  createProjectsAiTools,
  deleteProjectsAiConfigs,
  deleteProjectsAiConfigsModelConfigs,
  deleteProjectsAiConfigsModelConfigsRestricted,
  deleteProjectsAiConfigsVariations,
  deleteProjectsAiTools,
  getProjectsAiConfigs,
  getProjectsAiConfigs2,
  getProjectsAiConfigsMetrics,
  getProjectsAiConfigsMetricsByVariation,
  getProjectsAiConfigsModelConfigs,
  getProjectsAiConfigsModelConfigs2,
  getProjectsAiConfigsTargeting,
  getProjectsAiConfigsVariations,
  getProjectsAiTools,
  getProjectsAiTools2,
  getProjectsAiToolsVersions,
  updateProjectsAiConfigs,
  updateProjectsAiConfigsTargeting,
  updateProjectsAiConfigsVariations,
  updateProjectsAiTools,
  createTokens,
  createTokensReset,
  deleteTokens,
  listTokens,
  listTokens2,
  updateTokens,
  createMembers,
  createMembersTeams,
  deleteMembers,
  listMembers,
  listMembers2,
  updateMembers,
  updateMembers2,
  getUsageClientsideContexts,
  getUsageDataExportEvents,
  getUsageEvaluations,
  getUsageEvents,
  getUsageExperimentationEvents,
  getUsageExperimentationKeys,
  getUsageMau,
  getUsageMauBycategory,
  getUsageMauSdks,
  getUsageObservabilityErrors,
  getUsageObservabilityLogs,
  getUsageObservabilitySessions,
  getUsageObservabilityTraces,
  getUsageServersideContexts,
  getUsageServiceConnections,
  getUsageStreams,
  getUsageStreamsBysdkversion,
  getUsageStreamsSdkversions,
  getUsageTotalContexts,
  createAnnouncements,
  deleteAnnouncements,
  listAnnouncements,
  updateAnnouncements,
  deleteApplications,
  deleteApplicationsVersions,
  getApplicationsVersions,
  listApplications,
  listApplications2,
  updateApplications,
  updateApplicationsVersions,
  createApprovalRequests,
  createApprovalRequestsApply,
  createApprovalRequestsReviews,
  createProjectsFlagsEnvironmentsApprovalRequests,
  createProjectsFlagsEnvironmentsApprovalRequestsApply,
  createProjectsFlagsEnvironmentsApprovalRequestsFlagCopy,
  createProjectsFlagsEnvironmentsApprovalRequestsReviews,
  deleteApprovalRequests,
  deleteProjectsFlagsEnvironmentsApprovalRequests,
  getApprovalRequestsProjectsSettings,
  getProjectsFlagsEnvironmentsApprovalRequests,
  getProjectsFlagsEnvironmentsApprovalRequests2,
  listApprovalRequests,
  listApprovalRequests2,
  updateApprovalRequests,
  updateApprovalRequestsProjectsSettings,
  updateProjectsFlagsEnvironmentsApprovalRequests,
  createAuditlog,
  listAuditlog,
  listAuditlog2,
  createCodeRefsRepositories,
  createCodeRefsRepositoriesBranchDeleteTasks,
  createCodeRefsRepositoriesBranchesExtinctionEvents,
  deleteCodeRefsRepositories,
  getCodeRefsExtinctions,
  getCodeRefsRepositories,
  getCodeRefsRepositories2,
  getCodeRefsRepositoriesBranches,
  getCodeRefsRepositoriesBranches2,
  getCodeRefsStatistics,
  getCodeRefsStatistics2,
  updateCodeRefsRepositories,
  updateCodeRefsRepositoriesBranches,
  updateProjectsEnvironmentsContextsFlags,
  createProjectsEnvironmentsContextInstancesSearch,
  createProjectsEnvironmentsContextsSearch,
  createProjectsEnvironmentsFlagsEvaluate,
  deleteProjectsEnvironmentsContextInstances,
  getProjectsContextKinds,
  getProjectsEnvironmentsContextAttributes,
  getProjectsEnvironmentsContextAttributes2,
  getProjectsEnvironmentsContextInstances,
  getProjectsEnvironmentsContexts,
  updateProjectsContextKinds,
  createRoles,
  deleteRoles,
  listRoles,
  listRoles2,
  updateRoles,
  createDestinations,
  createDestinationsGenerateWarehouseDestinationKeyPair,
  deleteDestinations,
  listDestinations,
  listDestinations2,
  updateDestinations,
  createProjectsEnvironments,
  createProjectsEnvironmentsApiKey,
  createProjectsEnvironmentsMobileKey,
  deleteProjectsEnvironments,
  getProjectsEnvironments,
  getProjectsEnvironments2,
  updateProjectsEnvironments,
  createProjectsEnvironmentsExperiments,
  createProjectsEnvironmentsExperimentsIterations,
  getProjectsEnvironmentsExperiments,
  getProjectsEnvironmentsExperiments2,
  getProjectsExperimentationSettings,
  updateProjectsEnvironmentsExperiments,
  updateProjectsExperimentationSettings,
  createFlags,
  createFlagsCopy,
  createProjectsFlagsEnvironmentsMigrationSafetyIssues,
  deleteFlags,
  getFlagsDependentFlags,
  getFlagsDependentFlags2,
  getFlagsExpiringTargets,
  getFlagsExpiringUserTargets,
  listFlagStatus,
  listFlagStatuses,
  listFlagStatuses2,
  listFlags,
  listFlags2,
  updateFlags,
  updateFlagsExpiringTargets,
  updateFlagsExpiringUserTargets,
  createIntegrationCapabilitiesFlagImport,
  createIntegrationCapabilitiesFlagImportTrigger,
  deleteIntegrationCapabilitiesFlagImport,
  getIntegrationCapabilitiesFlagImport,
  getIntegrationCapabilitiesFlagImport2,
  updateIntegrationCapabilitiesFlagImport,
  createFlagLinksProjectsFlags,
  deleteFlagLinksProjectsFlags,
  getFlagLinksProjectsFlags,
  updateFlagLinksProjectsFlags,
  createFlagsTriggers,
  deleteFlagsTriggers,
  getFlagsTriggers,
  getFlagsTriggers2,
  updateFlagsTriggers,
  deleteProjectsFlagsEnvironmentsFollowers,
  getProjectsEnvironmentsFollowers,
  getProjectsFlagsEnvironmentsFollowers,
  updateProjectsFlagsEnvironmentsFollowers,
  createProjectsEnvironmentsHoldouts,
  getProjectsEnvironmentsHoldouts,
  getProjectsEnvironmentsHoldouts2,
  getProjectsEnvironmentsHoldoutsId,
  updateProjectsEnvironmentsHoldouts,
  getEngineeringInsightsChartsDeploymentsFrequency,
  getEngineeringInsightsChartsFlagsStale,
  getEngineeringInsightsChartsFlagsStatus,
  getEngineeringInsightsChartsLeadTime,
  getEngineeringInsightsChartsReleasesFrequency,
  createEngineeringInsightsDeploymentEvents,
  getEngineeringInsightsDeployments,
  getEngineeringInsightsDeployments2,
  updateEngineeringInsightsDeployments,
  getEngineeringInsightsFlagEvents,
  getEngineeringInsightsPullRequests,
  deleteEngineeringInsightsRepositoriesProjects,
  getEngineeringInsightsRepositories,
  updateEngineeringInsightsRepositoriesProjects,
  createEngineeringInsightsInsightsGroup,
  deleteEngineeringInsightsInsightsGroups,
  getEngineeringInsightsInsightsGroups,
  getEngineeringInsightsInsightsGroups2,
  getEngineeringInsightsInsightsScores,
  updateEngineeringInsightsInsightsGroups,
  createIntegrations,
  deleteIntegrations,
  listIntegrations,
  listIntegrations2,
  updateIntegrations,
  createIntegrationCapabilitiesFeatureStore,
  createIntegrationCapabilitiesFeatureStoreValidate,
  deleteIntegrationCapabilitiesFeatureStore,
  getIntegrationCapabilitiesFeatureStore,
  getIntegrationCapabilitiesFeatureStore2,
  getIntegrationCapabilitiesFeatureStore3,
  updateIntegrationCapabilitiesFeatureStore,
  createIntegrationConfigurationsKeys,
  deleteIntegrationConfigurations,
  getIntegrationConfigurationsKeys,
  listIntegrationConfigurations,
  updateIntegrationConfigurations,
  createProjectsLayers,
  getProjectsLayers,
  updateProjectsLayers,
  createMetrics,
  createProjectsMetricGroups,
  deleteMetrics,
  deleteProjectsMetricGroups,
  getProjectsMetricGroups,
  getProjectsMetricGroups2,
  listMetrics,
  listMetrics2,
  updateMetrics,
  updateProjectsMetricGroups,
  createOauthClients,
  deleteOauthClients,
  getOauthClients,
  getOauthClients2,
  updateOauthClients,
  list,
  listCallerIdentity,
  listOpenapiJson,
  listPublicIpList,
  listVersions,
  createIntegrationCapabilitiesBigSegmentStore,
  deleteIntegrationCapabilitiesBigSegmentStore,
  getIntegrationCapabilitiesBigSegmentStore,
  getIntegrationCapabilitiesBigSegmentStore2,
  updateIntegrationCapabilitiesBigSegmentStore,
  createProjects,
  deleteProjects,
  getProjectsFlagDefaults,
  listProjects,
  listProjects2,
  updateProjects,
  updateProjectsFlagDefaults,
  updateProjectsFlagDefaults2,
  createAccountRelayAutoConfigs,
  createAccountRelayAutoConfigsReset,
  deleteAccountRelayAutoConfigs,
  getAccountRelayAutoConfigs,
  getAccountRelayAutoConfigs2,
  updateAccountRelayAutoConfigs,
  createProjectsReleasePipelines,
  deleteProjectsReleasePipelines,
  getProjectsReleasePipelines,
  getProjectsReleasePipelines2,
  getProjectsReleasePipelinesReleases,
  updateProjectsReleasePipelines,
  createProjectsReleasePolicies,
  createProjectsReleasePoliciesOrder,
  deleteProjectsReleasePolicies,
  getProjectsReleasePolicies,
  getProjectsReleasePolicies2,
  updateProjectsReleasePolicies,
  deleteFlagsRelease,
  getFlagsRelease,
  updateFlagsRelease,
  updateProjectsFlagsRelease,
  updateProjectsFlagsReleasePhases,
  createProjectsFlagsEnvironmentsScheduledChanges,
  deleteProjectsFlagsEnvironmentsScheduledChanges,
  getProjectsFlagsEnvironmentsScheduledChanges,
  getProjectsFlagsEnvironmentsScheduledChanges2,
  updateProjectsFlagsEnvironmentsScheduledChanges,
  createProjectsEnvironmentsSegmentsEvaluate,
  createSegments,
  createSegmentsContexts,
  createSegmentsExports,
  createSegmentsImports,
  createSegmentsUsers,
  deleteSegments,
  getSegmentsContexts,
  getSegmentsExpiringTargets,
  getSegmentsExpiringUserTargets,
  getSegmentsExports,
  getSegmentsImports,
  getSegmentsUsers,
  listSegments,
  listSegments2,
  updateSegments,
  updateSegmentsExpiringTargets,
  updateSegmentsExpiringUserTargets,
  listTags,
  createTeams,
  createTeamsMembers,
  deleteTeams,
  getTeamsMaintainers,
  getTeamsRoles,
  listTeams,
  listTeams2,
  updateTeams,
  updateTeams2,
  createProjectsViews,
  createProjectsViewsLink,
  deleteProjectsViews,
  deleteProjectsViewsLink,
  getProjectsViewAssociations,
  getProjectsViews,
  getProjectsViews2,
  getProjectsViewsLinked,
  updateProjectsViews,
  createWebhooks,
  deleteWebhooks,
  listWebhooks,
  listWebhooks2,
  updateWebhooks,
  createTemplates,
  deleteTemplates,
  listTemplates,
  createProjectsFlagsEnvironmentsWorkflows,
  deleteProjectsFlagsEnvironmentsWorkflows,
  getProjectsFlagsEnvironmentsWorkflows,
  getProjectsFlagsEnvironmentsWorkflows2,
};
