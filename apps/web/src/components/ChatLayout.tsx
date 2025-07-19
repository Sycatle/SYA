"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// Update the import path below if your api file is in a different location
import { listConversations, createConversation, Conversation } from "../../lib/api";
import { useAuth } from "@web/contexts/AuthContext";
import clsx from "clsx";

interface ChatLayoutProps {
  children: React.ReactNode;
  currentId?: string;
}

export default function ChatLayout({ children, currentId }: ChatLayoutProps) {
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
      listConversations(token)
        .then(setConversations)
        .catch((err) => console.error(err));
    }
  }, [token]);

  const handleNew = async () => {
    if (!token) return;
    try {
      const conv = await createConversation(token, {});
      router.push(`/chat/${conv.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) return <p className="p-4">Chargement...</p>;

  return (
    <div className="flex pt-16">
      <aside className="w-64 shrink-0 h-[calc(100vh-4rem)] overflow-y-auto border-r border-zinc-700 p-4 fixed top-16 left-0 bg-zinc-900">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Conversations</h2>
          <button
            className="p-1 bg-blue-600 text-white rounded"
            onClick={handleNew}
          >
            +
          </button>
        </div>
        <ul className="space-y-2">
          {conversations.map((c) => (
            <li key={c.id}>
              <Link
                href={`/chat/${c.id}`}
                className={clsx(
                  "block p-2 rounded hover:bg-zinc-800 text-white",
                  currentId === c.id && "bg-zinc-800"
                )}
              >
                {c.title}
              </Link>
            </li>
          ))}
          {conversations.length === 0 && (
            <li className="text-center text-gray-400">Aucune conversation</li>
          )}
        </ul>
      </aside>
      <div className="flex-1 ml-64">{children}</div>
    </div>
  );
}
