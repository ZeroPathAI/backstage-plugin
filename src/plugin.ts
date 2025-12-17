/**
 * ZeroPath Backstage Plugin - Legacy Plugin Export
 *
 * This module provides the plugin instance for traditional Backstage apps
 * that use EntityPage.tsx integration pattern.
 */

import {
  createPlugin,
  createApiFactory,
  discoveryApiRef,
  fetchApiRef,
  configApiRef,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { zeroPathApiRef } from './api/ZeroPathApi';
import { ZeroPathClient } from './api/ZeroPathClient';
import { Entity } from '@backstage/catalog-model';
import { DEFAULT_REPOSITORY_ANNOTATION } from './common';

/**
 * The ZeroPath plugin instance
 */
export const zeroPathPlugin = createPlugin({
  id: 'zeropath',
  apis: [
    createApiFactory({
      api: zeroPathApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
        configApi: configApiRef,
      },
      factory: ({ discoveryApi, fetchApi, configApi }) =>
        new ZeroPathClient({ discoveryApi, fetchApi, configApi }),
    }),
  ],
});

/**
 * Check if ZeroPath is available for a given entity.
 * Returns true if the entity has the required annotation.
 *
 * Usage in EntityPage.tsx:
 * ```tsx
 * <EntityLayout.Route path="/security" title="Security" if={isZeroPathAvailable}>
 *   <EntityZeroPathContent />
 * </EntityLayout.Route>
 * ```
 */
export const isZeroPathAvailable = (entity: Entity): boolean => {
  const annotation = entity.metadata.annotations?.[DEFAULT_REPOSITORY_ANNOTATION];
  return Boolean(annotation);
};

/**
 * Main content component for the Security tab.
 * Shows vulnerability details for the entity.
 *
 * Usage in EntityPage.tsx:
 * ```tsx
 * <EntityLayout.Route path="/security" title="Security">
 *   <EntityZeroPathContent />
 * </EntityLayout.Route>
 * ```
 */
export const EntityZeroPathContent = zeroPathPlugin.provide(
  createRoutableExtension({
    name: 'EntityZeroPathContent',
    component: () =>
      import('./components/ZeroPathSecurityContent').then(m => m.ZeroPathSecurityContent),
    mountPoint: { id: 'zeropath' } as any,
  }),
);

/**
 * Info card showing repository security overview.
 *
 * Usage in EntityPage.tsx:
 * ```tsx
 * <EntityZeroPathCard />
 * ```
 */
export const EntityZeroPathCard = zeroPathPlugin.provide(
  createRoutableExtension({
    name: 'EntityZeroPathCard',
    component: () =>
      import('./components/ZeroPathInfoCard').then(m => m.ZeroPathInfoCard),
    mountPoint: { id: 'zeropath-card' } as any,
  }),
);

/**
 * Summary cards showing vulnerability counts by severity.
 *
 * Usage in EntityPage.tsx:
 * ```tsx
 * <EntityZeroPathSummaryCard />
 * ```
 */
export const EntityZeroPathSummaryCard = zeroPathPlugin.provide(
  createRoutableExtension({
    name: 'EntityZeroPathSummaryCard',
    component: () =>
      import('./components/ZeroPathSummaryCards').then(m => m.ZeroPathSummaryCards),
    mountPoint: { id: 'zeropath-summary' } as any,
  }),
);
