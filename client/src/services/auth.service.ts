import { config } from '../config/config';
import { APIResponse } from './types';

interface AuthServiceAPI {
  login: (payload: {
    email: string;
    password: string;
  }) => Promise<APIResponse<{ token: string; userName: string }>>;
  register: (payload: {
    email: string;
    password: string;
  }) => Promise<APIResponse<{ token: string; userName: string }>>;
  getSelf: (
    jwt: string
  ) => Promise<APIResponse<{ userEmail: string; userId: string }>>;
}

export class AuthService implements AuthServiceAPI {
  private baseUrl = `${config.gatewayHttpBaseUrl}/api/auth`;
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public login: AuthServiceAPI['login'] = async (payload) => {
    return await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'content-type': 'application/json' },
    }).then((res) => res.json());
  };

  public register: AuthServiceAPI['register'] = async (payload) => {
    return await fetch(`${this.baseUrl}/register`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'content-type': 'application/json' },
    }).then((res) => res.json());
  };

  public getSelf: AuthServiceAPI['getSelf'] = async (jwt) => {
    return await fetch(`${this.baseUrl}/self`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${jwt}`,
      },
    }).then((res) => res.json());
  };
}
