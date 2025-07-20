"use client";

import { useState } from "react";

interface ChatInputProps {
	onSend: (message: string) => void;
	isDisabled?: boolean;
	isLoading?: boolean;
	offsetLeftClass?: string;
}

export default function ChatInput({
	onSend,
	isDisabled = false,
	isLoading = false,
	offsetLeftClass = "left-0",
}: ChatInputProps) {
	const [message, setMessage] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = message.trim();
		if (!trimmed) return;

		onSend(trimmed);

		setMessage("");
	};

	return (
		<form
			onSubmit={handleSubmit}
			className={`fixed bottom-0 right-0 flex items-center gap-2 z-50 text-black dark:text-white transition duration-300 font-semibold ${offsetLeftClass}`}>
			<div className="flex w-full items-center justify-between max-w-6xl mx-auto pb-4">
				<input
					type="text"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="Écrivez votre message ici..."
					aria-label="Zone de message"
					className="flex-1 px-4 py-2 shadow rounded-full bg-zinc-50 dark:bg-zinc-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none border transition"
					disabled={isDisabled || isLoading}
				/>

				<button
					type="submit"
					title="Envoyer le message"
					className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={isDisabled || message.trim() === "" || isLoading}>
					{isLoading ? (
						<svg
							className="h-5 w-5 animate-spin"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24">
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
							/>
						</svg>
					) : (
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
					)}
				</button>
			</div>
		</form>
	);
}
