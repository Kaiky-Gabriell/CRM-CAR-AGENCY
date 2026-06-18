/**
 * Sanitizes an input string to prevent basic XSS attacks.
 * Removes HTML tags, javascript pseudo-protocols, and inline event handlers.
 */
export function sanitizeString(input: string | undefined | null): string {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '') // Strip angle brackets
    .replace(/javascript:/gi, '') // Strip JS protocol
    .replace(/on\w+=/gi, '') // Strip event handlers
    .trim();
}
