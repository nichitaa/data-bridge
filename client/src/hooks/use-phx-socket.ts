import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { PhxSocketStatus, socketAtom, socketStatusAtom } from '../recoil/atoms';
import { Socket } from 'phoenix';
import { logger } from '../utils/logger';

export const usePhxSocket = () => {
  const [socket, setSocket] = useRecoilState(socketAtom);
  const [status, setStatus] = useRecoilState(socketStatusAtom);

  useEffect(() => {
    socket?.onOpen(() => setStatus(PhxSocketStatus.OPEN));
    socket?.onClose(() => {
      setStatus(PhxSocketStatus.CLOSING);
      disconnect();
    });
    socket?.onError(() => setStatus(PhxSocketStatus.CLOSED));
  }, [socket]);

  const connect = useCallback((socketArg?: Socket) => {
    const s = socketArg ? socketArg : socket;
    if (s?.isConnected()) return logger.warn('already connected to socket');

    // connecting for real
    setStatus(PhxSocketStatus.CONNECTING);
    if (socketArg) {
      socketArg.connect();
      setSocket(socketArg);
    } else {
      socket?.connect();
    }
  }, []);

  const disconnect = useCallback(() => {
    socket?.disconnect();
  }, [socket]);

  return {
    socket,
    connect,
    status,
    disconnect,
  };
};
