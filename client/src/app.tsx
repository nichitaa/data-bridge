import { AppRouter, Routes } from 'auth-react-router';
import { routes } from './routes';
import { useAuth } from './hooks/use-auth';

const App = () => {
  const { isAuthorized } = useAuth();
  return (
    <AppRouter routes={routes} isAuth={isAuthorized}>
      <Routes />
    </AppRouter>
  );
};

export default App;
