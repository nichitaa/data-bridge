import { config } from '../config/config';
import { APIResponse } from './types';
import { Workspace } from '../recoil/types';

interface MainServiceAPI {
  listWorkspaces: (jwt: string) => Promise<APIResponse<Workspace[]>>;
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
}
