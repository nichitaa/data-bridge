import { IRoutesConfig } from 'auth-react-router';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from './pages/login-page';
import DashboardPage from './pages/dashboard/dashboard-page';
import Header from './shared/header';
import { useRecoilValue } from 'recoil';
import { authorizationStatusAtom } from './recoil/atoms';
import HomePage from './pages/home/home-page';

const PrivatePagesOutlet = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

const CheckAuthPage = () => {
  const navigate = useNavigate();
  const authStatus = useRecoilValue(authorizationStatusAtom);

  useEffect(() => {
    console.log('[check-auth]: ', authStatus);
    if (!authStatus.loading) {
      if (authStatus.authorized) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }
  }, [authStatus]);

  return null;
};

export const routes: IRoutesConfig = {
  publicRedirectRoute: '/login',
  privateRedirectRoute: '/dashboard',
  InvalidUserRoleFallback: () => null,
  public: [
    {
      path: '/login',
      component: <LoginPage />,
    },
  ],
  private: [
    {
      path: '/dashboard',
      component: <PrivatePagesOutlet />,
      children: [
        {
          index: true,
          component: <HomePage />,
        },
        {
          path: ':workspaceId',
          component: <DashboardPage />,
        },
      ],
    },
  ],
  common: [
    {
      path: '/',
      component: <CheckAuthPage />,
    },
    {
      path: '*',
      component: <>Page not found</>,
    },
  ],
};
