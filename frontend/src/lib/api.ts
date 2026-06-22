/**
 * Centralized API configuration for Bondly backend.
 * All backend fetch calls must use this base URL — never hardcode localhost.
 *
 * Set VITE_BACKEND_URL in your .env file:
 *   Development: http://localhost:3000
 *   Production:  https://your-backend.railway.app
 */
export const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3000';

/** Typed fetch wrapper with consistent error handling */
export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!response.ok) {
    let message = `API error ${response.status}`;
    try {
      const body = await response.json();
      message = body.message ?? body.error ?? message;
    } catch {
      // ignore JSON parse failures — keep generic message
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
