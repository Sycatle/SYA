import { redirect } from 'next/navigation';
import { getServerAuth } from '@lib/server-auth';
import type { Metadata } from 'next';
import RegisterForm from './RegisterForm';
import en from '@web/languages/english.json';

export const metadata: Metadata = {
  title: `${en.register.title} - SYA`,
};

export default async function RegisterPage() {
  const auth = await getServerAuth();
  if (auth) redirect('/chat');
  return <RegisterForm />;
}
