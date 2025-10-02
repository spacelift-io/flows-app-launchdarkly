# LaunchDarkly Integration for Flows

A comprehensive LaunchDarkly integration that brings the full power of LaunchDarkly's feature management platform to your Flows workflows. Manage feature flags, environments, projects, segments, and more with easy-to-use blocks.

## Features

### Feature Flag Management

- Create, update, and delete feature flags with rich configuration options
- Advanced flag features: targeting rules, prerequisites, scheduled changes
- Flag variations with custom types (boolean, string, number, JSON)
- Flag status tracking across environments
- Flag copying and archiving

### Environment & Project Organization

- Projects: Organize your feature flags and resources
- Environments: Manage development, staging, production, and custom environments
- Tags: Flexible categorization and organization system
- Contexts: Manage targeting contexts and custom attributes

### Targeting & Segmentation

- Segments: Create reusable user groups for targeting
- Context targets: Individual and bulk targeting rules
- Complex targeting rules with multiple conditions
- Prerequisites and dependencies between flags

### Release Management

- Releases: Track feature releases across environments
- Release pipelines: Automate progressive rollouts
- Release policies: Define approval workflows and gates
- Holdouts: Control experiment groups

### Experimentation & Metrics

- Experiments: A/B test variations and measure impact
- Metrics: Track business and technical metrics
- Insights: Engineering insights and analytics
- Deployments: Track deployment events and impact

### Team & Access Management

- Teams: Organize members with custom permissions
- Custom roles: Fine-grained access control
- OAuth2 clients: API access management
- Access tokens: Secure API authentication

### Advanced Features

- Webhooks: Real-time event notifications
- Integrations: Connect with external services
- Audit log: Comprehensive activity tracking
- Data export: Export configuration and analytics
- Relay proxy: Edge network configuration

## Quick Start

### 1. Create LaunchDarkly API Access Token

1. Go to [LaunchDarkly Authorization Settings](https://app.launchdarkly.com/settings/authorization)
2. Click "Create token"
3. Configure your token:
   - Name: Your Flows Integration
   - Role: Select appropriate permissions (Writer or Admin recommended)
   - Choose custom role for fine-grained access

### 2. Configure the Integration

1. Install this LaunchDarkly app in your Flows workspace
2. Enter your API Access Token from step 1
3. Optionally configure Base URL (defaults to https://app.launchdarkly.com)

### 3. Start Building

Drag LaunchDarkly blocks into your flows and start automating your feature management!

## Available Blocks

The integration provides **327 blocks** organized across **48 categories**:

### Feature Flags (40+ blocks)

- Create, update, delete, and list feature flags
- Get flag details and status across environments
- Copy flags between projects
- Manage flag dependencies and prerequisites
- Schedule flag changes

### Projects & Environments (20+ blocks)

- Full CRUD operations for projects
- Environment management and configuration
- Environment approval settings
- Project access and permissions

### Targeting & Segments (15+ blocks)

- Create and manage user segments
- Complex targeting rules
- Context management and custom attributes
- Individual and bulk targeting operations

### Release Management (20+ blocks)

- Release creation and tracking
- Release pipelines and progressive delivery
- Release policies and approval gates
- Holdout management

### Experimentation (15+ blocks)

- Experiment creation and management
- Metric tracking and analysis
- A/B test configuration
- Results analysis

### Engineering Insights (10+ blocks)

- Deployment tracking
- Pull request integration
- Repository management
- Flag usage analytics
- Engineering metrics

### Team Management (10+ blocks)

- Team creation and management
- Member operations
- Custom role configuration
- Permission management

### Integrations & Webhooks (15+ blocks)

- Webhook configuration
- Integration setup
- Delivery configurations
- Audit log subscriptions

### Access Control (10+ blocks)

- Access token management
- OAuth2 client configuration
- Custom roles and permissions
- Account member management

### Additional Categories

- Account Usage: Usage tracking and limits
- AI Configs: AI-powered feature management
- Announcements: In-app messaging
- Applications: Application management
- Approvals: Approval workflow management
- Audit Log: Activity tracking
- Code References: Find flag usage in code
- Context Settings: Context configuration
- Data Export: Export configurations
- Flag Import: Import configurations
- Flag Links: Deep links to flags
- Flag Triggers: Automated flag actions
- Follow Flags: Flag watching and notifications
- Integration Audit Log: Integration activity tracking
- Layers: Layer management
- Metrics: Custom metrics
- Persistent Store: Integration storage
- Relay Proxy: Edge network configuration
- Scheduled Changes: Automated scheduling
- Tags: Tag management
- Views: Custom dashboard views
- Workflow Templates: Reusable workflows
- Workflows: Automation workflows

## Technical Details

### Architecture

- TypeScript-first with full type safety
- Auto-generated blocks from LaunchDarkly's OpenAPI specification
- Comprehensive error handling with user-friendly messages
- Organized by feature area for easy discovery

### Security

- API token authentication
- Sensitive data protection with encrypted storage
- Scoped permissions following principle of least privilege
- Audit logging for compliance

### Performance

- Efficient API usage with proper request handling
- Real-time updates through webhook subscriptions
- Optimized schemas reduce payload sizes

## Contributing

### Development Setup

```bash
# Install dependencies
npm install

# Generate blocks from OpenAPI spec
npm run gen

# Type check everything
npm run typecheck

# Create bundle
npm run bundle
```

### Block Generation

The app uses an intelligent block generation system:

```bash
# Regenerate all blocks from spec.json
npm run gen
```

This automatically:

- Extracts all endpoints from LaunchDarkly's OpenAPI specification
- Converts to TypeScript-compatible blocks
- Generates input/output schemas
- Organizes blocks by category
- Filters out deprecated endpoints
- Cleans up beta markers from names

### File Structure

```text
flows-app-launchdarkly/
├── blocks/            # Auto-generated action blocks
│   ├── feature-flags/ # Feature flag blocks
│   ├── projects/      # Project blocks
│   ├── environments/  # Environment blocks
│   ├── segments/      # Segment blocks
│   ├── experiments/   # Experiment blocks
│   └── ... (48 categories total)
├── scripts/           # Generation scripts
│   ├── generateActions.ts  # Main generator
│   └── utils.ts            # Helper functions
├── utils/             # Runtime utilities
│   └── apiHelpers.ts  # API request helpers
├── spec.json          # OpenAPI specification
└── main.ts            # App definition
```

## Documentation

### Core Concepts

- Projects: Top-level organizational units
- Environments: Deployment stages (dev, staging, prod)
- Feature Flags: Dynamic configuration switches
- Segments: Reusable targeting groups
- Contexts: User and custom targeting attributes
- Variations: Different flag values for targeting

### Best Practices

- Use segments for reusable targeting rules
- Leverage prerequisites for complex dependencies
- Implement scheduled changes for timed rollouts
- Set up webhooks for real-time synchronization
- Use release pipelines for progressive delivery
- Track experiments for data-driven decisions
- Monitor metrics for business impact

### Troubleshooting

- Authorization Issues: Verify API token has required permissions
- Webhook Problems: Check webhook configuration and signatures
- Permission Errors: Ensure token role includes necessary scopes
- Rate Limits: LaunchDarkly enforces API rate limits - implement retry logic

## License

This project is licensed under the MIT License.
