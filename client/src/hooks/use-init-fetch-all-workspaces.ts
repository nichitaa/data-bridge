import { useEffect } from 'react';
import { mainService, notificationService } from '../services';
import { useRecoilState, useRecoilValue } from 'recoil';
import { allWorkspacesAtom, jwtAtom } from '../recoil/atoms';

export const useInitFetchAllWorkspaces = () => {
  const jwt = useRecoilValue(jwtAtom);
  const [allWorkspaces, setAllWorkspaces] = useRecoilState(allWorkspacesAtom);

  useEffect(() => {
    (async () => {
      // fetched once
      if (jwt && allWorkspaces === undefined) {
        const response = await mainService.listWorkspaces(jwt);
        if (response.success) {
          setAllWorkspaces(response.data);
        } else {
          notificationService.notify({
            variant: 'error',
            method: 'listWorkspaces',
            message: 'error list workspaces',
          });
        }
      }
    })();
  }, [jwt, allWorkspaces]);
};
