export interface Message {
	role: "user" | "assistant";
	content: string;
}

export interface ResponseData {
	response: string;
	[key: string]: unknown;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function sendPrompt(prompt: string, token?: string): Promise<ResponseData> {
        try {
                const res = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/chat`, {
                        method: "POST",
                        headers: {
                                "Content-Type": "application/json",
                                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        },
                        body: JSON.stringify({ prompt }),
                });

		if (!res.ok) {
			const errorText = await res.text().catch(() => "");
			throw new Error(`Request failed with status ${res.status} ${errorText}`);
		}

		const data = await res.json();

		return {
			response: data.message?.content ?? "", // 🔧 ici on prend le bon champ
			...data,
		};
	} catch (error) {
		console.error("sendPrompt error:", error);
		throw error;
	}
}


export interface AuthResponse {
        token: string;
        user: {
                id: string;
                email: string;
                display_name?: string | null;
        };
}

export async function login(email: string, password: string): Promise<AuthResponse> {
        const res = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
                throw new Error("Login failed");
        }
        return res.json();
}

export async function register(
        email: string,
        password: string,
        displayName?: string
): Promise<AuthResponse> {
        const res = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, display_name: displayName }),
        });
        if (!res.ok) {
                throw new Error("Register failed");
        }
        return res.json();
}

export async function fetchMe(token: string): Promise<AuthResponse> {
        const res = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/me`, {
                headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
                throw new Error("Unauthorized");
        }
        return res.json();
}
