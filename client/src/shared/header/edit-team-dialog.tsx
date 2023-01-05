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
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { allWorkspaceCollaboratorsAtom } from '../../recoil/atoms';
import { useRecoilValue } from 'recoil';

interface EditTeamDialog {
  dialogProps: DialogProps;
}

const EditTeamDialog = (props: EditTeamDialog) => {
  const allWorkspaceCollaborators = useRecoilValue(
    allWorkspaceCollaboratorsAtom
  );

  const { dialogProps } = props;
  return (
    <Dialog {...dialogProps} maxWidth={'sm'} fullWidth>
      <DialogTitle>Edit team</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Add or remove collaborators from current workspace
        </DialogContentText>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            autoComplete={'off'}
            placeholder={'email'}
            autoFocus
            fullWidth
          />
          <Button
            color={'success'}
            startIcon={<PersonAddIcon sx={{ fontSize: 18 }} />}
          >
            Invite
          </Button>
        </Box>
        <List dense>
          {allWorkspaceCollaborators.map((c) => {
            return (
              <ListItem
                key={c.userId}
                secondaryAction={
                  <IconButton
                    edge='end'
                    size={'small'}
                    color={'error'}
                    sx={{ borderRadius: '4px' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>{c.username[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={c.username} />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default EditTeamDialog;
