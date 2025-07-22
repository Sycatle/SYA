import ChatRoom from "./ChatRoom";
import { getServerAuth } from "@lib/server-auth";
import { ApiClient } from "@lib/api-client";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const auth = await getServerAuth();
    if (auth) {
      const client = new ApiClient();
      client.setToken(auth.token);
      const conv = await client.getConversation(id);
      return { title: conv.conversation.title };
    }
  } catch (err) {
    console.error(err);
  }
  return { title: "Conversation" };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const auth = await getServerAuth();
  if (!auth) redirect("/login");
  const username = auth.user.display_name || auth.user.email;
  return <ChatRoom token={auth.token} username={username} conversationId={id} />;
}
