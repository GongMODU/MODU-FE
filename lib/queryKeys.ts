export const queryKeys = {
  youtube: {
    summary: () => ["youtube", "summary"] as const,
    detail: (videoId: string) => ["youtube", "detail", videoId] as const,
  },
  mypage: {
    home: () => ["mypage", "home"] as const,
    investmentQuestions: () => ["mypage", "investment", "questions"] as const,
  },
  investmentProfile: {
    questions: () => ["investment-profile", "questions"] as const,
  },
} as const;
