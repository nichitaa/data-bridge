import { usePhxSocket } from '../hooks/use-phx-socket';
import { useEffect, useState } from 'react';
import { PhxSocketStatus } from '../recoil/atoms';
import { usePhxChannel } from '../hooks/use-phx-channel';
import { logger } from '../utils/logger';
import { usePhxPresence } from '../hooks/use-phx-presence';

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

const uniqId = Math.random().toString();

export const PhxChannel = () => {
  const { disconnect } = usePhxSocket();
  const { channelStatus, channel, leave, join, push, handleChannelEvent } =
    usePhxChannel({
      channelName: 'workspace:lobby',
      channelParams: { token: uniqId },
      joinOnMountLeaveOnUnmount: true,
      onLeave: (response) => logger.log('onLeave response: ', response),
      //onJoin: (response) => logger.log('onJoin response: ', response),
    });
  const [currentActiveUsers, setCurrentActiveUsers] = useState([]);
  const { handlePresenceSync } = usePhxPresence(channel);

  useEffect(() => {
    handlePresenceSync((presence) => {
      setCurrentActiveUsers(presence);
    });
  }, [handlePresenceSync]);

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
      <br />
      active users {currentActiveUsers.length}
      <br />
      <button onClick={disconnect}>disconnect</button>
      <br />
      <button onClick={leave}>leave</button>
      <br />
      <button onClick={join}>join</button>
      <br />
      <button onClick={handlePush}>push</button>
    </>
  );
};

export default PhxExample;
