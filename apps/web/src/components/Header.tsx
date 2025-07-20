"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AuthResponse } from "@lib/api-client";
import { useEffect, useState } from "react";

interface HeaderProps {
	auth: AuthResponse | null;
}

export default function Header({ auth }: HeaderProps) {
	const router = useRouter();
	const user = auth?.user;
	const token = auth?.token;

	const [isLoggedIn, setIsLoggedIn] = useState(!!user);

	useEffect(() => {
		setIsLoggedIn(!!auth?.user);
	}, [auth]);

	return (
		<header className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-zinc-50/75 dark:bg-zinc-900/75 text-black dark:text-white transition duration-300 font-semibold">
			<div className="flex items-center justify-between mx-auto p-4">
				{/* Logo */}
				<Link
					href="/"
					title="Sya, votre assistant web"
					aria-label="Accueil">
					<div className="flex items-center space-x-2 hover:scale-105 transition duration-200">
						<svg
							className="h-12 w-12 fill-black dark:fill-white"
							xmlns="http://www.w3.org/2000/svg"
							xmlnsXlink="http://www.w3.org/1999/xlink"
							zoomAndPan="magnify"
							viewBox="0 0 375 374.999991"
							preserveAspectRatio="xMidYMid meet"
							version="1.0">
							<defs>
								<clipPath>
									<path
										d="M 13.839844 42 L 361.089844 42 L 361.089844 337.5 L 13.839844 337.5 Z M 13.839844 42 "
										clipRule="nonzero"
									/>
								</clipPath>
							</defs>
							<g clipPath="url(#93219ad2fd)">
								<path
									d="M 274.277344 242.125 C 274.277344 256.527344 262.625 268.179688 248.226562 268.179688 C 233.859375 268.179688 222.207031 256.527344 222.207031 242.125 C 222.207031 227.726562 233.859375 216.070312 248.226562 216.070312 C 262.625 216.070312 274.277344 227.726562 274.277344 242.125 Z M 152.75 242.125 C 152.75 256.527344 141.066406 268.179688 126.699219 268.179688 C 112.304688 268.179688 100.652344 256.527344 100.652344 242.125 C 100.652344 227.726562 112.304688 216.070312 126.699219 216.070312 C 141.066406 216.070312 152.75 227.726562 152.75 242.125 Z M 309.019531 285.542969 C 308.988281 304.71875 293.453125 320.261719 274.277344 320.261719 L 100.652344 320.261719 C 81.476562 320.261719 65.9375 304.71875 65.9375 285.542969 L 65.9375 198.710938 C 65.9375 179.53125 81.476562 163.992188 100.652344 163.960938 L 274.277344 163.960938 C 293.453125 163.992188 308.988281 179.53125 309.019531 198.710938 Z M 335.039062 216.070312 L 326.34375 216.070312 L 326.34375 198.710938 C 326.34375 169.941406 303.039062 146.601562 274.277344 146.601562 L 204.820312 146.601562 L 204.820312 107.070312 C 221.4375 97.480469 227.140625 76.238281 217.519531 59.617188 C 207.933594 42.996094 186.722656 37.324219 170.105469 46.914062 C 153.492188 56.503906 147.789062 77.746094 157.40625 94.335938 C 160.425781 99.640625 164.835938 104.019531 170.105469 107.070312 L 170.105469 146.601562 L 100.652344 146.601562 C 71.886719 146.601562 48.550781 169.941406 48.550781 198.710938 L 48.550781 216.070312 L 39.886719 216.070312 C 25.492188 216.070312 13.839844 227.726562 13.839844 242.125 C 13.839844 256.527344 25.492188 268.179688 39.886719 268.179688 L 48.550781 268.179688 L 48.550781 285.542969 C 48.550781 314.308594 71.886719 337.652344 100.652344 337.652344 L 274.277344 337.652344 C 303.039062 337.652344 326.34375 314.308594 326.34375 285.542969 L 326.34375 268.179688 L 335.039062 268.179688 C 349.4375 268.179688 361.089844 256.527344 361.089844 242.125 C 361.089844 227.726562 349.4375 216.070312 335.039062 216.070312 "
									fillOpacity="1"
									fillRule="nonzero"
								/>
							</g>
						</svg>
						<span className="sr-only">Sya Logo</span>
					</div>
				</Link>

				{/* Actions */}
				<nav className="flex items-center space-x-2">
					{isLoggedIn ? (
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
