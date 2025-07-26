import { redirect } from 'next/navigation';
import { getServerAuth } from '@lib/server-auth';
import type { Metadata } from 'next';
import en from '@web/languages/english.json';

export const metadata: Metadata = {
  title: `${en.chat.conversations} - SYA`,
};

export default async function Page() {
  const auth = await getServerAuth();

  if (!auth) redirect('/login');

  return (
    <div className="flex h-full items-center justify-center text-muted-foreground">
      {en.chat.conversations}
    </div>
  );
}
