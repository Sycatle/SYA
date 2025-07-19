"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ChatInput from "@web/components/ChatInput";
import Messages from "@web/components/Messages";
import { addMessage, getConversation, MessageRow } from "../../../../lib/api";
import { useAuth } from "@web/contexts/AuthContext";

interface ChatMessage {
        isQuestion: boolean;
        content: string;
        background?: boolean;
        classes?: string[];
}

export default function Home() {
        const { user, token, loading } = useAuth();
        const router = useRouter();
        const params = useParams();
        const conversationId = Array.isArray(params.id) ? params.id[0] : (params.id as string);
        const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const username = user?.display_name || user?.email || "";
	const messagesRef = useRef(messages);

        useEffect(() => {
                if (!loading && !token) {
                        router.push("/login");
                }
        }, [loading, token, router]);

        useEffect(() => {
                if (token && conversationId) {
                        getConversation(conversationId, token)
                                .then((conv) => {
                                        const history = conv.messages.map((m: MessageRow) => ({
                                                isQuestion: m.sender_role === "user",
                                                content: m.content,
                                        }));
                                        setMessages(history);
                                })
                                .catch((err) => console.error(err));
                }
        }, [token, conversationId]);

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

		// 1. Afficher le message utilisateur
		setMessages((prev) => [...prev, userMessage]);

		// 2. Placeholder pour la réponse vide
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
                        if (!token) return;
                        const res = await addMessage(conversationId, prompt, token, "user");

                        if (res.content) {
                                await typeMessage(res.content, assistantIndex);
                        }
                } catch (error) {
                        console.error(error);
                } finally {
                        setIsLoading(false);
                }
	};

	if (!token) {
		return <p className="p-4">Chargement...</p>;
	}

	return (
		<>
			<Messages
				username={username}
				messages={messages}
			/>
			<ChatInput
				onSend={handleSend}
				isLoading={isLoading}
			/>
		</>
	);
}
