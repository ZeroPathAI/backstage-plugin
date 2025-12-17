// Re-export types from common module
export type {
  SeverityLevel,
  ZeroPathIssue,
  ZeroPathRepository,
  IssueCounts,
  IssueSearchResponse,
} from '../common';

export {
  SEVERITY_WINDOWS,
  mapScoreToSeverity,
  getSeverityColor,
} from '../common';
