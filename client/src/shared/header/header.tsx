import { AppBar, Box, darken, Toolbar } from '@mui/material';
import CurrentWorkspaceSelect from './current-workspace-select';
import UserMenu from './user-menu';
import ActiveUsersAvatars from './active-users-avatars';
import WorkspaceMenu from './workspace-menu';

const Header = () => {
  return (
    <AppBar
      position='static'
      sx={{
        backgroundColor: (theme) =>
          darken(theme.palette.background.default, 0.4),
      }}
    >
      <Toolbar
        variant='dense'
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <WorkspaceMenu />
          <CurrentWorkspaceSelect />
        </Box>
        <Box sx={{ display: 'flex' }}>
          <ActiveUsersAvatars />
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
