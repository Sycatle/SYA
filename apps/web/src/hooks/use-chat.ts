import { useState, useEffect, useCallback } from "react";
import { apiClient, type MessageRow } from "@lib/api-client";

export interface ChatMessage {
  isQuestion: boolean;
  content: string;
  background?: boolean;
  classes?: string[];
}

export function useChat(conversationId: string, token: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const typeMessage = useCallback(async (text: string, index: number) => {
    for (let i = 0; i < text.length; i++) {
      await new Promise((r) => setTimeout(r, 5));
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
  }, []);

  const sendMessage = useCallback(
    async (prompt: string) => {
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
    },
    [conversationId, typeMessage]
  );

  return {
    messages,
    isLoading,
    sendMessage,
  };
}

export default useChat;
