import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, MenuItem, Typography } from '@mui/material';
import { MouseEvent, useState } from 'react';
import { StyledMenu } from './user-menu';
import WorkspaceDialog from './workspace-dialog';
import EditTeamDialog from './edit-team-dialog';
import { useParams } from 'react-router-dom';

const WorkspaceMenu = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openTeamDialog, setOpenTeamDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

  return (
    <>
      <IconButton
        edge='start'
        color='inherit'
        aria-label='menu'
        onClick={handleMenuOpen}
        sx={{ mr: 2 }}
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
        {workspaceId !== undefined && (
          <MenuItem onClick={handleOpenEditDialog}>
            <Typography component={'div'} fontSize={'14px'} textAlign='center'>
              Edit workspace
            </Typography>
          </MenuItem>
        )}
        {workspaceId !== undefined && (
          <MenuItem onClick={handleOpenTeamDialog}>
            <Typography component={'div'} fontSize={'14px'} textAlign='center'>
              Edit team
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
