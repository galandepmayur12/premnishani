import { apiPost, apiGet } from '@/utils/api';
import { useAuthStore } from '@/store/useAuthStore';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: { id: number; name: string; email: string; phone?: string; is_active: boolean; created_at: string };
}

export async function login(payload: LoginPayload): Promise<TokenResponse> {
  const form = new FormData();
  form.append('username', payload.email);
  form.append('password', payload.password);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/auth/login`,
    {
      method: 'POST',
      body: form,
      headers: {},
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || 'Login failed');
  }
  const data: TokenResponse = await res.json();
  useAuthStore.getState().setAuth(data.user, data.access_token);
  return data;
}

export async function register(payload: RegisterPayload): Promise<TokenResponse> {
  const data = await apiPost<TokenResponse>('/auth/register', payload);
  useAuthStore.getState().setAuth(data.user, data.access_token);
  return data;
}

export async function fetchMe() {
  return apiGet<{ id: number; name: string; email: string; phone?: string; is_active: boolean; created_at: string }>('/auth/me');
}
