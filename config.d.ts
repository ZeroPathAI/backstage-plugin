export interface Config {
  zeropath?: {
    /**
     * ZeroPath API base URL
     * @visibility backend
     */
    baseUrl?: string;

    /**
     * ZeroPath organization identifier
     * @visibility frontend
     */
    organizationId: string;

    /**
     * ZeroPath API token ID (for backend entity provider)
     * @visibility secret
     */
    tokenId?: string;

    /**
     * ZeroPath API token secret (for backend entity provider)
     * @visibility secret
     */
    tokenSecret?: string;

    /**
     * Default owner for auto-created entities
     * @visibility backend
     */
    defaultOwner?: string;

    /**
     * Default system for auto-created entities
     * @visibility backend
     */
    defaultSystem?: string;

    /**
     * Entity annotation key used for repository matching
     * @visibility frontend
     * @default "github.com/project-slug"
     */
    repositoryAnnotation?: string;
  };
}
