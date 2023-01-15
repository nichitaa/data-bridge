import {
  alpha,
  Box,
  BoxProps,
  InputAdornment,
  styled,
  TextField,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  collectionSearchFilterAtom,
  workspaceChannelAtom,
} from '../../../../recoil/atoms';
import AddDialog from '../menu-dialog/add-dialog';
import { useState } from 'react';
import { notificationService } from '../../../../services';
import { StyledActionIconButton } from '../editor-panel/editor-panel-actions';
import SearchIcon from '@mui/icons-material/Search';

const ActionBar = () => {
  const channel = useRecoilValue(workspaceChannelAtom);
  const [openAddCollectionDialog, setOpenAddCollectionDialog] = useState(false);
  const [search, setSearch] = useRecoilState(collectionSearchFilterAtom);
  const handleAddCollection = (name: string, clearStateName: () => void) => {
    if (name.trim() === '') {
      return notificationService.notify({
        message: 'Name could not be empty',
        variant: 'error',
        method: 'create_collection',
      });
    }
    channel
      ?.push('create_resource', { name, type: 'collection' })
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
        <Tooltip title={'New collection'}>
          <StyledActionIconButton
            onClick={() => setOpenAddCollectionDialog(true)}
            style={{
              width: 30,
              border: '1px solid red!important',
            }}
            variant={'primary'}
          >
            <AddIcon color={'primary'} />
          </StyledActionIconButton>
        </Tooltip>
        <TextField
          fullWidth
          autoComplete={'off'}
          placeholder={'search'}
          value={search}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon
                  sx={{
                    color: (theme) => alpha(theme.palette.primary.main, 0.9),
                  }}
                />
              </InputAdornment>
            ),
          }}
          onChange={(e) => setSearch(e.target.value)}
        />
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

const StyledActionBar = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  gap: 8,
}));

export default ActionBar;
