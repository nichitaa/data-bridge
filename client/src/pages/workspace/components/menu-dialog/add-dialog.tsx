import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  TextField,
} from '@mui/material';
import { KeyboardEventHandler, useState } from 'react';

interface AddDialogProps extends Pick<DialogProps, 'open' | 'onClose'> {
  type: 'collection' | 'folder' | 'query';
  onSubmit: (name: string, clearStateName: () => void) => void;
}

const AddDialog = (props: AddDialogProps) => {
  const { type, onSubmit, ...dialogProps } = props;
  const [name, setName] = useState('');
  const clearName = () => setName('');

  const handleOnKeyDown: KeyboardEventHandler = (event) => {
    if (event.key === 'Enter') {
      onSubmit(name, clearName);
    }
  };

  return (
    <Dialog {...dialogProps}>
      <DialogContent>
        <TextField
          autoFocus
          required
          value={name}
          onKeyDown={handleOnKeyDown}
          onChange={(e) => setName(e.target.value)}
          placeholder={`${type} name`}
          autoComplete={'off'}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onSubmit(name, clearName)}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDialog;
