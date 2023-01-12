import {Box, BoxProps, Button, styled, TextField} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {useRecoilValue} from 'recoil';
import {workspaceChannelAtom} from '../../../../recoil/atoms';
import AddDialog from '../add-dialog/add-dialog';
import {useState} from 'react';
import {notificationService} from '../../../../services';

const ActionBar = () => {
  const channel = useRecoilValue(workspaceChannelAtom);
  const [openAddCollectionDialog, setOpenAddCollectionDialog] = useState(false);
  const handleAddCollection = (name: string, clearStateName: () => void) => {
    if (name.trim() === '') {
      return notificationService.notify({
        message: 'Name could not be empty',
        variant: 'error',
        method: 'create_collection',
      });
    }
    channel
      ?.push('create_resource', {name, type: 'collection'})
      .receive('ok', (response) => {
        if (response.success) {
          notificationService.notify({
            message: 'Collection created!',
            variant: 'success',
            method: 'create_collection',
          });
          setOpenAddCollectionDialog(false);
          clearStateName();
        } else {
          notificationService.notify({
            message: 'Could not create collection!',
            variant: 'error',
            method: 'create_collection',
          });
        }
      });
  };

  return (
    <>
      <StyledActionBar>
        <Button
          onClick={() => setOpenAddCollectionDialog(true)}
          startIcon={<AddIcon sx={{fontSize: 18}}/>}
        >
          Add
        </Button>
        <TextField autoComplete={'off'} placeholder={'Search'}></TextField>
      </StyledActionBar>
      <AddDialog
        type={'collection'}
        open={openAddCollectionDialog}
        onClose={() => setOpenAddCollectionDialog(false)}
        onSubmit={handleAddCollection}
      />
    </>
  );
};

const StyledActionBar = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  gap: 8,
}));

export default ActionBar;
