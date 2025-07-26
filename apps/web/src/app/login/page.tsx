import { redirect } from 'next/navigation';
import { getServerAuth } from '@lib/server-auth';
import type { Metadata } from 'next';
import LoginForm from './LoginForm';
import en from '@web/languages/english.json';

export const metadata: Metadata = {
  title: `${en.login.title} - SYA`,
};

export default async function LoginPage() {
  const auth = await getServerAuth();
  if (auth) redirect('/chat');
  return <LoginForm />;
}
