import { config } from './config/config';
import PhxExample from './components/phx-example';
import { useEffect } from 'react';

const healthCheckRequest = async () =>
  await fetch(`${config.gatewayHttpBaseUrl}/api/health_check/env`).then((res) =>
    res.json()
  );

const App = () => {
  useEffect(() => {
    (async () => {
      const response = await healthCheckRequest();
      console.log(response);
    })();
  }, []);
  return (
    <>
      <PhxExample />
    </>
  );
};

export default App;
