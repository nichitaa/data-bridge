export const config = {
  gatewayWSBaseUrl: `ws://${import.meta.env.VITE_GATEWAY_HOST_PORT}`,
  gatewayHttpBaseUrl: `http://${import.meta.env.VITE_GATEWAY_HOST_PORT}`,
} as const;
