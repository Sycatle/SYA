"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient, type Conversation } from "@lib/api-client";
import clsx from "clsx";

interface ChatLayoutProps {
	children: React.ReactNode;
	currentId?: string;
	token: string;
}

export default function ChatLayout({
	children,
	currentId,
	token,
}: ChatLayoutProps) {
	const router = useRouter();
	const [conversations, setConversations] = useState<Conversation[]>([]);

	useEffect(() => {
		apiClient.setToken(token);

		const fetchData = () => {
			apiClient
				.listConversations()
				.then((convs) =>
					setConversations(
						convs.sort(
							(a, b) =>
								new Date(b.updated_at).getTime() -
								new Date(a.updated_at).getTime(),
						),
					),
				)
				.catch((err) => console.error(err));
		};

		fetchData();
		const id = setInterval(fetchData, 15000);
		return () => clearInterval(id);
	}, [token]);

	const handleNew = async () => {
		try {
			const conv = await apiClient.createConversation({});
			router.push(`/chat/${conv.id}`);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="flex pt-16">
			<aside className="w-64 shrink-0 h-[calc(100vh-4rem)] overflow-y-auto border-r border-zinc-700 p-4 fixed top-16 left-0 bg-zinc-900">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-bold text-white">Conversations</h2>
					<button
						className="p-1 bg-blue-600 text-white rounded"
						onClick={handleNew}>
						+
					</button>
				</div>
				<ul className="space-y-2">
					{conversations.map((c) => (
						<li key={c.id}>
							<Link
								href={`/chat/${c.id}`}
								className={clsx(
									"block p-2 rounded hover:bg-zinc-800 text-white",
									currentId === c.id && "bg-zinc-800",
								)}>
								{c.title}
							</Link>
						</li>
					))}
					{conversations.length === 0 && (
						<li className="text-center text-gray-400">Aucune conversation</li>
					)}
				</ul>
			</aside>
			<div className="flex-1 ml-64">{children}</div>
		</div>
	);
}
