import apiClient from "@/lib/axios";

export interface InvestmentQuestion {
  questionNumber: number;
  axis: string;
  content: string;
  options: { index: number; content: string }[];
}

export interface InvestmentAnalysisResult {
  personaCode: string;
  knowledgeLevel: string;
  riskLevel: string;
  koreanName: string;
  englishName: string;
  keywordTags: string;
  axisSummary: string;
  personaDescription: string;
  recommendedStrategy: string;
  warningMessage: string;
  knowledgeScoreMap: Record<string, number>;
  riskScoreMap: Record<string, number>;
}

export const getInvestmentQuestions = () =>
  apiClient.get<{ questions: InvestmentQuestion[] }>(
    "/api/investment-profile/questions",
  );

export const analyzeInvestmentProfile = (answers: Record<string, number>) =>
  apiClient.post<InvestmentAnalysisResult>(
    "/api/investment-profile/analyze",
    answers,
  );
