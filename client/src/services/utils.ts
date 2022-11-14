import { config } from '../config/config';

const healthCheckRequest = async () =>
  await fetch(`${config.gatewayHttpBaseUrl}/api/health_check/env`).then((res) =>
    res.json()
  );
