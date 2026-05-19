import apiClient from "@/lib/axios";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  email: string;
  nickname: string;
  role: string;
}

export const sendEmailCode = (email: string) =>
  apiClient.post("/api/auth/email/sendcode", { email });

export const verifyEmailCode = (email: string, code: string) =>
  apiClient.post("/api/auth/email/verifycode", { email, code });

export const signup = (data: {
  email: string;
  password: string;
  nickname: string;
}) => apiClient.post("/api/auth/signup", data);

export const login = (email: string, password: string) =>
  apiClient.post<AuthResponse>("/api/auth/login", { email, password });
