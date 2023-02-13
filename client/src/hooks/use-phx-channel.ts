import { useEffect, useRef, useState } from 'react';
import { usePhxSocket } from './use-phx-socket';
import { PhxSocketStatus } from '../recoil/atoms';
import { logger } from '../utils/logger';

interface Params {
  channelName: string;
  channelParams?: any;
  joinOnMountLeaveOnUnmount?: boolean;
  onJoin?: (response: any) => void;
  onLeave?: (response: any) => void;
}

export enum PhxChannelStatus {
  CLOSED = 'CLOSED',
  ERRORED = 'ERRORED',
  JOINED = 'JOINED',
  JOINING = 'JOINING',
  LEAVING = 'LEAVING',
}

export const usePhxChannel = (params: Params) => {
  const { socket, status: socketStatus } = usePhxSocket();
  const [channelStatus, setChannelStatus] = useState(PhxChannelStatus.CLOSED);
  const {
    channelName,
    joinOnMountLeaveOnUnmount = false,
    channelParams = {},
    onJoin,
    onLeave,
  } = params;

  if (socketStatus !== PhxSocketStatus.OPEN)
    throw new Error('PhxSocketStatus must be `OPEN`');

  if (!socket) throw new Error(`Phoenix Socket is undefined`);

  const channelRef = useRef(socket.channel(channelName, channelParams));

  useEffect(() => {
    if (joinOnMountLeaveOnUnmount) {
      join();

      return leave;
    }
  }, [channelRef, joinOnMountLeaveOnUnmount]);

  const leave = () => {
    // already disconnected from the channel
    if (channelStatus === PhxChannelStatus.CLOSED)
      return logger.warn('already left the channel');

    setChannelStatus(PhxChannelStatus.LEAVING);
    channelRef.current
      .leave()
      .receive('ok', (response) => {
        onLeave?.(response);
        setChannelStatus(PhxChannelStatus.CLOSED);
      })
      .receive('error', (response) => {
        onLeave?.(response);
        setChannelStatus(PhxChannelStatus.ERRORED);
      });
    /**
     * reset Sockets' `Channel` instance
     * `.join` could be called only once per channel instance
     */
    channelRef.current = socket.channel(channelName, channelParams);
  };

  const join = () => {
    // already joined
    if (channelStatus === PhxChannelStatus.JOINED)
      return logger.warn('already joined the channel');

    // not joined
    setChannelStatus(PhxChannelStatus.JOINING);
    channelRef.current
      .join()
      .receive('ok', (response) => {
        onJoin?.(response);
        setChannelStatus(PhxChannelStatus.JOINED);
      })
      .receive('error', (response) => {
        onJoin?.(response);
        setChannelStatus(PhxChannelStatus.ERRORED);
        leave();
      });
    channelRef.current.onClose(() => {
      setChannelStatus(PhxChannelStatus.CLOSED);
    });
  };

  const push = (event: string, payload: any) => {
    return channelRef.current.push(event, payload);
  };

  const handleChannelEvent = (event: string, callback) => {
    return channelRef.current.on(event, callback);
  };

  return {
    channelStatus,
    channel: channelRef.current,
    handleChannelEvent,
    leave,
    join,
    push,
  };
};
