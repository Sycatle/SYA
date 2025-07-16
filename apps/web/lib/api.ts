export interface Message {
	role: "user" | "assistant";
	content: string;
}

export interface ResponseData {
	response: string;
	[key: string]: unknown;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function sendPrompt(prompt: string): Promise<ResponseData> {
	try {
		const res = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/chat`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
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

