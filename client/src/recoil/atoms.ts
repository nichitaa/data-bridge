import { atom } from 'recoil';
import { Channel, Socket } from 'phoenix';
import { config } from '../config/config';
import { localStorageEffect } from './effects';
import {
  CurrentWorkspaceUserPresence,
  QueryInfo,
  QueryResult,
  Workspace,
  WorkspaceInfo,
} from './types';

export enum PhxSocketStatus {
  UNINSTANTIATED = 'UNINSTANTIATED',
  CONNECTING = 'CONNECTING',
  OPEN = 'OPEN',
  CLOSING = 'CLOSING',
  CLOSED = 'CLOSED',
}

export const socketAtom = atom<Socket | undefined>({
  key: 'socketAtom',
  default: new Socket(`${config.gatewayWSBaseUrl}/socket`),
  dangerouslyAllowMutability: true,
});

export const socketStatusAtom = atom<PhxSocketStatus>({
  key: 'socketStatusAtom',
  default: PhxSocketStatus.UNINSTANTIATED,
});

export const workspaceChannelAtom = atom<undefined | Channel>({
  key: 'workspaceChannelAtom',
  default: undefined,
  dangerouslyAllowMutability: true,
});

export const allWorkspacesAtom = atom<Workspace[] | undefined>({
  key: 'allWorkspacesAtom',
  default: undefined,
});

// Authorization
export const jwtAtom = atom<string | undefined>({
  key: 'jwtAtom',
  default: undefined,
  effects: [localStorageEffect('dbruh')],
});

export const authorizationStatusAtom = atom({
  key: 'authorizationStatusAtom',
  default: {
    /** will fetch token from localstorage first */
    initialized: false,
    loading: false,
    authorized: false,
  },
});

export const currentUserAtom = atom<
  { userEmail: string; userId: string } | undefined
>({
  key: 'currentUserAtom',
  default: undefined,
});

/** UI */
/** react-reflex mutates some props, therefore could not use a single atom with object as value */

// Collections Panel
export const collectionsPanelSizeAtom = atom({
  key: 'collectionsPanelSizeAtom',
  default: Number.MAX_VALUE,
});

export const collectionsPanelMinSizeAtom = atom({
  key: 'collectionsPanelMinSizeAtom',
  default: 30,
});

export const collectionsPanelMaxSizeAtom = atom({
  key: 'collectionsPanelMaxSizeAtom',
  default: 300,
});

// Documentation Panel
export const documentationPanelSizeAtom = atom({
  key: 'documentationPanelSizeAtom',
  default: 30,
});

export const documentationPanelMinSizeAtom = atom({
  key: 'documentationPanelMinSizeAtom',
  default: 30,
});

export const documentationPanelMaxSizeAtom = atom({
  key: 'documentationPanelMaxSizeAtom',
  default: 700,
});

// Current active users within a workspace
export const currentActiveUsersAtom = atom<CurrentWorkspaceUserPresence[]>({
  key: 'currentActiveUsersAtom',
  default: [],
  dangerouslyAllowMutability: true,
});

export const currentWorkspaceInfoAtom = atom<undefined | WorkspaceInfo>({
  key: 'currentWorkspaceInfoAtom',
  default: undefined,
});

export const currentSelectedQueryDataAtom = atom<undefined | QueryInfo>({
  key: 'currentSelectedQueryDataAtom',
  default: undefined,
});

export const currentSqlQueryAtom = atom<string>({
  key: 'currentSqlQueryAtom',
  default: '',
});

export const currentQueryDocsAtom = atom<string | undefined>({
  key: 'currentQueryDocsAtom',
  default: '',
});

export const currentQueryResultsAtom = atom<undefined | QueryResult>({
  key: 'currentQueryResultsAtom',
  default: undefined,
});

export const openedNodePathsAtom = atom<string[]>({
  key: 'openedNodePathsAtom',
  default: [],
});

export const collectionSearchFilterAtom = atom<string>({
  key: 'collectionSearchFilterAtom',
  default: '',
});
