"use client";

import { useRef, useEffect } from "react";
import ChatInput from "@components/ChatInput";
import Messages from "@components/Messages";
import useChat from "@hooks/use-chat";

export default function ChatRoom({ username, token, conversationId }: { username: string; token: string; conversationId: string }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, sendMessage } = useChat(conversationId, token);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Messages username={username} messages={messages} bottomRef={bottomRef} />
      <ChatInput onSend={sendMessage} isLoading={isLoading} offsetLeftClass="left-(--sidebar-width)" />
    </>
  );
}
