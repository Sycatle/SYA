"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@web/contexts/AuthContext";

export default function LoginPage() {
	const { login } = useAuth();
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await login(email, password);
			router.push("/chat");
		} catch {
			setError("Erreur d'authentification");
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
			<h1 className="text-2xl font-bold">Se connecter</h1>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-4 w-full max-w-sm">
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					className="p-2 rounded border text-black"
				/>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Mot de passe"
					className="p-2 rounded border text-black"
				/>
				{error && <p className="text-red-500">{error}</p>}
				<button
					type="submit"
					className="p-2 bg-blue-600 text-white rounded">
					Connexion
				</button>
			</form>
			<p>
				Pas encore de compte ?{" "}
				<Link
					href="/register"
					className="underline">
					{"S'inscrire"}
				</Link>
			</p>
		</div>
	);
}
