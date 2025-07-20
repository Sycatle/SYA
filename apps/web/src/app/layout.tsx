import type { Metadata } from "next";
import "./globals.css";
import Header from "@components/Header";
import { getServerAuth } from "@lib/server-auth";

export const metadata: Metadata = {
	title: "SYA, votre assistant web",
	description: "SYA est un assistant web qui vous aide à naviguer sur Internet.",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const auth = await getServerAuth();

	return (
		<html lang="fr">
			<body className="antialiased">
				<Header auth={auth} />
				<main className="bg-zinc-900 text-gray-200">{children}</main>
			</body>
		</html>
	);
}
