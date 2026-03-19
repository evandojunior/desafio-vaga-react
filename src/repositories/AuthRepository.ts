import { AuthResponse, AuthUser } from '../types/auth';
import { api } from '../services/api';

export interface IAuthRepository {
  login(email: string, password: string): Promise<AuthResponse>;
  register(name: string, email: string, password: string): Promise<AuthResponse>;
}

export class AuthRepository implements IAuthRepository {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  }
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', { name, email, password });
    return response.data;
  }
}
