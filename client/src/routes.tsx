import { IRoutesConfig } from 'auth-react-router';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from './pages/login-page';
import WorkspacePage from './pages/workspace/workspace-page';
import Header from './shared/header/header';
import { useRecoilValue } from 'recoil';
import { allWorkspacesAtom, authorizationStatusAtom } from './recoil/atoms';

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
        navigate('/workspace');
      } else {
        navigate('/login');
      }
    }
  }, [authStatus]);

  return null;
};

const RedirectToWorkspacePage = () => {
  // TODO: fetch all workspaces and redirect to first one
  const allWorkspaces = useRecoilValue(allWorkspacesAtom);
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/workspace/${allWorkspaces[0].id}`);
  }, []);

  return null;
};

export const routes: IRoutesConfig = {
  publicRedirectRoute: '/login',
  privateRedirectRoute: '/workspace',
  InvalidUserRoleFallback: () => null,
  public: [
    {
      path: '/login',
      component: <LoginPage />,
    },
  ],
  private: [
    {
      path: '/workspace',
      component: <PrivatePagesOutlet />,
      children: [
        {
          index: true,
          component: <RedirectToWorkspacePage />,
        },
        {
          path: ':workspaceId',
          component: <WorkspacePage />,
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
