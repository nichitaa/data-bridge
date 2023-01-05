export interface Workspace {
  name?: string;
  id: string;
}

export interface WorkspaceInfo {
  $id: string;
  id: string;
  name: string;
  userId: string;
  collections: CollectionInfo[];
  dbConnectionString: string;
  documentation: string;
  defaultConfigsForQueries?: null;
  envVariables?: string;
  inviteLink?: null;
  users?: string;
  usersLimit?: number;
  usersList?: string[];
}

interface CollectionInfo {
  documentation: string;
  folders: FolderInfo[];
  id: string;
  isFavorite: boolean;
  name: string;
  shareLink: string;
  workspace: { $ref: string };
  workspaceId: string;
}

interface FolderInfo {
  queries: QueryInfo[];
  collectionId: string;
  documentation: string;
  id: string;
  name: string;
}

export interface QueryInfo {
  count: number;
  defaultResponseWithLimit: string;
  documentation: string;
  folderId: string;
  id: string;
  lastExecuteTime: number;
  name: string;
  rawSql: string;
  size: number;
}

export interface QueryResult {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  pageSize: number;
  results: Record<string, string>[];
  totalCount: number;
  totalPages: number;
}

export interface CurrentWorkspaceUserPresence {
  metas: Array<{
    workspace_id: string;
    user_name: string;
    user_id: string;
  }>;
}
