import { redirect } from 'next/navigation';
import { getServerAuth } from '@lib/server-auth';
import type { Metadata } from 'next';
import RegisterForm from './RegisterForm';

export const metadata: Metadata = {
  title: 'Inscription - SYA',
};

export default async function RegisterPage() {
  const auth = await getServerAuth();
  if (auth) redirect('/chat');
  return <RegisterForm />;
}
