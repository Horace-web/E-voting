import * as Sentry from "@sentry/react";

const parseSampleRate = (value, fallback) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return fallback;
  if (parsed < 0 || parsed > 1) return fallback;
  return parsed;
};

export const initSentry = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  const enabled = import.meta.env.VITE_SENTRY_ENABLED === "true";

  if (!enabled || !dsn) return;

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: parseSampleRate(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE, 0.1),
    attachStacktrace: true,
  });
};

export default Sentry;
