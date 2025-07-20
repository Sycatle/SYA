import ChatRoom from "./ChatRoom";
import { getServerAuth } from "@lib/server-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const auth = await getServerAuth();
  if (!auth) redirect("/login");
  const username = auth.user.display_name || auth.user.email;
  return (
    <ChatRoom token={auth.token} username={username} conversationId={params.id} />
  );
}
