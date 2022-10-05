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