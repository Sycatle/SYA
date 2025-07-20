"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AuthResponse } from "@lib/api-client";

interface HeaderProps {
	auth: AuthResponse | null;
}

export default function Header({ auth }: HeaderProps) {
	const router = useRouter();
	const user = auth?.user;
	const token = auth?.token;

	return (
		<header className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-zinc-50/75 dark:bg-zinc-900/75 text-black dark:text-white transition duration-300 font-semibold">
			<div className="flex items-center justify-between mx-auto p-4">
				{/* Logo */}
				<Link
					href="/"
					title="Sya, votre assistant web"
					aria-label="Accueil">
					<div className="flex items-center space-x-2 hover:scale-105 transition duration-200">
						{/* SVG... */}
						<span className="sr-only">Sya Logo</span>
					</div>
				</Link>

				{/* Actions */}
				<nav className="flex items-center space-x-2">
					{token ? (
						<button
							title="Se déconnecter"
							aria-label="Se déconnecter"
							className="flex items-center border-2 rounded-full overflow-hidden"
							onClick={async () => {
								await fetch("/api/logout", { method: "POST" });
								router.push("/login");
							}}>
							<Image
								src={`https://eu.ui-avatars.com/api/?name=${encodeURIComponent(
									user?.display_name || user?.email || "U",
								)}&format=webp`}
								alt={`Avatar de ${user?.display_name || user?.email || ""}`}
								width={40}
								height={40}
								className="h-10 w-10"
							/>
						</button>
					) : (
						<Link
							href="/login"
							className="px-4 py-2 bg-blue-600 text-white rounded">
							Se connecter
						</Link>
					)}
				</nav>
			</div>
		</header>
	);
}
