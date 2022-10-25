import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Button onClick={() => navigate('/dashboard/123asdf')}>dashboard/123asdf</Button>
    </>
  );
};

export default HomePage;
