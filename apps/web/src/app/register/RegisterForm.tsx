"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, User, ArrowRight, Shield, CheckCircle } from "lucide-react";
import { useLanguage } from "@hooks/use-language";

export default function RegisterForm() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [displayName, setDisplayName] = useState("");
        const [error, setError] = useState<string | null>(null);
        const { locale, setLocale, t } = useLanguage();

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
                        setError(t("register.error"));
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
			{/* Language Selector */}
			<div className="absolute top-6 right-6 flex gap-2 z-10">
                                {["fr", "en"].map((l) => (
                                        <button
                                                key={l}
                                                onClick={() => setLocale(l as 'fr' | 'en')}
                                                aria-label={l === "fr" ? "Français" : "English"}
                                                className={`transition-transform duration-200 rounded-full border-2 overflow-hidden aspect-[28/20] w-10 h-7 p-0 ${locale === l ? 'border-blue-400 scale-110' : 'border-transparent opacity-70 hover:scale-105'}`}
                                        >
                                                <Image src={l === "fr" ? "/flag-fr.svg" : "/flag-gb.png"} alt={l} width={28} height={20} className="w-full h-full object-cover" />
                                        </button>
                                ))}
			</div>

			{/* Back to Home */}
			<Link 
				href="/"
				className="absolute top-6 left-6 text-gray-300 hover:text-white transition-colors flex items-center gap-2"
			>
                                <ArrowRight className="w-4 h-4 rotate-180" />
                                {t("register.backToHome")}
			</Link>

			{/* Register Card */}
			<div className="w-full max-w-md">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="flex items-center justify-center space-x-2 mb-4">
						<Image 
							src="/sya_logo.jpg" 
							alt="SYA Logo" 
							width={48} 
							height={48} 
							className="w-12 h-12 rounded-xl object-cover"
						/>
						<span className="text-3xl font-bold text-white">SYA</span>
					</div>
                                        <h1 className="text-3xl font-bold text-white mb-2">{t("register.title")}</h1>
                                        <p className="text-gray-300">{t("register.subtitle")}</p>
				</div>

				{/* Form Card */}
				<div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Email Field */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-300 flex items-center gap-2">
								<Mail className="w-4 h-4" />
                                                                {t("register.email")}
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="votre@email.com"
								className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
								required
							/>
						</div>

						{/* Password Field */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-300 flex items-center gap-2">
								<Lock className="w-4 h-4" />
                                                                {t("register.password")}
							</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
								required
							/>
						</div>

						{/* Display Name Field */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-300 flex items-center gap-2">
								<User className="w-4 h-4" />
                                                                {t("register.displayName")}
							</label>
							<input
								type="text"
								value={displayName}
								onChange={(e) => setDisplayName(e.target.value)}
								placeholder="Votre nom"
								className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
							/>
						</div>

						{/* Error Message */}
						{error && (
							<div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
								<p className="text-red-400 text-sm">{error}</p>
							</div>
						)}

						{/* Submit Button */}
						<button
							type="submit"
							className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
						>
                                                        {t("register.register")}
						</button>
					</form>

					{/* Login Link */}
					<div className="mt-6 text-center">
						<p className="text-gray-300">
                                                        {t("register.already")}{" "}
							<Link 
								href="/login" 
								className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
							>
                                                                {t("register.login")}
							</Link>
						</p>
					</div>
				</div>

				{/* Features List */}
				<div className="mt-6 bg-white/5 rounded-xl p-4">
                                        <h3 className="text-sm font-medium text-gray-300 mb-3">{t("register.featuresTitle")}</h3>
                                        <ul className="space-y-2">
                                                {t("register.features")?.map((feature: string, index: number) => (
                                                        <li key={index} className="flex items-center gap-2 text-sm text-gray-400">
                                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                                {feature}
                                                        </li>
                                                ))}
                                        </ul>
				</div>

				{/* Security Note */}
				<div className="mt-6 text-center">
					<div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
						<Shield className="w-4 h-4" />
                                                <span>{t("register.dataNotice")}</span>
					</div>
				</div>
			</div>
		</div>
	);
}