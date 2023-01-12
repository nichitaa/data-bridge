import {useRecoilState, useRecoilValue} from 'recoil';
import {currentUserAtom, jwtAtom} from '../../recoil/atoms';
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  menuClasses,
  MenuItem,
  styled,
  Typography,
} from '@mui/material';
import {MouseEvent, useEffect, useState} from 'react';
import {useAuthHandlers} from '../../hooks/use-jwt-auth';
import {authService, notificationService} from '../../services';
import {TOAST_VARIANT} from '../toast/toast.types';

const UserMenu = () => {
  const jwt = useRecoilValue(jwtAtom);
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const {logout} = useAuthHandlers();

  useEffect(() => {
    (async () => {
      if (jwt !== undefined) {
        const response = await authService.getSelf(jwt);
        if (response.success) {
          setCurrentUser(response.data);
        } else {
          notificationService.notify({
            variant: TOAST_VARIANT.error,
            message: response.error,
            method: 'getSelf',
          });
        }
      }
    })();
  }, [jwt]);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box sx={{paddingLeft: '15px'}}>
      <IconButton onClick={handleMenuOpen}>
        <Avatar
          sx={{
            maxWidth: 24,
            height: 24,
            backgroundColor: (theme) => theme.palette.primary.main,
          }}
        >
          {/* first letter */}
          {currentUser?.userEmail[0]}
        </Avatar>
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
    </Box>
  );
};

export const StyledMenu = styled(Menu)(({theme}) => ({
  [`& .${menuClasses.list}`]: {
    padding: 0,
  },
}));

export default UserMenu;
