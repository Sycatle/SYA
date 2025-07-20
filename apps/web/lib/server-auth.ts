import { cookies } from 'next/headers';
import apiClient, { type AuthResponse } from './api-client';

export async function getServerAuth(): Promise<AuthResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) return null;

  try {
    apiClient.setToken(token); // 💡 Injecte le token dans ton client centralisé
    const res = await apiClient.fetchMe(); // utilise Authorization
    cookieStore.set('authToken', res.token, { path: '/' });
    return res;
  } catch {
    return null;
  }
}
