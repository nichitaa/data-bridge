import { IRoutesConfig } from 'auth-react-router';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from './pages/login-page';
import WorkspacePage from './pages/workspace/workspace-page';
import Header from './shared/header/header';
import { useRecoilValue } from 'recoil';
import { authorizationStatusAtom } from './recoil/atoms';
import { useInitFetchAllWorkspaces } from './hooks/use-init-fetch-all-workspaces';

const PrivatePagesOutlet = () => {
  useInitFetchAllWorkspaces();
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
  const navigate = useNavigate();
  const allWorkspaces = useInitFetchAllWorkspaces();

  useEffect(() => {
    if (allWorkspaces?.[0]?.id) {
      navigate(`/workspace/${allWorkspaces?.[0]?.id}`);
    }
  }, [allWorkspaces]);

  return <>You can create a workspace at any time!</>;
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
