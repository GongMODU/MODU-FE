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
  subscriptionHistory: {
    list: () => ["subscription-history", "list"] as const,
    ongoingList: () => ["subscription-history", "list", "ONGOING"] as const,
    detail: (id: number) => ["subscription-history", "detail", id] as const,
    returnRate: (months: number) =>
      ["subscription-history", "return-rate", months] as const,
  },
  ipo: {
    home: (filter: string) => ["ipo", "home", filter] as const,
    detail: (ipoEventId: number) => ["ipo", "detail", ipoEventId] as const,
    disclosure: (ipoEventId: number) =>
      ["ipo", "disclosure", ipoEventId] as const,
    financials: (ipoEventId: number) =>
      ["ipo", "financials", ipoEventId] as const,
  },
  favorites: {
    list: () => ["favorites", "list"] as const,
  },
} as const;
