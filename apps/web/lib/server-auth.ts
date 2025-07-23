import { cookies } from 'next/headers';
import { ApiClient, type AuthResponse } from './api-client';

export async function getServerAuth(): Promise<AuthResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) return null;

  try {
    const client = new ApiClient();
    client.setToken(token);
    const res = await client.fetchMe();
    return { token, user: res.user };
  } catch {
    return null;
  }
}
