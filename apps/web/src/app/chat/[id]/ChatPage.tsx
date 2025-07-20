"use client";
import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import ChatInput from "@components/ChatInput";
import Messages from "@components/Messages";
import ChatLayout from "@components/ChatLayout";
import { apiClient, type MessageRow } from "@lib/api-client";

interface ChatMessage {
  isQuestion: boolean;
  content: string;
  background?: boolean;
  classes?: string[];
}

export default function ChatPageClient({ username, token }: { username: string, token: string }) {
  const params = useParams();
  const conversationId = Array.isArray(params.id) ? params.id[0] : (params.id as string);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef(messages);

  useEffect(() => {
    if (conversationId) {
      apiClient
        .getConversation(conversationId)
        .then((conv) => {
          const history = conv.messages.map((m: MessageRow) => ({
            isQuestion: m.sender_role === "user",
            content: m.content,
          }));
          setMessages(history);
        })
        .catch((err) => console.error(err));
    }
  }, [conversationId]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const typeMessage = async (text: string, index: number) => {
    for (let i = 0; i < text.length; i++) {
      await new Promise((r) => setTimeout(r, 25));
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
    <ChatLayout token={token} currentId={conversationId}>
      <Messages username={username} messages={messages} />
      <ChatInput onSend={handleSend} isLoading={isLoading} offsetLeftClass="left-64" />
    </ChatLayout>
  );
}
