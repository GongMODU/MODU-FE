// ─── 공모주 기본 정보 ──────────────────────────────────────────
export type IPOItem = {
  /** 공모주 고유 ID */
  id: string;
  /** 기업명 */
  companyName: string;
  /** 찜 여부 */
  isFavorite: boolean;
};

// ─── 핵심 지표 신호등 ──────────────────────────────────────────
export type KeyIndicator = {
  /** 신호등 점수 0~100 */
  score: number;
  /** 신호등 등급 */
  grade: "양호" | "보통" | "위험";
};

// ─── 청약 탭 ───────────────────────────────────────────────────
export type SubscriptionInfo = {
  /** 청약일 */
  subscriptionDate: string;
  /** 상장일 */
  listingDate: string;
  /** 경쟁률 */
  competitionRate: string;
  /** 비례경쟁률 */
  proportionalRate: string;
  /** 균등배정 */
  equalAllocation: string;
  /** 일반배정 */
  generalAllocation: string;
};

// ─── 예측 탭 ───────────────────────────────────────────────────
export type PredictionInfo = {
  /** 확정공모가 */
  offeringPrice: number;
  /** 수요예측일 */
  demandForecastDate: string;
  /** 희망공모가 */
  expectedOfferingPrice: string;
  /** 의무보유 */
  lockupPeriod: string;
  /** 기관경쟁률 */
  institutionalRate: string;
};

// ─── 기업 탭 ───────────────────────────────────────────────────
export type CompanyTabInfo = {
  /** 매출액 */
  revenue: string;
  /** 순이익 */
  netIncome: string;
  /** 공모주식수 */
  offeringShares: string;
  /** 상장주식수 */
  listedShares: string;
  /** 보호예수 (2개) */
  lockupShares: [string, string];
  /** 청약 증권사 */
  brokers: string[];
};

// ─── 공시 리포트 ───────────────────────────────────────────────
export type CompanySummary = {
  /** 기업명 */
  companyName: string;
  /** 기업 유형 */
  companyType: string;
  /** 주요 목적 */
  mainPurpose: string;
  /** 설립일 */
  establishedDate: string;
  /** 상장일 */
  listingDate: string;
};

export type DisclosureReport = {
  /** 기업 요약 */
  companySummary: CompanySummary;
  /** 재무제표 요약 텍스트 */
  financialSummary: string;
};

// ─── 상세 페이지 전체 데이터 ───────────────────────────────────
export type IPODetail = {
  item: IPOItem;
  keyIndicator: KeyIndicator;
  subscription: SubscriptionInfo;
  prediction: PredictionInfo;
  companyTab: CompanyTabInfo;
  disclosure: DisclosureReport;
};
