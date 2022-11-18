import { useEffect } from 'react';
import { mainService, notificationService } from '../services';
import { useRecoilState, useRecoilValue } from 'recoil';
import { allWorkspacesAtom, jwtAtom } from '../recoil/atoms';

export const useInitFetchAllWorkspaces = () => {
  const jwt = useRecoilValue(jwtAtom);
  const [allWorkspaces, setAllWorkspaces] = useRecoilState(allWorkspacesAtom);

  useEffect(() => {
    (async () => {
      if (jwt && allWorkspaces.length === 0) {
        const response = await mainService.listWorkspaces(jwt);
        if (response.success) {
          if (response.data.length > 0) {
            setAllWorkspaces(response.data);
          }
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

  return allWorkspaces;
};
