import { AppBar, Box, Button, darken, Toolbar } from '@mui/material';
import CurrentWorkspaceSelect from './current-workspace-select';
import UserMenu from './user-menu';
import ActiveUsersAvatars from './active-users-avatars';
import WorkspaceMenu from './workspace-menu';
import { Link, useLocation, useParams } from 'react-router-dom';

const Header = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const location = useLocation();
  const lastPathname = location.pathname.split('/').at(-1);
  const isOnHistoryPage = lastPathname === 'history';
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WorkspaceMenu />
          <CurrentWorkspaceSelect />
          {workspaceId && (
            <Link
              style={{ textDecoration: 'none', color: 'inherit' }}
              to={isOnHistoryPage ? workspaceId : `${workspaceId}/history`}
            >
              <Button variant={'text'} size={'medium'}>
                {isOnHistoryPage ? 'Workspace' : 'Activity'}
              </Button>
            </Link>
          )}
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
