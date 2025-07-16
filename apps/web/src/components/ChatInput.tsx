"use client";

import { useState } from "react";
import { sendPrompt } from "../../lib/api";

interface ChatInputProps {
	isDisabled?: boolean;
}

export default function ChatInput({ isDisabled = false }: ChatInputProps) {
	const [message, setMessage] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = message.trim();
		if (!trimmed) return;

		await sendPrompt(trimmed, []);

		setMessage("");
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="fixed bottom-0 w-full flex items-center gap-2 left-0 z-50 backdrop-blur-lg bg-zinc-50/85 dark:bg-zinc-900/85 text-black dark:text-white transition duration-300 font-semibold">
			<div className="flex w-full items-center justify-between max-w-7xl mx-auto p-4">
				<input
					type="text"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="Écrivez votre message ici..."
					aria-label="Zone de message"
					className="flex-1 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
					disabled={isDisabled}
				/>

				<button
					type="submit"
					title="Envoyer le message"
					className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={isDisabled || message.trim() === ""}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						className="h-5 w-5"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3 10l9-6 9 6-9 6-9-6zm0 4l9 6 9-6"
						/>
					</svg>
				</button>
			</div>
		</form>
	);
}
