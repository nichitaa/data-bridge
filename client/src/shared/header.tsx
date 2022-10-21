import {
  AppBar,
  Avatar,
  Box,
  darken,
  IconButton,
  Menu,
  menuClasses,
  MenuItem,
  styled,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState, MouseEvent } from 'react';
import { useAuthHandlers } from '../hooks/use-jwt-auth';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { logout } = useAuthHandlers();

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
          <Typography variant='h6' color='inherit' component='div'>
            dbruh
          </Typography>
        </Box>
        <IconButton onClick={handleMenuOpen}>
          <Avatar sx={{ maxWidth: 24, height: 24 }}>N</Avatar>
        </IconButton>
        <StyledMenu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={logout}>
            <Typography component={'div'} fontSize={'14px'} textAlign='center'>
              Logout
            </Typography>
          </MenuItem>
        </StyledMenu>
      </Toolbar>
    </AppBar>
  );
};

const StyledMenu = styled(Menu)(({ theme }) => ({
  [`& .${menuClasses.list}`]: {
    padding: 0,
  },
}));

export default Header;
