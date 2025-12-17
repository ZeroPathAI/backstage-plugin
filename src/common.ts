/**
 * ZeroPath Backstage Plugin - Common Types and Utilities
 *
 * This module exports shared types and utilities used by both
 * frontend and backend components.
 *
 * @packageDocumentation
 */

// Types
export type {
  SeverityLevel,
  ZeroPathRepository,
  ZeroPathIssue,
  IssueCounts,
  IssueSearchResponse,
  SeveritySnapshot,
  SeverityWindow,
} from './common/index';

// Severity utilities
export {
  SEVERITY_WINDOWS,
  mapScoreToSeverity,
  getSeverityColor,
} from './common/index';

// Annotation utilities
export {
  DEFAULT_REPOSITORY_ANNOTATION,
  formatSlug,
  formatSlugWithPrefix,
} from './common/index';
