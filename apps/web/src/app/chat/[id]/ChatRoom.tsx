"use client";

import { useState, useRef, useEffect } from "react";
import ChatInput from "@components/ChatInput";
import Messages from "@components/Messages";
import { apiClient, type MessageRow } from "@lib/api-client";

interface ChatMessage {
  isQuestion: boolean;
  content: string;
  background?: boolean;
  classes?: string[];
}

export default function ChatRoom({ username, token, conversationId }: { username: string; token: string; conversationId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef(messages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    apiClient.setToken(token);
    apiClient
      .getConversation(conversationId)
      .then((conv) => {
        const history = conv.messages
          .filter((m: MessageRow) => m.sender_role !== "system")
          .map((m: MessageRow) => ({
            isQuestion: m.sender_role === "user",
            content: m.content,
          }));
        setMessages(history);
      })
      .catch((err) => console.error(err));
  }, [conversationId, token]);

  const typeMessage = async (text: string, index: number) => {
    for (let i = 0; i < text.length; i++) {
      await new Promise((r) => setTimeout(r, 15));
      setMessages((prev) => {
        const newPrev = [...prev];
        if (newPrev[index]) {
          newPrev[index] = {
            ...newPrev[index],
            content: newPrev[index].content + text[i],
          };
        }
        return newPrev;
      });
    }
  };

  const handleSend = async (prompt: string) => {
    const userMessage: ChatMessage = {
      isQuestion: true,
      content: prompt,
    };

    setMessages((prev) => [...prev, userMessage]);

    const assistantMessage: ChatMessage = {
      isQuestion: false,
      content: "",
    };

    setIsLoading(true);

    let assistantIndex = -1;

    setMessages((prev) => {
      const updated = [...prev, assistantMessage];
      assistantIndex = updated.length - 1;
      return updated;
    });

    try {
      const res = await apiClient.addMessage(conversationId, prompt, "user");

      if (res.content) {
        await typeMessage(res.content, assistantIndex);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Messages username={username} messages={messages} bottomRef={bottomRef} />
      <ChatInput onSend={handleSend} isLoading={isLoading} offsetLeftClass="left-(--sidebar-width)" />
    </>
  );
}
