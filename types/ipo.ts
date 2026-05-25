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
  signalUnavailableReason: "SPAC" | "PRE_DEMAND_FORECAST" | "INCOMPLETE_DATA" | null;
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
