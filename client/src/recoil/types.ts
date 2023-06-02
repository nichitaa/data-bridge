export interface Workspace {
  name?: string;
  id: string;
}

export interface WorkspaceInfo {
  activityHistories: {
    action: string;
    actionPerformedTime: string;
    entityName: string;
    entityType: string;
    id: string;
    userName: string;
    workspaceId: string;
  }[];
  collaborators: CollaboratorInfo[];
  dataBaseType: number;
  collections: CollectionInfo[];
  schema: {
    tableName: string;
    columns: string[];
  }[];
  dbConnectionString: string;
  envVariables: string;
  id: string;
  name: string;
  userId: string;
}

interface CollaboratorInfo {
  role: string;
  id: string;
  userId: string;
  email: string;
  workspaceId: string;
}

interface CollectionInfo {
  folders: FolderInfo[];
  id: string;
  name: string;
  workspaceId: string;
}

interface FolderInfo {
  queries: QueryInfo[];
  collectionId: string;
  id: string;
  name: string;
}

export interface QueryInfo {
  collectionId: string;
  count: number | null;
  documentation: string;
  folderId: string;
  id: string;
  name: string;
  rawSql: string;
  size: number | null;
  snapshot: string | null;
  cronJob: null | {
    cronExpresion: string;
    emailList: string;
    id: string;
    queryId: string;
  };
}

export interface QueryResult {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  pageSize: number;
  results: Record<string, string>[];
  totalCount: number;
  totalPages: number;
  loading?: boolean;
}

export interface CurrentWorkspaceUserPresence {
  metas: Array<{
    workspace_id: string;
    user_email: string;
    user_id: string;
  }>;
}
