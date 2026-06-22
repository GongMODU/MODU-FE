import type { SignalLevel } from "@/types/ipo";

// ─── UI 표시용 파생 타입 ───────────────────────────────────────
export type KeyIndicator =
  | { grade: SignalLevel; score: number }
  | { grade: null; score: null };

// ─── 청약 탭 ───────────────────────────────────────────────────
export type SubscriptionInfo = {
  subscriptionDate: string;
  listingDate: string;
  competitionRate: string;
  proportionalRate: string;
  equalAllocation: string;
  generalAllocation: string;
};

// ─── 예측 탭 ───────────────────────────────────────────────────
export type PredictionInfo = {
  offeringPrice: number | null;
  demandForecastDate: string;
  expectedOfferingPrice: string;
  lockupPeriod: string;
  institutionalRate: string;
};

// ─── 기업 탭 ───────────────────────────────────────────────────
export type CompanyTabInfo = {
  revenue: string;
  netIncome: string;
  offeringShares: string;
  listedShares: string;
  lockupShares: string;
  brokers: string[];
};

// ─── 공시 리포트 ───────────────────────────────────────────────
export type ReportSubItem = {
  subTitle: string;
  body: string;
};

export type ReportSection = {
  title: string;
  summary?: string;
  items: ReportSubItem[];
};

export type CompanySummary = {
  companyName: string;
  companyType: string;
  mainPurpose: string;
  establishedDate: string;
  listingDate: string;
};

// 재무제표 섹션 상태
export type FinancialStatus =
  | { kind: "available"; summary: string; chart: FinancialChartData }
  | { kind: "no-data" }
  | { kind: "spac" };

export type DisclosureReport = {
  companySummary: CompanySummary;
  financial: FinancialStatus;
  sections: ReportSection[];
};

// ─── 재무제표 차트 ─────────────────────────────────────────────
export type FinancialTerm = {
  label: string;
  description: string;
};

export type FinancialPeriod = {
  periodName: string;
  values: [number, number, number, number];
};

export type FinancialChartData = {
  periods: FinancialPeriod[];
  terms: FinancialTerm[];
};

export default {};
