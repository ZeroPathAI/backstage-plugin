# @zeropath/plugin-backstage

A Backstage plugin for integrating [ZeroPath](https://zeropath.com) security scanning into your Backstage instance.

## Features

- **Security Dashboard**: View security vulnerabilities detected by ZeroPath directly in Backstage
- **Entity Cards**: Display vulnerability summaries on entity pages
- **Severity Filtering**: Filter issues by severity level (Critical, High, Medium, Low)
- **Issue Details**: View detailed information about each security issue
- **Standalone Security Page**: Overview of all repositories and their security status

## Installation

```bash
yarn --cwd packages/app add @zeropath/plugin-backstage
```

## Configuration

### Step 1: Configure app-config.yaml

Add the proxy configuration and ZeroPath settings:

```yaml
proxy:
  endpoints:
    '/zeropath':
      target: ${ZEROPATH_BASE_URL}
      headers:
        X-ZeroPath-API-Token-Id: ${ZEROPATH_TOKEN_ID}
        X-ZeroPath-API-Token-Secret: ${ZEROPATH_TOKEN_SECRET}
      changeOrigin: true
      allowedMethods: ['GET', 'POST']

zeropath:
  organizationId: ${ZEROPATH_ORGANIZATION_ID}
```

### Step 2: Add to App.tsx (New Frontend System)

```tsx
// packages/app/src/App.tsx
import zeroPathPlugin from '@zeropath/plugin-backstage/alpha';

const app = createApp({
  features: [
    zeroPathPlugin,
    // ... other plugins
  ],
});
```

Configure extensions in `app-config.yaml`:

```yaml
app:
  extensions:
    # Entity cards
    - entity-card:zeropath/info:
        config:
          filter:
            kind: Component
    - entity-card:zeropath/summary:
        config:
          filter:
            kind: Component

    # Security tab on entity pages
    - entity-content:zeropath/security:
        config:
          path: /security
          title: Security
          filter:
            kind: Component

    # Standalone security overview page
    - page:zeropath/page:
        config:
          path: /zeropath

    # Sidebar navigation link
    - nav-item:zeropath/nav: {}
```

### Alternative: Legacy Frontend System

If you're using the legacy frontend system:

```tsx
// packages/app/src/components/catalog/EntityPage.tsx
import {
  EntityZeroPathContent,
  EntityZeroPathCard,
  EntityZeroPathSummaryCard,
  isZeroPathAvailable,
} from '@zeropath/plugin-backstage';

// Add Security tab to entity pages
const serviceEntityPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      {/* Overview content */}
    </EntityLayout.Route>

    <EntityLayout.Route
      path="/security"
      title="Security"
      if={isZeroPathAvailable}
    >
      <EntityZeroPathContent />
    </EntityLayout.Route>
  </EntityLayout>
);

// Or add cards to the overview tab
const overviewContent = (
  <Grid container spacing={3}>
    <Grid item md={6}>
      <EntityZeroPathCard />
    </Grid>
    <Grid item md={12}>
      <EntityZeroPathSummaryCard />
    </Grid>
  </Grid>
);
```

## Entity Annotations

Link your Backstage entities to ZeroPath repositories using annotations:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: my-service
  annotations:
    github.com/project-slug: my-org/my-repo
spec:
  type: service
  owner: team-platform
```

## Exported Components

| Component | Description |
|-----------|-------------|
| `EntityZeroPathContent` | Main security content for the Security tab |
| `EntityZeroPathCard` | Info card showing repository security overview |
| `EntityZeroPathSummaryCard` | Summary cards with vulnerability counts by severity |
| `ZeroPathPage` | Standalone page showing all repositories |
| `isZeroPathAvailable` | Helper function for conditional rendering |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ZEROPATH_BASE_URL` | ZeroPath API base URL (e.g., `https://api.zeropath.com`) |
| `ZEROPATH_ORGANIZATION_ID` | Your ZeroPath organization ID |
| `ZEROPATH_TOKEN_ID` | API token ID |
| `ZEROPATH_TOKEN_SECRET` | API token secret |

## Disabling Extensions

Extensions can be disabled via `app-config.yaml`:

```yaml
app:
  extensions:
    - entity-content:zeropath/security: false
    - nav-item:zeropath/nav: false
    - page:zeropath/page: false
```

## License

Apache-2.0
