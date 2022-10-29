import { AppBar, Box, darken, IconButton, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CurrentWorkspaceSelect from './current-workspace-select';
import UserMenu from './user-menu';
import ActiveUsersAvatars from './active-users-avatars';

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
          <IconButton
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
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
