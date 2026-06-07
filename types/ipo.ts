export interface IpoHomeItem {
  ipoEventId: number;
  companyName: string;
  status: "UPCOMING" | "ONGOING" | "CLOSED" | "LISTED";
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  listingDate: string;
  listingDateEstimated: boolean;
  lockupExpiryDate: string;
  lockupExpiryDateEstimated: boolean;
  offerPriceMin: number;
  offerPriceMax: number;
  offerPrice: number | null;
  brokerNames: string[];
  signalLevel: "GREEN" | "YELLOW" | "RED" | null;
  riskScore: number | null;
  signalUnavailableReason:
    | "SPAC"
    | "PRE_DEMAND_FORECAST"
    | "INCOMPLETE_DATA"
    | null;
  favorited: boolean;
  ddayLabel: string | null;
}

export type IpoHomeFilter =
  | "SUBSCRIPTION"
  | "DEMAND_FORECAST"
  | "LOCKUP_EXPIRY"
  | "REFUND"
  | "LISTING"
  | "ALLOCATION";

export interface IpoSearchItem {
  ipoEventId: number;
  companyName: string;
  marketType: string;
  status: "UPCOMING" | "ONGOING" | "CLOSED" | "LISTED";
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  listingDate: string;
}

export interface FavoriteItem {
  interestId: number;
  ipoEventId: number;
  companyName: string;
  status: "UPCOMING" | "ONGOING" | "CLOSED" | "LISTED";
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  listingDate: string;
  listingDateEstimated: boolean;
  lockupExpiryDate: string;
  lockupExpiryDateEstimated: boolean;
  offerPriceMin: number;
  offerPriceMax: number;
  offerPrice: number | null;
  brokerNames: string[];
  interestedAt: string;
}

// ─── 공모주 상세 API 응답 ──────────────────────────────────────
export type SignalLevel = "GREEN" | "YELLOW" | "RED";

export type SubscriptionDetail = {
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  listingDate: string;
  refundDate: string;
  generalSubscriptionRate: number | null;
  proportionalCompetitionRate: number | null;
  equalAllocationShares: number | null;
  generalAllocationShares: number | null;
};

export type ForecastDetail = {
  offerPrice: number | null;
  demandForecastStart: string | null;
  demandForecastEnd: string | null;
  offerPriceMin: number | null;
  offerPriceMax: number | null;
  lockupRatio: number | null;
  institutionalCompetitionRate: number | null;
};

export type CompanyDetail = {
  revenue: number | null;
  netIncome: number | null;
  shareCount: number;
  totalListedShares: number | null;
  protectiveCustodyRatio: number | null;
  brokerNames: string[];
};

export type IpoDetailResponse = {
  ipoEventId: number;
  companyName: string;
  signalLevel: SignalLevel | null;
  riskScore: number | null;
  subscription: SubscriptionDetail;
  forecast: ForecastDetail;
  company: CompanyDetail;
  favorited: boolean;
};

// ─── 공모주 상세 AI 요약 API 응답 ─────────────────────────────
export type SummaryItem = {
  title: string;
  content: string;
};

export type SummarySection = {
  highlight: string;
  items: SummaryItem[];
};

export type IpoDisclosureResponse = {
  companyName: string;
  isSpac: boolean;
  establishedAt: string;
  listingDate: string;
  companySummary: string[];
  financialSummary: string[] | null;
  investorProtectionSummary: SummarySection | null;
  mergerInfoSummary: SummarySection | null;
  riskSummary: SummaryItem[];
  summaryVersion: string;
};

// ─── 공모주 재무제표 API 응답 ──────────────────────────────────
export type FinancialYear = {
  year: string;
  revenue: number | null;
  operatingProfit: number | null;
  netIncome: number | null;
  totalAssets: number | null;
  totalLiabilities: number | null;
  totalEquity: number | null;
};

export type IpoFinancialsResponse = {
  financials: FinancialYear[];
  available: boolean;
  unavailableReason: string | null;
  message: string;
};
