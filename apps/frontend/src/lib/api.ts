import { ConversationSummary, ConversationDetail, Message } from '@/types/api';

/**
 * API base URL resolution:
 *
 * In the browser (client components):
 *   - Dev:  uses /api proxy rewrite (next.config.ts) → no CORS, no env needed
 *   - Prod: uses NEXT_PUBLIC_API_URL (set in .env.local or deployment env vars)
 *
 * In the server (SSR / Route handlers):
 *   - Always uses NEXT_PUBLIC_API_URL directly (no proxy available server-side)
 */
function getBaseUrl(): string {
  // Server-side rendering: must use full URL
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3001';
  }
  // Client-side in production: use the explicit backend URL
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // Client-side in development: use the Next.js proxy → avoids CORS entirely
  return '/api';
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const base = getBaseUrl();
  const url = `${base}${path}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(`API [${res.status}] ${path}: ${errorText}`);
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export const api = {
  conversations: {
    /** GET /conversations — list all with last message */
    list: (): Promise<ConversationSummary[]> =>
      apiFetch<ConversationSummary[]>('/conversations'),

    /** GET /conversations/:id/messages — full history */
    getMessages: (id: string): Promise<ConversationDetail> =>
      apiFetch<ConversationDetail>(`/conversations/${id}/messages`),

    /** POST /conversations/:id/reply — agent sends a message */
    sendReply: (id: string, message: string): Promise<Message> =>
      apiFetch<Message>(`/conversations/${id}/reply`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      }),

    /** PATCH /conversations/:id/status — toggle BOT ↔ HUMAN_TAKEOVER */
    updateStatus: (
      id: string,
      status: 'BOT' | 'HUMAN_TAKEOVER',
    ): Promise<ConversationSummary> =>
      apiFetch<ConversationSummary>(`/conversations/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },
};
