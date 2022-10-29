import { Box, BoxProps, Button, styled, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ActionBar = () => {
  return (
    <StyledActionBar>
      <Button startIcon={<AddIcon sx={{ fontSize: 18 }} />}>Add</Button>
      <TextField autoComplete={'off'} placeholder={'Search'}></TextField>
    </StyledActionBar>
  );
};

const StyledActionBar = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  gap: 8,
}));

export default ActionBar;
