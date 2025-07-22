"use client";

import { useRef, useEffect, useState } from "react";
import ChatInput from "@components/ChatInput";
import Messages from "@components/Messages";
import ModelCombobox from "@components/ModelCombobox";
import useChat from "@hooks/use-chat";
import apiClient from "@lib/api-client";

export default function ChatRoom({ username, token, conversationId }: { username: string; token: string; conversationId: string }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, sendMessage } = useChat(conversationId, token);
  const [models, setModels] = useState<string[]>([]);
  const [model, setModel] = useState<string>("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    apiClient.setToken(token);
    apiClient
      .getConversation(conversationId)
      .then((res) => setModel(res.conversation.model))
      .catch((err) => console.error(err));
    apiClient
      .listLocalModels()
      .then((res) => setModels(res.models.map((m) => m.name)))
      .catch((err) => console.error(err));
  }, [conversationId, token]);

  const handleModelChange = async (m: string) => {
    setModel(m);
    try {
      await apiClient.updateConversation(conversationId, { model: m });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Messages username={username} messages={messages} bottomRef={bottomRef} />
      <ChatInput onSend={sendMessage} isLoading={isLoading} offsetLeftClass="left-(--sidebar-width)">
        <ModelCombobox models={models} value={model} onChange={handleModelChange} />
      </ChatInput>
    </>
  );
}
