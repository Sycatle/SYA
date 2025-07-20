"use client";
import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "@lib/api-client";

interface User {
	id: string;
	email: string;
	display_name?: string | null;
}

interface AuthContextValue {
	user: User | null;
	token: string | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (
		email: string,
		password: string,
		displayName?: string,
	) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
                const stored = localStorage.getItem("authToken");
                if (stored) {
                        apiClient.setToken(stored);
                        apiClient
                                .fetchMe()
                                .then((res) => {
                                        setUser(res.user);
                                        setToken(res.token);
                                        localStorage.setItem("authToken", res.token);
                                        apiClient.setToken(res.token);
                                })
                                .catch(() => {
                                        localStorage.removeItem("authToken");
                                        setUser(null);
                                        setToken(null);
                                        apiClient.setToken(null);
                                })
                                .finally(() => setLoading(false));
		} else {
			setLoading(false);
		}
	}, []);

        const login = async (email: string, password: string) => {
                const res = await apiClient.login(email, password);
                setUser(res.user);
                setToken(res.token);
                localStorage.setItem("authToken", res.token);
        };

	const register = async (
		email: string,
		password: string,
		displayName?: string,
	) => {
                const res = await apiClient.register(email, password, displayName);
                setUser(res.user);
                setToken(res.token);
                localStorage.setItem("authToken", res.token);
	};

        const logout = () => {
                setUser(null);
                setToken(null);
                localStorage.removeItem("authToken");
                apiClient.setToken(null);
        };

	return (
		<AuthContext.Provider
			value={{ user, token, loading, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
