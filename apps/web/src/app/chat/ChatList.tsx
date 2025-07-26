"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient, type Conversation } from "@lib/api-client";
import { Trash2 } from "lucide-react";
import { useLanguage } from "@hooks/use-language";

export default function ChatList({ token }: { token: string }) {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { t } = useLanguage();

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

  const handleDelete = async (id: string) => {
    try {
      await apiClient.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-28 px-2">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{t("chat.conversations")}</h1>
        <button className="p-2 bg-primary text-primary-foreground rounded" onClick={handleNew}>
          {t("chat.new")}
        </button>
      </div>
      <ul className="gap-2">
        {conversations.map((c) => (
          <li key={c.id} className="p-2 bg-zinc-800 rounded flex items-center justify-between">
            <Link href={`/chat/${c.id}`} className="hover:underline flex-1">
              {c.title.length > 40 ? c.title.slice(0, 40) + "…" : c.title}
            </Link>
            <button
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={() => handleDelete(c.id)}
            >
              <Trash2 className="w-4 h-4" />
              <span className="sr-only">{t("chat.delete")}</span>
            </button>
          </li>
        ))}
        {conversations.length === 0 && (
          <li className="text-center text-gray-400">{t("chat.noConversations")}</li>
        )}
      </ul>
    </div>
  );
}
