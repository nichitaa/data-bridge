export interface Workspace {
  name: string;
  id: string;
}

export interface CurrentWorkspaceUserPresence {
  metas: Array<{
    workspace_id: string;
    user_name: string;
    user_id: string;
  }>;
}
