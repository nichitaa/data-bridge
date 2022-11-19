export interface Workspace {
  name?: string;
  id: string;
}

export interface WorkspaceInfo {
  $id: string;
  id: string;
  name: string;
  userId: string;
  collections: any[];
  dbConnectionString: string;
  documentation: string;
  defaultConfigsForQueries?: null;
  envVariables?: string;
  inviteLink?: null;
  users?: string;
  usersLimit?: number;
  usersList?: string[];
}

export interface CurrentWorkspaceUserPresence {
  metas: Array<{
    workspace_id: string;
    user_name: string;
    user_id: string;
  }>;
}
