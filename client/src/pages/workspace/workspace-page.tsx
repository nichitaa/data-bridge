import {
  allWorkspacesAtom,
  jwtAtom,
  PhxSocketStatus,
} from '../../recoil/atoms';
import { useEffect, useState } from 'react';
import { usePhxSocket } from '../../hooks/use-phx-socket';
import { useRecoilValue } from 'recoil';
import { Socket } from 'phoenix';
import { config } from '../../config/config';
import WorkspaceView from './components/workspace-view/workspace-view';
import { Box, LinearProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

export const CheckWorkspacePage = () => {
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
  return <WorkspacePage />;
};

const WorkspacePage = () => {
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

  return <WorkspaceView />;
};

export default WorkspacePage;
