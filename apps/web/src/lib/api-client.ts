// Centralized API client implementing all REST calls.
// Applies SOLID principles by encapsulating HTTP logic in a single class.
// Each method is responsible for one endpoint and returns typed data.

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ResponseData {
  response: string;
  [key: string]: unknown;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  system_prompt: string;
  model: string;
  created_at: string;
  updated_at: string;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  sender_role: string;
  content: string;
  token_count?: number | null;
  is_streamed: boolean;
  created_at: string;
}

export interface ConversationDetail {
  conversation: Conversation;
  messages: MessageRow[];
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    display_name?: string | null;
  };
}

/**
 * Extract API base URL from environment with a sensible fallback.
 */
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001').replace(/\/$/, '');

/**
 * Generic REST client for the SYA backend API.
 */
export class ApiClient {
  private token?: string;
  constructor(private readonly baseUrl: string = API_BASE_URL) {}

  /** Update authentication token used for subsequent requests. */
  setToken(token: string | null): void {
    this.token = token ?? undefined;
  }

  /** Internal helper handling the fetch logic. */
  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...('headers' in options && options.headers ? (options.headers as Record<string, string>) : {}),
    };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Request failed with ${response.status} ${text}`);
    }
    return (await response.json()) as T;
  }

  async sendPrompt(prompt: string): Promise<ResponseData> {
    return this.request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(res.token);
    return res;
  }

  async register(email: string, password: string, displayName?: string): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/api/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, display_name: displayName }),
    });
    this.setToken(res.token);
    return res;
  }

  /**
   * Récupère les infos utilisateur courant (ne met plus à jour le token).
   */
  async fetchMe(): Promise<{ user: { id: string; email: string; display_name?: string | null } }> {
    const res = await this.request<AuthResponse>('/api/me');
    return { user: res.user };
  }

  async listConversations(): Promise<Conversation[]> {
    return this.request('/api/conversations');
  }

  async createConversation(payload: Partial<{ title: string; system_prompt: string; model: string }> = {}): Promise<Conversation> {
    return this.request('/api/conversations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getConversation(id: string): Promise<ConversationDetail> {
    return this.request(`/api/conversations/${id}`);
  }

  async deleteConversation(id: string): Promise<void> {
    await this.request(`/api/conversations/${id}`, { method: 'DELETE' });
  }

  async updateConversation(id: string, payload: { model: string }): Promise<void> {
    await this.request(`/api/conversations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }

  async addMessage(id: string, content: string, role: 'user' | 'assistant' | 'system' = 'user'): Promise<MessageRow> {
    return this.request(`/api/conversations/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ role, content }),
    });
  }

  async listLocalModels(): Promise<{ models: { name: string }[] }> {
    return this.request('/api/ollama/models');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

export default apiClient;
