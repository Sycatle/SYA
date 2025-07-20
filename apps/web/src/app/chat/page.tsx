import { redirect } from 'next/navigation';
import { getServerAuth } from '@lib/server-auth';
import ChatList from './ChatList';

export const dynamic = "force-dynamic";

export default async function Page() {
  const auth = await getServerAuth();
  if (!auth) redirect('/login');
  return <ChatList token={auth.token} />;
}
