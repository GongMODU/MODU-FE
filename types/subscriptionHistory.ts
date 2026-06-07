export interface SubscriptionHistoryItem {
  id: number;
  recordStatus: "ONGOING" | "COMPLETED";
  ipoEventId: number | null;
  ipoEventCompanyName: string | null;
  inputStockName: string | null;
  inputCompanyName: string | null;
  securityCompany: string | null;
  subscribedQuantity: number | null;
  allocatedQuantity: number | null;
  offerPrice: number | null;
  subscriptionAmount: number | null;
  sellPrice: number | null;
  fee: number | null;
  tax: number | null;
  sellDate: string | null;
  memo: string | null;
  favorited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompletedHistoryCreateRequest {
  inputStockName: string;
  securityCompany?: string;
  subscribedQuantity?: number;
  allocatedQuantity?: number;
  offerPrice?: number;
  sellPrice?: number;
  fee?: number;
  tax?: number;
  sellDate?: string;
}

export interface SubscriptionHistoryUpdateRequest {
  inputStockName?: string;
  securityCompany?: string;
  subscribedQuantity?: number;
  allocatedQuantity?: number;
  offerPrice?: number;
  sellPrice?: number;
  fee?: number;
  tax?: number;
  sellDate?: string;
}

export interface OngoingHistoryCreateRequest {
  ipoEventId: number;
  securityCompany?: string;
  subscribedQuantity?: number;
  offerPrice?: number;
  subscriptionAmount?: number;
  memo?: string;
}

export interface CompleteHistoryRequest {
  sellPrice: number;
  sellDate: string;
  fee?: number;
  tax?: number;
  allocatedQuantity?: number;
}

export interface MonthlyReturnRate {
  year: number;
  month: number;
  averageReturnRate: number;
  recordCount: number;
}

export interface ReturnRateSummaryResponse {
  months: number;
  monthlyReturnRates: MonthlyReturnRate[];
  currentMonthReturnRate: number | null;
  lastMonthReturnRate: number | null;
  trend: "INCREASED" | "DECREASED" | "UNCHANGED" | "NO_DATA";
}
