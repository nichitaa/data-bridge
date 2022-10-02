import { useEffect, useState } from 'react';

const testRequest = async () => {
  const base = import.meta.env.VITE_GATEWAY_BASE_URL;
  return await fetch(`${base}/api/health_check/env`).then(res => res.json());
};

const App = () => {
  const [r, setR] = useState(undefined);
  useEffect(() => {
    (async () => {
      const response = await testRequest();
      setR(response);
    })();
  }, []);
  return <>
    from app.tsx
    <pre>
      {JSON.stringify(r, null, 2)}
    </pre>
  </>;
};

export default App;
