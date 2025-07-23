"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginForm() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [lang, setLang] = useState<'fr' | 'en'>("fr");

	const t = {
		fr: {
			title: "Se connecter à SYA",
			email: "Email",
			password: "Mot de passe",
			login: "Connexion",
			noAccount: "Pas encore de compte ?",
			register: "S'inscrire",
			error: "Erreur d'authentification"
		},
		en: {
			title: "Sign in to SYA",
			email: "Email",
			password: "Password",
			login: "Login",
			noAccount: "No account yet?",
			register: "Register",
			error: "Authentication error"
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		try {
			// POST sur ton endpoint local Next.js (pas directement le Rust !)
			const res = await fetch("/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			if (!res.ok) throw new Error("Erreur d'authentification");

			router.push("/chat");
                } catch {
                        setError("Erreur d'authentification");
                }
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4 relative">
			<div className="absolute right-4 bottom-4 flex gap-2 z-10">
				<button
					onClick={() => setLang('fr')}
					aria-label="Français"
					className={`transition-transform duration-200 rounded-full border-2 overflow-hidden aspect-[28/20] w-10 h-7 p-0 ${lang === 'fr' ? 'border-primary scale-110' : 'border-transparent opacity-70 hover:scale-105'}`}
				>
					<Image src="/flag-fr.svg" alt="Français" width={28} height={20} className="w-full h-full object-cover" />
				</button>
				<button
					onClick={() => setLang('en')}
					aria-label="English"
					className={`transition-transform duration-200 rounded-full border-2 overflow-hidden aspect-[28/20] w-10 h-7 p-0 ${lang === 'en' ? 'border-primary scale-110' : 'border-transparent opacity-70 hover:scale-105'}`}
				>
					<Image src="/flag-gb.png" alt="English" width={28} height={20} className="w-full h-full object-cover" />
				</button>
			</div>
			<h1 className="text-2xl font-bold">{t[lang].title}</h1>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-4 w-full max-w-sm">
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder={t[lang].email}
					className="p-2 rounded border text-white bg-background/80 placeholder-gray-300"
					required
				/>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder={t[lang].password}
					className="p-2 rounded border text-white bg-background/80 placeholder-gray-300"
					required
				/>
				{error && <p className="text-red-500">{t[lang].error}</p>}
				<button
					type="submit"
					className="p-2 bg-primary text-primary-foreground rounded">
					{t[lang].login}
				</button>
			</form>
			<p>
				{t[lang].noAccount} {" "}
				<Link href="/register" className="underline">
					{t[lang].register}
				</Link>
			</p>
		</div>
	);
}
