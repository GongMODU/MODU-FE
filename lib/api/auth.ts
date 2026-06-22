import apiClient from "@/lib/axios";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  email: string;
  nickname: string;
  role: string;
}

export interface OAuthResult {
  accessToken: string;
  refreshToken: string;
  nickname?: string;
}

const OAUTH_BASE = process.env.EXPO_PUBLIC_API_BASE_URL;
const OAUTH_REDIRECT_URI = Linking.createURL("oauth");

function parseOAuthResult(
  result: WebBrowser.WebBrowserAuthSessionResult
): OAuthResult | null {
  if (result.type !== "success") return null;
  const { queryParams } = Linking.parse(result.url);
  const accessToken = queryParams?.accessToken as string | undefined;
  const refreshToken = queryParams?.refreshToken as string | undefined;
  const nickname = queryParams?.nickname as string | undefined;
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken, nickname };
}

export const kakaoLogin = async (): Promise<OAuthResult | null> => {
  const result = await WebBrowser.openAuthSessionAsync(
    `${OAUTH_BASE}/api/v1/auth/oauth2/authorization/kakao`,
    OAUTH_REDIRECT_URI
  );
  return parseOAuthResult(result);
};

export const googleLogin = async (): Promise<OAuthResult | null> => {
  const result = await WebBrowser.openAuthSessionAsync(
    `${OAUTH_BASE}/api/v1/auth/oauth2/authorization/google`,
    OAUTH_REDIRECT_URI
  );
  return parseOAuthResult(result);
};

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
