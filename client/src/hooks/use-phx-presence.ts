import { Channel, Presence, PresenceOpts } from 'phoenix';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const usePhxPresence = (
  channel: Channel | undefined,
  opts?: PresenceOpts
) => {
  const [sync, setSync] = useState<any[]>([]);

  const presence = useMemo(() => {
    if (channel !== undefined) {
      return new Presence(channel, opts);
    }
  }, [channel]);

  useEffect(() => {
    presence?.onSync(() => {
      setSync(presence.list());
    });
  }, [presence]);

  const onJoinCallback = useCallback(
    (cb) => presence?.onJoin(cb),
    [channel, presence]
  );

  const onLeaveCallback = useCallback(
    (cb) => presence?.onLeave(cb),
    [channel, presence]
  );

  const onSyncCallback = useCallback((cb) => cb(sync), [presence, sync]);

  return {
    presence: presence,
    handlePresenceJoin: onJoinCallback,
    handlePresenceLeave: onLeaveCallback,
    handlePresenceSync: onSyncCallback,
  };
};
