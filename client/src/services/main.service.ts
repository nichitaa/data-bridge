import { config } from '../config/config';
import { APIResponse } from './types';
import { Workspace } from '../recoil/types';

interface CreateUpdateWorkspaceRequest {
  name?: string;
  dbConnectionString?: string;
  defaultConfigsForQueries?: string;
  envVariables?: string;
  documentation?: string;
  usersLimit?: string;
  inviteLink?: string;
}

interface MainServiceAPI {
  listWorkspaces: (jwt: string) => Promise<APIResponse<Workspace[]>>;
  createWorkspace: (
    jwt: string,
    payload: CreateUpdateWorkspaceRequest
  ) => Promise<APIResponse<any>>;
  updateWorkspace: (
    jwt: string,
    workspaceId: string,
    payload: CreateUpdateWorkspaceRequest
  ) => Promise<APIResponse<any>>;
}

export class MainService implements MainServiceAPI {
  private baseUrl = `${config.gatewayHttpBaseUrl}/api/main`;
  private static instance: MainService;

  private constructor() {}

  public static getInstance(): MainService {
    if (!MainService.instance) {
      MainService.instance = new MainService();
    }
    return MainService.instance;
  }

  public listWorkspaces: MainServiceAPI['listWorkspaces'] = async (jwt) => {
    return await fetch(`${this.baseUrl}/workspace`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${jwt}`,
      },
    }).then((res) => res.json());
  };

  public createWorkspace: MainServiceAPI['createWorkspace'] = async (
    jwt,
    payload
  ) => {
    return await fetch(`${this.baseUrl}/workspace`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${jwt}`,
      },
    }).then((res) => res.json());
  };

  public updateWorkspace: MainServiceAPI['updateWorkspace'] = async (
    jwt,
    workspaceId,
    payload
  ) => {
    return await fetch(`${this.baseUrl}/workspace/${workspaceId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${jwt}`,
      },
    }).then((res) => res.json());
  };
}
