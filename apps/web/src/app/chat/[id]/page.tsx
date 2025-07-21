import ChatRoom from "./ChatRoom";
import { getServerAuth } from "@lib/server-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const auth = await getServerAuth();
  if (!auth) redirect("/login");
  const username = auth.user.display_name || auth.user.email;
  return <ChatRoom token={auth.token} username={username} conversationId={id} />;
}
