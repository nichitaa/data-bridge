import { IRoutesConfig } from 'auth-react-router';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoginPage from './pages/login-page';
import Header from './shared/header/header';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  allWorkspacesAtom,
  authorizationStatusAtom,
  currentActiveUsersAtom,
  currentWorkspaceInfoAtom,
  jwtAtom,
  PhxSocketStatus,
  workspaceChannelAtom,
} from './recoil/atoms';
import { useInitFetchAllWorkspaces } from './hooks/use-init-fetch-all-workspaces';
import HistoryPage from './pages/history/history-page';
import { usePhxSocket } from './hooks/use-phx-socket';
import { Socket } from 'phoenix';
import { config } from './config/config';
import { Box, LinearProgress } from '@mui/material';
import WorkspacePage from './pages/workspace/workspace-page';
import { usePhoenixChannel } from './hooks/use-phoenix-channel';
import { usePhxPresence } from './hooks/use-phx-presence';

const PrivatePagesOutlet = () => {
  useInitFetchAllWorkspaces();
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

const CheckAuthPage = () => {
  const navigate = useNavigate();
  const authStatus = useRecoilValue(authorizationStatusAtom);

  useEffect(() => {
    if (!authStatus.loading) {
      if (authStatus.authorized) {
        navigate('/workspace');
      } else {
        navigate('/login');
      }
    }
  }, [authStatus]);

  return null;
};

const RedirectToWorkspacePage = () => {
  const navigate = useNavigate();
  const allWorkspaces = useRecoilValue(allWorkspacesAtom);

  useEffect(() => {
    if (allWorkspaces?.[0]?.id) {
      navigate(`/workspace/${allWorkspaces?.[0]?.id}`);
    }
  }, [allWorkspaces]);

  return null;
};

export const SyncWorkspaceInfoOutlet = () => {
  const { workspaceId } = useParams<{ workspaceId?: string }>();
  usePhoenixChannel({
    topic: `workspace`,
    subtopic: workspaceId,
    recoilAtom: workspaceChannelAtom,
  });
  const channel = useRecoilValue(workspaceChannelAtom);
  const [workspaceInfo, setWorkspaceInfo] = useRecoilState(
    currentWorkspaceInfoAtom
  );
  const setCurrentActiveUsers = useSetRecoilState(currentActiveUsersAtom);
  const { handlePresenceSync } = usePhxPresence(channel);

  /** subscribe to channel emissions */
  useEffect(() => {
    if (channel !== undefined) {
      channel.on('workspace_info', (payload) => {
        if (payload.success) {
          console.log('wpInfo: ', payload.data);
          setWorkspaceInfo(payload.data);
        }
      });
      return () => {
        // clean up subscriptions refs
        channel.off('workspace_info');
      };
    }
  }, [channel]);

  /** currently active users on this workspace */
  useEffect(() => {
    handlePresenceSync((presence) => {
      setCurrentActiveUsers(presence);
    });
  }, [handlePresenceSync]);

  return <Outlet />;
};

const CreateSocketConnectionOverlay = () => {
  const {
    connect: phxSocketConnect,
    status: phxSocketStatus,
    disconnect: phxSocketDisconnect,
  } = usePhxSocket();
  const jwt = useRecoilValue(jwtAtom);

  /** Establish a single socket connection */
  useEffect(() => {
    console.log('establishing socket connection');
    const socket = new Socket(`${config.gatewayWSBaseUrl}/socket`, {
      params: { jwt },
    });
    phxSocketConnect(socket);
    return phxSocketDisconnect;
  }, []);

  if (phxSocketStatus !== PhxSocketStatus.OPEN) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  return <SyncWorkspaceInfoOutlet />;
};

export const WorkspacePagesOutlet = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const allWorkspaces = useRecoilValue(allWorkspacesAtom);
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(false);
  useEffect(() => {
    if (allWorkspaces !== undefined && workspaceId !== undefined) {
      const found = allWorkspaces.find((w) => w.id === decodeURI(workspaceId));
      if (found) {
        setIsValid(true);
      } else {
        navigate('/workspace');
      }
    }
  }, [workspaceId, allWorkspaces]);

  if (!isValid) return null;
  return <CreateSocketConnectionOverlay />;
};

export const routes: IRoutesConfig = {
  publicRedirectRoute: '/login',
  privateRedirectRoute: '/workspace',
  InvalidUserRoleFallback: () => null,
  public: [
    {
      path: '/login',
      component: <LoginPage />,
    },
  ],
  private: [
    {
      path: '/workspace',
      component: <PrivatePagesOutlet />,
      children: [
        {
          index: true,
          component: <RedirectToWorkspacePage />,
        },
        {
          path: ':workspaceId',
          component: <WorkspacePagesOutlet />,
          children: [
            {
              index: true,
              component: <WorkspacePage />,
            },
            {
              path: 'history',
              component: <HistoryPage />,
            },
          ],
        },
      ],
    },
  ],
  common: [
    {
      path: '/',
      component: <CheckAuthPage />,
    },
    {
      path: '*',
      component: <>Page not found</>,
    },
  ],
};
