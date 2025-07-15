export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ResponseData {
  response: string;
  [key: string]: unknown; // allow additional fields just in case
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function sendPrompt(prompt: string, history: Message[]): Promise<ResponseData> {
  try {
    const res = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, history })
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      throw new Error(`Request failed with status ${res.status} ${errorText}`);
    }

    return (await res.json()) as ResponseData;
  } catch (error) {
    console.error('sendPrompt error:', error);
    throw error;
  }
}
