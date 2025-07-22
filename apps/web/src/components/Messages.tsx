"use client";

import MessageItem from "./MessageItem";

import type { ChatMessage } from "@hooks/use-chat";

interface MessagesProps {
        messages: ChatMessage[];
	username: string;
	bottomRef?: React.Ref<HTMLDivElement>;
}

export default function Messages({
	messages,
	username,
	bottomRef,
}: MessagesProps) {
        return (
                <div className="bg-background flex flex-col gap-10 max-w-6xl w-full mx-auto py-24 px-4">
                        {messages.map((message, index) => (
                                <MessageItem key={index} message={message} username={username} />
                        ))}
                        <div ref={bottomRef} />
                </div>
        );
}
