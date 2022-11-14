import { useEffect } from 'react';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { authorizationStatusAtom, jwtAtom } from '../recoil/atoms';
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';
import isSameOrAfterPlugin from 'dayjs/plugin/isSameOrAfter';
import { authService, notificationService } from '../services';
import { TOAST_VARIANT } from '../shared/toast/toast.types';

dayjs.extend(isSameOrAfterPlugin);

export const useJwtAuth = () => {
  const jwt = useRecoilValue(jwtAtom);
  const setAuthStatus = useSetRecoilState(authorizationStatusAtom);
  const resetJWT = useResetRecoilState(jwtAtom);

  useEffect(() => {
    if (jwt) {
      const decoded = jwt_decode(jwt) as any;
      const exp = dayjs(decoded.exp * 1000);
      if (dayjs().isSameOrAfter(exp)) {
        // logout
        setAuthStatus((prev) => ({
          ...prev,
          loading: false,
          authorized: false,
        }));
        notificationService.notify({
          variant: TOAST_VARIANT.warning,
          message: 'Expired token, please login again',
          method: '',
        });
        resetJWT();
      } else {
        // automatically login
        setAuthStatus((prev) => ({
          ...prev,
          loading: false,
          authorized: true,
        }));
      }
    }
    setAuthStatus((prev) => ({ ...prev, initialized: true }));
  }, []);
};

export const useAuthHandlers = () => {
  const setJWT = useSetRecoilState(jwtAtom);
  const resetJWT = useResetRecoilState(jwtAtom);
  const setAuthStatus = useSetRecoilState(authorizationStatusAtom);

  const handleLogin = async (credentials: {
    username: string;
    password: string;
  }) => {
    setAuthStatus((prev) => ({ ...prev, loading: true }));
    const response = await authService.login(credentials);
    if (response.success) {
      setJWT(response.data.token);
      setAuthStatus((prev) => ({ ...prev, authorized: true, loading: false }));
      notificationService.notify({
        variant: TOAST_VARIANT.success,
        message: 'successfully logged in',
        method: '/login',
      });
      return true;
    } else {
      notificationService.notify({
        variant: TOAST_VARIANT.error,
        message: response.error,
        method: '/login',
      });
      setAuthStatus((prev) => ({ ...prev, loading: false }));
      return false;
    }
  };

  const handleRegister = async (credentials: {
    username: string;
    password: string;
  }) => {
    const response = await authService.register(credentials);
    if (response.success) {
      setJWT(response.data.token);
      setAuthStatus((prev) => ({ ...prev, authorized: true }));
      notificationService.notify({
        variant: TOAST_VARIANT.success,
        message: response.message || 'successfully registered',
        method: '/register',
      });
      return true;
    } else {
      notificationService.notify({
        variant: TOAST_VARIANT.error,
        message: response.error,
        method: '/register',
      });
      return false;
    }
  };

  const handleLogout = () => {
    setAuthStatus((prev) => ({ ...prev, authorized: false, loading: false }));
    resetJWT();
    notificationService.notify({
      variant: TOAST_VARIANT.warning,
      message: 'successfully logged out',
      method: '/logout',
    });
  };

  return {
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
};
