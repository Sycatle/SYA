"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient, type Conversation } from "@lib/api-client";

export default function ChatList({ token }: { token: string }) {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (token) {
      apiClient.setToken(token);
      const fetchData = () => {
        apiClient
          .listConversations()
          .then((convs) =>
            setConversations(
              convs.sort(
                (a, b) =>
                  new Date(b.updated_at).getTime() -
                  new Date(a.updated_at).getTime()
              )
            )
          )
          .catch((err) => console.error(err));
      };
      fetchData();
      const id = setInterval(fetchData, 15000);
      return () => clearInterval(id);
    }
  }, [token]);

  const handleNew = async () => {
    try {
      const conv = await apiClient.createConversation({});
      router.push(`/chat/${conv.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-28 px-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Conversations</h1>
        <button className="p-2 bg-blue-600 text-white rounded" onClick={handleNew}>
          Nouvelle conversation
        </button>
      </div>
      <ul className="space-y-2">
        {conversations.map((c) => (
          <li key={c.id} className="p-3 bg-zinc-800 rounded">
            <Link href={`/chat/${c.id}`} className="hover:underline">
              {c.title}
            </Link>
          </li>
        ))}
        {conversations.length === 0 && (
          <li className="text-center text-gray-400">Aucune conversation</li>
        )}
      </ul>
    </div>
  );
}
