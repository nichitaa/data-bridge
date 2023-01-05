import { usePhxSocket } from './use-phx-socket';
import { PhxSocketStatus } from '../recoil/atoms';
import { useEffect, useState } from 'react';
import { Channel } from 'phoenix';
import { atom, RecoilState, useSetRecoilState } from 'recoil';

interface Params {
  topic: string;
  /** reacts only on subtopic value change */
  subtopic?: string;
  onJoin?: (response: any) => void;
  onLeave?: (response: any) => void;
  /** in case Channel instance should be saved to an atom */
  recoilAtom?: RecoilState<Channel | undefined>;
}

/** in case `recoilAtom` is undefined */
const fallbackChannelAtom = atom<undefined | Channel>({
  key: 'fallbackChannelAtom',
  default: undefined,
});

export const usePhoenixChannel = (params: Params) => {
  const { socket, status: socketStatus } = usePhxSocket();
  const { topic, subtopic, onJoin, onLeave, recoilAtom } = params;

  if (!socket) throw new Error(`Phoenix Socket is undefined`);
  if (socketStatus !== PhxSocketStatus.OPEN)
    throw new Error('PhxSocketStatus must be `OPEN`');
  const [channel, setChannel] = useState<undefined | Channel>(undefined);
  const setChannelAtom = useSetRecoilState(
    recoilAtom !== undefined ? recoilAtom : fallbackChannelAtom
  );

  useEffect(() => {
    if (subtopic !== undefined) {
      const channelName = `${topic}:${subtopic}`;
      console.log('[phx-channel-mount] joining: ', channelName);
      const phxChannel = socket.channel(channelName);
      phxChannel
        .join()
        .receive('ok', (response) => {
          onJoin?.(response);
          setChannel(phxChannel);
          if (recoilAtom !== undefined) {
            setChannelAtom(phxChannel);
          }
        })
        .receive('error', (response) => {
          onJoin?.(response);
          phxChannel.leave();
        });

      return () => {
        console.log('[phx-channel-unmount] leaving: ', channelName);
        phxChannel
          .leave()
          .receive('ok', (response) => {
            onLeave?.(response);
            setChannel(undefined);
            if (recoilAtom) {
              setChannelAtom(undefined);
            }
          })
          .receive('error', (response) => {
            onLeave?.(response);
            setChannel(undefined);
            if (recoilAtom) {
              setChannelAtom(undefined);
            }
          });
      };
    }
  }, [subtopic]);

  return {
    channel,
  };
};
