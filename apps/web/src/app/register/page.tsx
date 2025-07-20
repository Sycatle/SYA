import { redirect } from 'next/navigation';
import { getServerAuth } from '@lib/server-auth';
import RegisterForm from './RegisterForm';

export default async function RegisterPage() {
  const auth = await getServerAuth();
  if (auth) redirect('/chat');
  return <RegisterForm />;
}
