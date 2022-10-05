import { usePhxSocket } from '../hooks/use-phx-socket';
import { useEffect } from 'react';
import { PhxSocketStatus } from '../recoil/atoms';
import { usePhxChannel } from '../hooks/use-phx-channel';
import { logger } from '../utils/logger';

export const PhxExample = () => {
  const { connect, status } = usePhxSocket();

  useEffect(() => {
    connect();
  }, []);

  if (status === PhxSocketStatus.OPEN) {
    return <PhxChannel />;
  }

  return (
    <>
      {status}
      <button onClick={() => connect()}>connect</button>
    </>
  );
};

export const PhxChannel = () => {
  const { disconnect } = usePhxSocket();
  const { channelStatus, channel, leave, join, push, handleChannelEvent } =
    usePhxChannel({
      channelName: 'workspace:lobby',
      channelParams: { token: '123123' },
      joinOnMountLeaveOnUnmount: true,
      onLeave: (response) => logger.log('onLeave response: ', response),
      onJoin: (response) => logger.log('onJoin response: ', response),
    });

  useEffect(() => {
    const subscriptionRef = handleChannelEvent('from_server', (payload) => {
      console.log('[handleChannelEvent] from_server: ', payload);
    });
    return () => channel.off('from_server', subscriptionRef);
  }, [handleChannelEvent]);

  const handlePush = () => {
    const pushInstance = push('event_name', {});
    pushInstance
      .receive('ok', (response) => {
        logger.log('[push-ok]: ', response);
      })
      .receive('error', (response) => {
        logger.log('[push-error]: ', response);
      });
  };

  return (
    <>
      channel status {channelStatus}
      <button onClick={disconnect}>disconnect</button>
      <button onClick={leave}>leave</button>
      <button onClick={join}>join</button>
      <button onClick={handlePush}>push</button>
    </>
  );
};

export default PhxExample;