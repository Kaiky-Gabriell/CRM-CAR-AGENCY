const isDev = import.meta.env.DEV;

export const logger = {
  debug: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
  },
  error: (message: string, error?: unknown) => {
    if (isDev) {
      console.error(message, error);
    } else {
      // In production, we might want to send this to a service like Sentry
      // But we avoid logging sensitive details to the browser console
      console.error('An unexpected error occurred.');
    }
  },
};
