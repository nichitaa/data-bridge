import { AppRouter, Routes } from 'auth-react-router';
import { routes } from './routes';
import { useRecoilValue } from 'recoil';
import { authorizationStatusAtom } from './recoil/atoms';
import { useJwtAuth } from './hooks/use-jwt-auth';

const App = () => {
  const authStatus = useRecoilValue(authorizationStatusAtom);
  useJwtAuth();

  if (!authStatus.initialized) return null;

  return (
    <AppRouter routes={routes} isAuth={authStatus.authorized}>
      <Routes />
    </AppRouter>
  );
};

export default App;
