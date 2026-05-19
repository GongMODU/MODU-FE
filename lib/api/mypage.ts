import apiClient from "@/lib/axios";
import { type MypageHomeResponse } from "@/types/mypage";

export const getMypageHome = () =>
  apiClient.get<MypageHomeResponse>("/api/mypage/home");

export const logout = () => apiClient.post("/api/mypage/logout");
