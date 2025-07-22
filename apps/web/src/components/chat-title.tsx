// components/ChatTitle.tsx
"use client";
import { useEffect, useState } from "react";
import apiClient from "@lib/api-client";

export default function ChatTitle({ conversationId, initialTitle }: { conversationId: string; initialTitle: string }) {
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    // Option : tu peux ajouter un polling ou websocket pour les updates live
    setTitle(initialTitle); // reset on id change
  }, [conversationId, initialTitle]);

  // Optionnel : polling toutes les 5s
  useEffect(() => {
    if (!conversationId) return;
    const interval = setInterval(async () => {
      const conv = await apiClient.getConversation(conversationId);
      setTitle(conv.conversation.title);
    }, 5000);
    return () => clearInterval(interval);
  }, [conversationId]);

  return (
    <h1 className="font-semibold truncate max-w-[12rem] sm:max-w-none">
      {title}
    </h1>
  );
}
