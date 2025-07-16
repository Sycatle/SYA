"use client";

import { useState } from "react";
import ChatInput from "@web/components/ChatInput";
import Messages from "@web/components/Messages";
import { sendPrompt, Message as ApiMessage } from "../../lib/api";

interface ChatMessage {
  isQuestion: boolean;
  content: string;
  background?: boolean;
  classes?: string[];
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const username = "Charlie";

  const handleSend = async (prompt: string) => {
    setMessages((prev) => [...prev, { isQuestion: true, content: prompt }]);
    setIsLoading(true);

    try {
      const history: ApiMessage[] = messages.map((m) => ({
        role: m.isQuestion ? "user" : "assistant",
        content: m.content,
      }));

      const res = await sendPrompt(prompt, history);
      if (res.response) {
        setMessages((prev) => [
          ...prev,
          { isQuestion: false, content: res.response },
        ]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Messages username={username} messages={messages} />
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </>
  );
}
