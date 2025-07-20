import { redirect } from 'next/navigation';
import { getServerAuth } from '@lib/server-auth';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  const auth = await getServerAuth();
  if (auth) redirect('/chat');
  return <LoginForm />;
}
