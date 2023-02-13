import { config } from '../config/config';
import { APIResponse } from './types';

interface DbServiceAPI {
  testConnection: (
    jwt: string,
    payload: { connectionString: string; dataBaseType: number }
  ) => Promise<APIResponse<boolean>>;
  downloadCsv: (
    jwt: string,
    payload: {
      connectionString: string;
      dataBaseType: number;
      queryString: string;
    }
  ) => Promise<Response>;
}

export class DbService implements DbServiceAPI {
  private baseUrl = `${config.gatewayHttpBaseUrl}/api/db`;
  private static instance: DbService;

  private constructor() {}

  public static getInstance(): DbService {
    if (!DbService.instance) {
      DbService.instance = new DbService();
    }
    return DbService.instance;
  }

  public testConnection: DbServiceAPI['testConnection'] = async (
    jwt,
    payload
  ) => {
    return await fetch(`${this.baseUrl}/test_connection`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${jwt}`,
      },
    }).then((res) => res.json());
  };

  public downloadCsv: DbServiceAPI['downloadCsv'] = async (jwt, payload) => {
    return await fetch(`${this.baseUrl}/export_to_csv`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${jwt}`,
      },
    });
  };
}
