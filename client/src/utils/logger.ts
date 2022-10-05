const noop = () => undefined;

const disableLogs = import.meta.env.MODE === 'production' || false;
export const logger: Console = disableLogs
  ? (Object.fromEntries(
      Object.keys(console).map((key) => [key, noop])
    ) as unknown as Console)
  : console;
