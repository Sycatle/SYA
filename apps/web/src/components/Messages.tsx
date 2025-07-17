"use client";

import Image from "next/image";
import clsx from "clsx";

interface Message {
	isQuestion: boolean;
	content: string;
	background?: boolean;
	classes?: string[];
}

interface MessagesProps {
	messages: Message[];
	username: string;
}

export default function Messages({ messages, username }: MessagesProps) {
	return (
		<div className="flex flex-col gap-10 max-w-6xl mx-auto py-28 px-4 min-h-screen">
			{messages.map((message, index) => {
				const timestamp = new Date().toLocaleTimeString("fr-FR", {
					hour: "2-digit",
					minute: "2-digit",
				});

				const isUser = message.isQuestion;

				return (
					<div
						key={index}
						className={clsx(
							"flex items-start",
							isUser ? "justify-end" : "justify-start",
						)}>
						<div
							className={clsx(
								"flex items-start lg:max-w-[85%] space-x-3",
								isUser && "flex-row-reverse space-x-reverse",
							)}>
							<Image
								src={
									isUser
										? `https://eu.ui-avatars.com/api/?name=${encodeURIComponent(username)}&format=webp`
										: "/sya_logo.jpg"
								}
								alt={isUser ? `Avatar de ${username}` : "Logo de SYA"}
								width={40}
								height={40}
								className="h-10 w-10 rounded-full"
							/>

							<div
								className={clsx(
									"group relative text-lg rounded-xl whitespace-pre-wrap ",
									isUser
										? "p-3 bg-zinc-100 dark:bg-zinc-800 dark:text-white"
										: "px-3 dark:text-white",
									message.classes,
								)}>
								{message.content}
								<span className="hidden lg:group-hover:inline absolute -bottom-5 right-1 text-xs text-gray-400">
									{timestamp}
								</span>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
