import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  menuClasses,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {
  currentUserAtom,
  currentWorkspaceInfoAtom,
  workspaceChannelAtom,
} from '../../recoil/atoms';
import { useRecoilValue } from 'recoil';
import { notificationService } from '../../services';
import { useState } from 'react';

interface EditTeamDialog {
  dialogProps: DialogProps;
}

const EditTeamDialog = (props: EditTeamDialog) => {
  const currentWorkspaceInfo = useRecoilValue(currentWorkspaceInfoAtom);
  const currentUser = useRecoilValue(currentUserAtom);
  const channel = useRecoilValue(workspaceChannelAtom);
  const [inviteCollaboratorEmail, setInviteCollaboratorEmail] = useState('');

  const { dialogProps } = props;

  const handleUpdateUserRole = (email: string, role: string) => {
    const request = { role, email };
    channel
      ?.push('update_collaborator_role', request)
      .receive('ok', (response) => {
        if (response.success) {
          notificationService.notify({
            variant: 'success',
            message: `Updated ${email} role`,
            method: 'update_collaborator_role',
          });
        } else {
          notificationService.notify({
            variant: 'error',
            message: response.error,
            method: 'update_collaborator_role',
          });
        }
      });
  };

  const handleInviteCollaborator = () => {
    const request = { email: inviteCollaboratorEmail };
    channel?.push('add_collaborator', request).receive('ok', (response) => {
      if (response.success) {
        notificationService.notify({
          variant: 'success',
          message: `Invited ${inviteCollaboratorEmail} collaborator`,
          method: 'add_collaborator',
        });
        setInviteCollaboratorEmail('');
      } else {
        notificationService.notify({
          variant: 'error',
          message: response.error,
          method: 'add_collaborator',
        });
      }
    });
  };

  const handleRemoveCollaborator = (email: string) => {
    const request = { email };
    channel?.push('delete_collaborator', request).receive('ok', (response) => {
      if (response.success) {
        notificationService.notify({
          variant: 'success',
          message: `Removed ${inviteCollaboratorEmail} collaborator`,
          method: 'delete_collaborator',
        });
        setInviteCollaboratorEmail('');
      } else {
        notificationService.notify({
          variant: 'error',
          message: response.error,
          method: 'delete_collaborator',
        });
      }
    });
  };

  return (
    <Dialog {...dialogProps} maxWidth={'sm'} fullWidth>
      <DialogTitle>Edit team</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Add or remove collaborators from current workspace
        </DialogContentText>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            value={inviteCollaboratorEmail}
            onChange={(e) => setInviteCollaboratorEmail(e.target.value)}
            autoComplete={'off'}
            placeholder={'email'}
            autoFocus
            fullWidth
          />
          <Button
            color={'success'}
            startIcon={<PersonAddIcon sx={{ fontSize: 18 }} />}
            onClick={handleInviteCollaborator}
          >
            Invite
          </Button>
        </Box>
        <List dense>
          {currentWorkspaceInfo?.collaborators?.map((c) => {
            const isCurrentUser = c.email === currentUser?.userEmail;
            return (
              <ListItem
                key={c.id}
                secondaryAction={
                  <>
                    <Select
                      disabled={isCurrentUser}
                      value={c.role}
                      onChange={(e) =>
                        handleUpdateUserRole(c.email, e.target.value)
                      }
                      size={'small'}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            [`& .${menuClasses.list}`]: {
                              paddingTop: 0,
                              paddingBottom: 0,
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem key={'Admin'} value={'Admin'}>
                        Admin
                      </MenuItem>
                      <MenuItem key={'Collaborator'} value={'Collaborator'}>
                        Collaborator
                      </MenuItem>
                    </Select>
                    <IconButton
                      edge='end'
                      size={'small'}
                      color={'error'}
                      sx={{ borderRadius: '4px' }}
                      disabled={isCurrentUser}
                      onClick={() => handleRemoveCollaborator(c.email)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemAvatar>
                  <Avatar>{c?.email?.[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${c.email} (${c.role}${
                    isCurrentUser ? ' - You' : ''
                  })`}
                />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default EditTeamDialog;
