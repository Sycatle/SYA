"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient, type Conversation } from "@lib/api-client";
import {
	Sidebar,
	SidebarHeader,
	SidebarContent,
	SidebarFooter,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarMenuAction,
	SidebarGroup,
	SidebarGroupLabel,
} from "@web/components/ui/sidebar";
import { Trash2 } from "lucide-react";
import { NavUser } from "@web/components/nav-user";
import Logo from "@components/Logo";

interface ChatSidebarProps {
	token: string;
	user: { name: string; email: string; avatar: string };
	currentId?: string;
}

export default function ChatSidebar({
	token,
	user,
	currentId,
}: ChatSidebarProps) {
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
			window.location.assign(`/chat/${conv.id}`);
		} catch (err) {
			console.error(err);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await apiClient.deleteConversation(id);
			setConversations((prev) => prev.filter((c) => c.id !== id));
			if (currentId === id) {
				window.location.assign("/chat");
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Sidebar variant="inset">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							size="lg"
							tooltip="Accueil">
							<Link href="/chat">
								<Logo className="h-8 w-8" />
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							onClick={handleNew}
							tooltip="Nouvelle conversation">
							Nouvelle conversation
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Conversations</SidebarGroupLabel>
					<SidebarMenu>
						{conversations.map((c) => (
							<SidebarMenuItem key={c.id}>
								<SidebarMenuButton
									asChild
									isActive={currentId === c.id}>
									<Link href={`/chat/${c.id}`}>
										{c.title.length > 40 ? c.title.slice(0, 40) + "…" : c.title}
									</Link>
								</SidebarMenuButton>
								<SidebarMenuAction showOnHover={true} onClick={() => handleDelete(c.id)}>
									<Trash2 className="text-muted-foreground" />
									<span className="sr-only">Supprimer</span>
								</SidebarMenuAction>
							</SidebarMenuItem>
						))}
						{conversations.length === 0 && (
							<SidebarMenuItem>
								<span className="px-2 text-muted-foreground">
									Aucune conversation
								</span>
							</SidebarMenuItem>
						)}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	);
}
