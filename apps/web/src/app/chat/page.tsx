"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@contexts/AuthContext";
import { apiClient, type Conversation } from "@lib/api-client";

export default function ChatListPage() {
  const { token, loading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (!loading && !token) {
      router.push("/login");
    }
  }, [loading, token, router]);

  useEffect(() => {
    if (token) {
      apiClient
        .listConversations()
        .then(setConversations)
        .catch((err) => console.error(err));
    }
  }, [token]);

  const handleNew = async () => {
    if (!token) return;
    try {
      const conv = await apiClient.createConversation({});
      router.push(`/chat/${conv.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) return <p className="p-4">Chargement...</p>;

  return (
    <div className="max-w-6xl mx-auto py-28 px-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Conversations</h1>
        <button
          className="p-2 bg-blue-600 text-white rounded"
          onClick={handleNew}
        >
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
