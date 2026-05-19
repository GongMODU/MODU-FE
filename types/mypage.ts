export interface MypageHomeResponse {
  nickname: string;
  provider: string;
  email: string;
  investmentProfile: InvestmentProfile;
}

export interface InvestmentProfile {
  id: number;
  personaCode: string;
  koreanName: string;
  englishName: string;
  keywordTags: string;
  axisSummary: string;
  personaDescription: string;
  recommendedStrategy: string;
  warningMessage: string;
}
