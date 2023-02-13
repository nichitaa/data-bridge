import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  TextField,
} from '@mui/material';
import { KeyboardEventHandler, useState } from 'react';

interface RenameDialogProps extends Pick<DialogProps, 'open' | 'onClose'> {
  type: 'collection' | 'folder' | 'query';
  initialValue: string;
  onSubmit: (name: string, clearStateName: () => void) => void;
}

const RenameDialog = (props: RenameDialogProps) => {
  const { type, onSubmit, initialValue, ...dialogProps } = props;
  const [name, setName] = useState(initialValue);
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
          placeholder={`new ${type} name`}
          autoComplete={'off'}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onSubmit(name, clearName)}>Rename</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RenameDialog;
