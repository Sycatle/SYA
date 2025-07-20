"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		try {
			const res = await fetch("/api/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password, display_name: displayName }),
			});

			if (!res.ok) throw new Error("Erreur lors de l'inscription");

			router.push("/chat");
                } catch {
                        setError("Erreur lors de l'inscription");
                }
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
			<h1 className="text-2xl font-bold">Créer un compte</h1>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-4 w-full max-w-sm">
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					className="p-2 rounded border text-black"
					required
				/>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Mot de passe"
					className="p-2 rounded border text-black"
					required
				/>
				<input
					type="text"
					value={displayName}
					onChange={(e) => setDisplayName(e.target.value)}
					placeholder="Nom d'affichage (optionnel)"
					className="p-2 rounded border text-black"
				/>
				{error && <p className="text-red-500">{error}</p>}
				<button
					type="submit"
					className="p-2 bg-blue-600 text-white rounded">
                                        S&apos;inscrire
				</button>
			</form>
			<p>
				Déjà inscrit ?{" "}
				<Link
					href="/login"
					className="underline">
					Se connecter
				</Link>
			</p>
		</div>
	);
}
