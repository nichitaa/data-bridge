import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, MenuItem, Typography } from '@mui/material';
import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { StyledMenu } from './user-menu';
import WorkspaceDialog from './workspace-dialog';
import EditTeamDialog from './edit-team-dialog';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import {
  currentUserAtom,
  currentWorkspaceInfoAtom,
  workspaceChannelAtom,
} from '../../recoil/atoms';

const WorkspaceMenu = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const channel = useRecoilValue(workspaceChannelAtom);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openTeamDialog, setOpenTeamDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const currentUser = useRecoilValue(currentUserAtom);
  const workspace = useRecoilValue(currentWorkspaceInfoAtom);

  const isAdminUser = useMemo(() => {
    if (workspace && currentUser) {
      return workspace.collaborators.find(
        (x) => x.email === currentUser.userEmail && x.role === 'Admin'
      );
    }
    return false;
  }, [workspace, currentUser]);

  useEffect(() => {
    if (channel !== undefined) {
      channel.on('delete_workspace_response', (payload) => {
        if (payload.success) {
          // refresh
          navigate(0);
        }
      });
      return () => {
        // clean up subscriptions refs
        channel.off('delete_workspace_response');
      };
    }
  }, [channel]);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenCreateDialog = () => setOpenCreateDialog(true);
  const handleCloseCreateDialog = () => setOpenCreateDialog(false);

  const handleOpenEditDialog = () => setOpenEditDialog(true);
  const handleCloseEditDialog = () => setOpenEditDialog(false);

  const handleOpenTeamDialog = () => setOpenTeamDialog(true);
  const handleCloseTeamDialog = () => setOpenTeamDialog(false);

  const handleDeleteWorkspace = () => {
    channel?.push('delete_workspace', {});
  };

  return (
    <>
      <IconButton
        edge='start'
        color='inherit'
        aria-label='menu'
        onClick={handleMenuOpen}
      >
        <MenuIcon />
      </IconButton>
      <StyledMenu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleOpenCreateDialog}>
          <Typography component={'div'} fontSize={'14px'} textAlign='center'>
            Create workspace
          </Typography>
        </MenuItem>

        {isAdminUser && workspaceId !== undefined && (
          <MenuItem onClick={handleOpenEditDialog}>
            <Typography component={'div'} fontSize={'14px'} textAlign='center'>
              Edit workspace
            </Typography>
          </MenuItem>
        )}
        {isAdminUser && workspaceId !== undefined && (
          <MenuItem onClick={handleOpenTeamDialog}>
            <Typography component={'div'} fontSize={'14px'} textAlign='center'>
              Edit team
            </Typography>
          </MenuItem>
        )}
        {isAdminUser && workspaceId !== undefined && (
          <MenuItem onClick={handleDeleteWorkspace}>
            <Typography component={'div'} fontSize={'14px'} textAlign='center'>
              Delete workspace
            </Typography>
          </MenuItem>
        )}
      </StyledMenu>
      {/* Dialogs */}
      <WorkspaceDialog
        dialogProps={{
          open: openCreateDialog,
          onClose: handleCloseCreateDialog,
        }}
        type={'create'}
      />
      <WorkspaceDialog
        dialogProps={{
          open: openEditDialog,
          onClose: handleCloseEditDialog,
        }}
        type={'edit'}
      />
      <EditTeamDialog
        dialogProps={{
          open: openTeamDialog,
          onClose: handleCloseTeamDialog,
        }}
      />
    </>
  );
};

export default WorkspaceMenu;
