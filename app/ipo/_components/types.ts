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
export type KeyIndicator =
  | { grade: "양호" | "보통" | "위험"; score: number }
  | { grade: null; score: null };

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
export type ReportSubItem = {
  /** 소제목 */
  subTitle: string;
  /** 본문 */
  body: string;
};

export type ReportSection = {
  /** 대섹션 타이틀 */
  title: string;
  /** 요약박스 텍스트 */
  summary?: string;
  /** 소제목+본문 목록 */
  items: ReportSubItem[];
};

export type CompanySummary = {
  companyName: string;
  companyType: string;
  mainPurpose: string;
  establishedDate: string;
  listingDate: string;
};

export type DisclosureReport = {
  companySummary: CompanySummary;
  financialSummary: string;
  financialChart: FinancialChartData;
  sections: ReportSection[];
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

// ─── 재무제표 차트 ─────────────────────────────────────────────
export type FinancialTerm = {
  /** 항목명 (매출액, 자산총계, 부채총계, 당기순손실) */
  label: string;
  /** 항목 설명 (동적) */
  description: string;
};

export type FinancialPeriod = {
  /** 기수명 (제2기, 제3기, ...) */
  periodName: string;
  /** 원 단위 숫자. 항목 순서: [매출액, 자산총계, 부채총계, 당기순손실] */
  values: [number, number, number, number];
};

export type FinancialChartData = {
  /** 기수 목록 — 인덱스 순서대로 primary200, primary600 색상 매핑 */
  periods: FinancialPeriod[];
  /** 항목명 + 설명 목록 */
  terms: FinancialTerm[];
};

export default {};
