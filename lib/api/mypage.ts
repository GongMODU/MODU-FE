import apiClient from "@/lib/axios";
import {
    type InvestmentAnalysisResult,
    type InvestmentAnswersPayload,
    type InvestmentQuestionsResponse,
} from "@/types/investment";
import { type MypageHomeResponse } from "@/types/mypage";

export const getMypageHome = () =>
  apiClient.get<MypageHomeResponse>("/api/mypage/home");

export const logout = () => apiClient.post("/api/mypage/logout");

export const updateNickname = (nickname: string) =>
  apiClient.patch("/api/mypage/profile/nickname", { nickname });

export const updatePassword = (
  newPassword: string,
  newPasswordConfirm: string,
) =>
  apiClient.patch("/api/mypage/profile/password", {
    newPassword,
    newPasswordConfirm,
  });

export const getRetestQuestions = () =>
  apiClient.get<InvestmentQuestionsResponse>(
    "/api/mypage/investment-profile/questions",
  );

export const reanalyzeInvestment = (answers: InvestmentAnswersPayload) =>
  apiClient.post<InvestmentAnalysisResult>(
    "/api/mypage/investment-profile/reanalyze",
    answers,
  );
