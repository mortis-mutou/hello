import api from './client';

export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    avatar_url: string;
    signature: string;
}

export const authAPI = {
    login: (username: string, password: string) => 
        api.post<{ token: string; user: User }>('/auth/login', { username, password }),
    register: (username: string, email: string, password: string) => 
        api.post('/auth/register', { username, email, password }),
    getMe: () => api.get<User>('/auth/me'),
};