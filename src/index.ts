/**
 * ZeroPath Backstage Plugin - Frontend
 *
 * This plugin provides UI components for integrating ZeroPath security
 * scanning into your Backstage instance.
 *
 * ## Installation (Traditional EntityPage.tsx)
 *
 * 1. Install the plugin:
 *    ```bash
 *    yarn --cwd packages/app add @zeropath/plugin-backstage
 *    ```
 *
 * 2. Add to EntityPage.tsx:
 *    ```tsx
 *    import {
 *      EntityZeroPathContent,
 *      EntityZeroPathCard,
 *      isZeroPathAvailable,
 *    } from '@zeropath/plugin-backstage';
 *
 *    // Add to entity layout routes:
 *    <EntityLayout.Route path="/security" title="Security" if={isZeroPathAvailable}>
 *      <EntityZeroPathContent />
 *    </EntityLayout.Route>
 *
 *    // Or add card to overview:
 *    <EntityZeroPathCard />
 *    ```
 *
 * 3. Configure app-config.yaml:
 *    ```yaml
 *    proxy:
 *      endpoints:
 *        '/zeropath':
 *          target: ${ZEROPATH_BASE_URL}
 *          headers:
 *            X-ZeroPath-API-Token-Id: ${ZEROPATH_TOKEN_ID}
 *            X-ZeroPath-API-Token-Secret: ${ZEROPATH_TOKEN_SECRET}
 *
 *    zeropath:
 *      baseUrl: ${ZEROPATH_BASE_URL}
 *      organizationId: ${ZEROPATH_ORGANIZATION_ID}
 *    ```
 *
 * @packageDocumentation
 */

// Plugin and routable extensions (for EntityPage.tsx integration)
export {
  zeroPathPlugin,
  isZeroPathAvailable,
  EntityZeroPathContent,
  EntityZeroPathCard,
  EntityZeroPathSummaryCard,
} from './plugin';

// API
export { zeroPathApiRef } from './api/ZeroPathApi';
export type { ZeroPathApi } from './api/ZeroPathApi';
export { ZeroPathClient } from './api/ZeroPathClient';

// Components (direct imports for advanced use cases)
export {
  ZeroPathInfoCard,
  ZeroPathSummaryCards,
  ZeroPathSecurityContent,
  ZeroPathInfoCardWrapper,
  ZeroPathSummaryCardsWrapper,
  SeverityChip,
  IssueDetailsPanel,
  ZeroPathPage,
} from './components';

// Re-export types from common for convenience
export type {
  ZeroPathIssue,
  ZeroPathRepository,
  IssueCounts,
  SeverityLevel,
} from './common';

export {
  SEVERITY_WINDOWS,
  mapScoreToSeverity,
  getSeverityColor,
  DEFAULT_REPOSITORY_ANNOTATION,
} from './common';
