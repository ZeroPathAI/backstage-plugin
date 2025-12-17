import { useAsync } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';
import {
  Content,
  ContentHeader,
  Progress,
  ResponseErrorPanel,
  Table,
  TableColumn,
  Link,
  SupportButton,
  EmptyState,
} from '@backstage/core-components';
import {
  Box,
  Grid,
  Typography,
  makeStyles,
  Card,
  CardContent,
} from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import { zeroPathApiRef } from '../../api/ZeroPathApi';
import {
  ZeroPathRepository,
  IssueCounts,
  getSeverityColor,
} from '../../common';

// Convert repository to Backstage entity name (same logic as entity provider)
const toEntityName = (repo: ZeroPathRepository): string => {
  // Get the repository name/slug
  const repoName = repo.repositoryName || repo.name || '';
  if (!repoName) return '';

  // Convert to valid entity name: lowercase, replace slashes and special chars with dashes
  return repoName
    .toLowerCase()
    .replace(/\//g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2, 0, 2),
  },
  statsSection: {
    marginBottom: theme.spacing(3),
  },
  statCard: {
    textAlign: 'center',
    height: '100%',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  statLabel: {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  criticalText: {
    color: getSeverityColor('critical'),
  },
  highText: {
    color: getSeverityColor('high'),
  },
  mediumText: {
    color: getSeverityColor('medium'),
  },
  lowText: {
    color: getSeverityColor('low'),
  },
  totalText: {
    color: theme.palette.primary.main,
  },
  tableSection: {
    '& .MuiPaper-root': {
      borderRadius: theme.shape.borderRadius * 2,
      boxShadow: theme.shadows[1],
    },
  },
  repoName: {
    fontWeight: 600,
  },
  badgeContainer: {
    display: 'flex',
    gap: theme.spacing(0.5),
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
  badgeCount: {
    padding: theme.spacing(0.25, 0.5),
    fontWeight: 600,
    fontSize: '0.75rem',
    backgroundColor: '#e0e0e0',
    color: '#212121',
    minWidth: 20,
    textAlign: 'center',
  },
  badgeLabel: {
    padding: theme.spacing(0.25, 0.5),
    fontWeight: 700,
    fontSize: '0.75rem',
    minWidth: 16,
    textAlign: 'center',
    color: '#fff',
  },
  actionLinks: {
    display: 'flex',
    gap: theme.spacing(1.5),
    alignItems: 'center',
  },
}));

interface RepoWithCounts extends ZeroPathRepository {
  counts?: IssueCounts;
}

export const ZeroPathPage = () => {
  const classes = useStyles();
  const api = useApi(zeroPathApiRef);

  // Fetch all repositories
  const {
    value: repositories,
    loading,
    error,
  } = useAsync(async () => {
    const repos = await api.listRepositories();

    // Fetch issue counts for each repository
    const reposWithCounts: RepoWithCounts[] = await Promise.all(
      repos.map(async (repo) => {
        try {
          const counts = await api.getIssueCounts(String(repo.id));
          return { ...repo, counts };
        } catch {
          return { ...repo, counts: { critical: 0, high: 0, medium: 0, low: 0, total: 0 } };
        }
      })
    );

    return reposWithCounts;
  }, [api]);

  // Calculate aggregate stats
  const aggregateStats = repositories?.reduce(
    (acc, repo) => ({
      critical: acc.critical + (repo.counts?.critical ?? 0),
      high: acc.high + (repo.counts?.high ?? 0),
      medium: acc.medium + (repo.counts?.medium ?? 0),
      low: acc.low + (repo.counts?.low ?? 0),
      total: acc.total + (repo.counts?.total ?? 0),
      repos: acc.repos + 1,
    }),
    { critical: 0, high: 0, medium: 0, low: 0, total: 0, repos: 0 }
  ) ?? { critical: 0, high: 0, medium: 0, low: 0, total: 0, repos: 0 };

  const columns: TableColumn<RepoWithCounts>[] = [
    {
      title: 'Repository',
      field: 'repositoryName',
      render: row => (
        <Typography className={classes.repoName}>
          {row.repositoryName || row.name || 'Unknown'}
        </Typography>
      ),
    },
    {
      title: 'Issues',
      render: row => {
        const counts = row.counts ?? { critical: 0, high: 0, medium: 0, low: 0, total: 0 };
        return (
          <Box className={classes.badgeContainer}>
            {counts.critical > 0 && (
              <Box className={classes.badge}>
                <Typography component="span" className={classes.badgeCount}>
                  {counts.critical}
                </Typography>
                <Typography
                  component="span"
                  className={classes.badgeLabel}
                  style={{ backgroundColor: getSeverityColor('critical') }}
                >
                  C
                </Typography>
              </Box>
            )}
            {counts.high > 0 && (
              <Box className={classes.badge}>
                <Typography component="span" className={classes.badgeCount}>
                  {counts.high}
                </Typography>
                <Typography
                  component="span"
                  className={classes.badgeLabel}
                  style={{ backgroundColor: getSeverityColor('high') }}
                >
                  H
                </Typography>
              </Box>
            )}
            {counts.medium > 0 && (
              <Box className={classes.badge}>
                <Typography component="span" className={classes.badgeCount}>
                  {counts.medium}
                </Typography>
                <Typography
                  component="span"
                  className={classes.badgeLabel}
                  style={{ backgroundColor: getSeverityColor('medium') }}
                >
                  M
                </Typography>
              </Box>
            )}
            {counts.low > 0 && (
              <Box className={classes.badge}>
                <Typography component="span" className={classes.badgeCount}>
                  {counts.low}
                </Typography>
                <Typography
                  component="span"
                  className={classes.badgeLabel}
                  style={{ backgroundColor: getSeverityColor('low') }}
                >
                  L
                </Typography>
              </Box>
            )}
            {counts.total === 0 && (
              <Typography variant="body2" color="textSecondary">
                No issues
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      title: 'Total',
      field: 'counts.total',
      render: row => row.counts?.total ?? 0,
      width: '80px',
      customSort: (a, b) => (b.counts?.total ?? 0) - (a.counts?.total ?? 0),
    },
    {
      title: 'PR Scanning',
      field: 'isPrScanningEnabled',
      render: row => (row.isPrScanningEnabled ? 'Enabled' : 'Disabled'),
      width: '120px',
    },
    {
      title: 'Last Scanned',
      field: 'lastScannedAt',
      render: row => {
        if (!row.lastScannedAt) return 'Never';
        const date = new Date(row.lastScannedAt);
        return date.toLocaleDateString();
      },
      width: '120px',
    },
    {
      title: 'Actions',
      render: row => {
        const entityName = toEntityName(row);
        return (
          <Box className={classes.actionLinks}>
            {entityName && (
              <Link to={`/catalog/default/component/${entityName}`} onClick={e => e.stopPropagation()}>
                <OpenInBrowserIcon style={{ fontSize: '1.1rem', verticalAlign: 'middle' }} titleAccess="View in Backstage" />
              </Link>
            )}
            {row.url && (
              <Link to={row.url} onClick={e => e.stopPropagation()}>
                <LaunchIcon style={{ fontSize: '1rem', verticalAlign: 'middle' }} titleAccess="Open Repository" />
              </Link>
            )}
          </Box>
        );
      },
      width: '80px',
    },
  ];

  if (loading) {
    return (
      <Content className={classes.root}>
        <ContentHeader title="Security Overview" />
        <Progress />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className={classes.root}>
        <ContentHeader title="Security Overview" />
        <ResponseErrorPanel error={error} />
      </Content>
    );
  }

  if (!repositories || repositories.length === 0) {
    return (
      <Content className={classes.root}>
        <ContentHeader title="ZeroPath">
          <SupportButton>
            View security vulnerabilities across all repositories scanned by ZeroPath.
          </SupportButton>
        </ContentHeader>
        <EmptyState
          title="No repositories found"
          description="No repositories are currently being scanned by ZeroPath. Add repositories in the ZeroPath dashboard to see them here."
          missing="data"
        />
      </Content>
    );
  }

  return (
    <Content className={classes.root}>
      <ContentHeader title="ZeroPath">
        <SupportButton>
          View security vulnerabilities across all repositories scanned by ZeroPath.
        </SupportButton>
      </ContentHeader>

      {/* Stats Section */}
      <Box className={classes.statsSection}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4} md={2}>
            <Card className={classes.statCard}>
              <CardContent>
                <Typography className={`${classes.statValue} ${classes.totalText}`}>
                  {aggregateStats.repos}
                </Typography>
                <Typography className={classes.statLabel}>Repositories</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card className={classes.statCard}>
              <CardContent>
                <Typography className={`${classes.statValue} ${classes.criticalText}`}>
                  {aggregateStats.critical}
                </Typography>
                <Typography className={classes.statLabel}>Critical</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card className={classes.statCard}>
              <CardContent>
                <Typography className={`${classes.statValue} ${classes.highText}`}>
                  {aggregateStats.high}
                </Typography>
                <Typography className={classes.statLabel}>High</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card className={classes.statCard}>
              <CardContent>
                <Typography className={`${classes.statValue} ${classes.mediumText}`}>
                  {aggregateStats.medium}
                </Typography>
                <Typography className={classes.statLabel}>Medium</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card className={classes.statCard}>
              <CardContent>
                <Typography className={`${classes.statValue} ${classes.lowText}`}>
                  {aggregateStats.low}
                </Typography>
                <Typography className={classes.statLabel}>Low</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Card className={classes.statCard}>
              <CardContent>
                <Typography className={classes.statValue}>
                  {aggregateStats.total}
                </Typography>
                <Typography className={classes.statLabel}>Total Issues</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Repositories Table */}
      <Box className={classes.tableSection}>
        <Table
          title={`${repositories.length} Repositories`}
          columns={columns}
          data={repositories}
          options={{
            search: true,
            paging: true,
            pageSize: 20,
            pageSizeOptions: [10, 20, 50],
            sorting: true,
            padding: 'dense',
          }}
        />
      </Box>
    </Content>
  );
};
