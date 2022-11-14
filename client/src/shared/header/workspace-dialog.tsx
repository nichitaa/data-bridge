import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  TextField,
} from '@mui/material';
import { ChangeEventHandler, useState } from 'react';

interface WorkspaceDialog {
  dialogProps: DialogProps;
  type: 'edit' | 'create';
  connectionString?: string;
}

const WorkspaceDialog = (props: WorkspaceDialog) => {
  const { dialogProps, connectionString, type } = props;

  const [connectionStr, setConnectionStr] = useState<string>(
    connectionString ?? ''
  );

  const handleOnClose: DialogProps['onClose'] = (event, reason) => {
    // discard changes
    setConnectionStr(connectionString ?? '');
    dialogProps.onClose?.(event, reason);
  };

  const handleConnectionStringChange: ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (event) => {
    setConnectionStr(event.target.value);
  };

  const handleTestConnection = () => {};
  const handleCreateWorkspace = () => {};
  const handleSaveWorkspace = () => {};
  return (
    <Dialog {...dialogProps} onClose={handleOnClose} maxWidth={'sm'} fullWidth>
      <DialogTitle>
        {type === 'create' ? 'Create new workspace' : 'Edit workspace'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Note! Test your connection before creating a new workspace
        </DialogContentText>

        <TextField
          autoComplete={'off'}
          value={connectionStr}
          onChange={handleConnectionStringChange}
          placeholder={'connection string'}
          autoFocus
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleTestConnection} color={'info'}>
          Test connection
        </Button>
        <Button
          onClick={
            type === 'create' ? handleCreateWorkspace : handleSaveWorkspace
          }
          color={'warning'}
        >
          {type === 'create' ? 'Create' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkspaceDialog;
