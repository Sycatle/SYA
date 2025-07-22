import { redirect } from "next/navigation";
import { getServerAuth } from "@lib/server-auth";
import { ApiClient } from "@lib/api-client";
import ChatSidebar from "@components/chat-sidebar";
import {
	SidebarProvider,
	SidebarInset,
	SidebarTrigger,
} from "@web/components/ui/sidebar";
import { Separator } from "@web/components/ui/separator";
import ChatTitle from "@web/components/chat-title";
export const dynamic = "force-dynamic";



export default async function ChatLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { id?: string };
}) {
	const auth = await getServerAuth();
	if (!auth) redirect("/login");

	const username = auth.user.display_name || auth.user.email;
	const user = {
		name: username,
		email: auth.user.email,
		avatar: `https://eu.ui-avatars.com/api/?name=${encodeURIComponent(username)}&format=webp`,
	};

	let pageTitle = "Nouvelle conversation";
	if (params.id) {
		try {
			const client = new ApiClient();
			client.setToken(auth.token);
			const conv = await client.getConversation(params.id);
			pageTitle = conv.conversation.title;
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<SidebarProvider>
			<ChatSidebar
				token={auth.token}
				user={user}
				currentId={params.id}
			/>
			<SidebarInset className="bg-background text-black dark:text-white">
				<header className="flex h-16 items-center gap-2 sticky top-0 bg-background border-b rounded-t-lg w-full z-50">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						{params.id ? (
							<ChatTitle conversationId={params.id} initialTitle={pageTitle} />
						) : (
							<h1 className="font-semibold truncate max-w-[12rem] sm:max-w-none">
								{pageTitle}
							</h1>
						)}
					</div>
				</header>
				<div className="flex flex-1 flex-col h-[95vh] overflow-y-auto">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
