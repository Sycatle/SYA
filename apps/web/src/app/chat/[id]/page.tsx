import { redirect } from "next/navigation";
import { getServerAuth } from "@lib/server-auth";
import ChatPageClient from "./ChatPage";

export const dynamic = "force-dynamic";

export default async function Page() {
  const auth = await getServerAuth();
  if (!auth) redirect("/login");
  const username = auth.user.display_name || auth.user.email;
  return <ChatPageClient token={auth.token} username={username} />;
}
