import { atom } from 'recoil';
import { Socket } from 'phoenix';
import { config } from '../config/config';

export enum PhxSocketStatus {
  UNINSTANTIATED = 'UNINSTANTIATED',
  CONNECTING = 'CONNECTING',
  OPEN = 'OPEN',
  CLOSING = 'CLOSING',
  CLOSED = 'CLOSED',
}

export const socketAtom = atom<Socket | undefined>({
  dangerouslyAllowMutability: true,
  key: 'socketAtom',
  default: new Socket(`${config.gatewayWSBaseUrl}/socket`),
});

export const socketStatusAtom = atom<PhxSocketStatus>({
  key: 'socketStatusAtom',
  default: PhxSocketStatus.UNINSTANTIATED,
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
  default: Number.MAX_VALUE,
});

export const documentationPanelMinSizeAtom = atom({
  key: 'documentationPanelMinSizeAtom',
  default: 30,
});

export const documentationPanelMaxSizeAtom = atom({
  key: 'documentationPanelMaxSizeAtom',
  default: 700,
});
