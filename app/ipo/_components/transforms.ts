import type {
  CompanyDetail,
  FinancialYear,
  ForecastDetail,
  IpoDisclosureResponse,
  IpoFinancialsResponse,
  SignalLevel,
  SubscriptionDetail,
} from "@/types/ipo";
import type {
  CompanyTabInfo,
  DisclosureReport,
  FinancialChartData,
  KeyIndicator,
  PredictionInfo,
  ReportSection,
  SubscriptionInfo,
} from "./types";

// ─── 날짜 포맷 유틸 ───────────────────────────────────────────
/** "2026-06-09" → "06.09" */
const formatDate = (dateStr: string): string => {
  const [, month, day] = dateStr.split("-");
  return `${month}.${day}`;
};

/** "2026-06-09", "2026-06-10" → "06.09~06.10" */
const formatDateRange = (start: string, end: string): string =>
  `${formatDate(start)}~${formatDate(end)}`;

/** "2026-06-09" → "2026.06.09" */
const formatFullDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split("-");
  return `${year}.${month}.${day}`;
};

// ─── 숫자 포맷 유틸 ───────────────────────────────────────────
/** 원 단위 숫자 → 억/만 단위 문자열. null이면 "-" */
const formatAmount = (value: number | null): string => {
  if (value === null) return "-";
  if (value >= 1_0000_0000) {
    const uk = value / 1_0000_0000;
    return `${uk % 1 === 0 ? uk : uk.toFixed(1)}억`;
  }
  if (value >= 10000) {
    const man = value / 10000;
    return `${man % 1 === 0 ? man : man.toFixed(1)}만`;
  }
  return `${value.toLocaleString()}`;
};

/** 주식수 → M주/만주 단위 문자열. null이면 "-" */
const formatShares = (value: number | null): string => {
  if (value === null) return "-";
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `${m % 1 === 0 ? m : m.toFixed(1)}M주`;
  }
  if (value >= 10000) {
    const man = value / 10000;
    return `${man % 1 === 0 ? man : man.toFixed(1)}만주`;
  }
  return `${value.toLocaleString()}주`;
};

/** 비율 숫자 → % 문자열. null이면 "-" */
const formatRatio = (value: number | null): string =>
  value === null ? "-" : `${value}%`;

/** 경쟁률 숫자 → "N:1" 문자열. null이면 "-" */
const formatRate = (value: number | null): string =>
  value === null ? "-" : `${value.toLocaleString()}:1`;

// ─── KeyIndicator 변환 ────────────────────────────────────────
export const toKeyIndicator = (
  signalLevel: SignalLevel | null,
  riskScore: number | null,
): KeyIndicator => {
  if (signalLevel === null || riskScore === null) {
    return { grade: null, score: null };
  }
  return { grade: signalLevel, score: riskScore };
};

// ─── SubscriptionInfo 변환 ────────────────────────────────────
export const toSubscriptionInfo = (
  data: SubscriptionDetail,
): SubscriptionInfo => ({
  subscriptionDate: formatDateRange(
    data.subscriptionStartDate,
    data.subscriptionEndDate,
  ),
  listingDate: formatDate(data.listingDate),
  competitionRate: formatRate(data.generalSubscriptionRate),
  proportionalRate: formatRate(data.proportionalCompetitionRate),
  equalAllocation:
    data.equalAllocationShares === null
      ? "-"
      : `${data.equalAllocationShares.toLocaleString()}주`,
  generalAllocation: formatShares(data.generalAllocationShares),
});

// ─── PredictionInfo 변환 ─────────────────────────────────────
export const toPredictionInfo = (data: ForecastDetail): PredictionInfo => ({
  offeringPrice: data.offerPrice,
  demandForecastDate:
    data.demandForecastStart === null || data.demandForecastEnd === null
      ? "-"
      : formatDateRange(data.demandForecastStart, data.demandForecastEnd),
  expectedOfferingPrice:
    data.offerPriceMin === null || data.offerPriceMax === null
      ? "-"
      : `${data.offerPriceMin.toLocaleString()}~${data.offerPriceMax.toLocaleString()}원`,
  lockupPeriod: formatRatio(data.lockupRatio),
  institutionalRate: formatRate(data.institutionalCompetitionRate),
});

// ─── CompanyTabInfo 변환 ──────────────────────────────────────
export const toCompanyTabInfo = (data: CompanyDetail): CompanyTabInfo => ({
  revenue: formatAmount(data.revenue),
  netIncome: formatAmount(data.netIncome),
  offeringShares: formatShares(data.shareCount),
  listedShares: formatShares(data.totalListedShares),
  lockupShares: formatRatio(data.protectiveCustodyRatio),
  brokers: data.brokerNames,
});

// ─── DisclosureReport 변환 ────────────────────────────────────
const SPAC_PURPOSE = "다른 기업과 합병하여 성장";
const GENERAL_PURPOSE = "사업 영위 및 성장";

export const toDisclosureReport = (
  data: IpoDisclosureResponse,
): DisclosureReport => {
  const sections: ReportSection[] = [];

  if (data.investorProtectionSummary !== null) {
    sections.push({
      title: "투자자 보호를 위한 안전장치",
      summary: data.investorProtectionSummary.highlight,
      items: data.investorProtectionSummary.items.map((item) => ({
        subTitle: item.title,
        body: item.content,
      })),
    });
  }

  if (data.mergerInfoSummary !== null) {
    sections.push({
      title: "합병 목표 및 유효 기간",
      summary: data.mergerInfoSummary.highlight,
      items: data.mergerInfoSummary.items.map((item) => ({
        subTitle: item.title,
        body: item.content,
      })),
    });
  }

  if (data.riskSummary.length > 0) {
    sections.push({
      title: "알아두면 좋은 리스크",
      items: data.riskSummary.map((item) => ({
        subTitle: item.title,
        body: item.content,
      })),
    });
  }

  return {
    companySummary: {
      companyName: data.companyName,
      companyType: data.isSpac ? "SPAC" : "일반",
      mainPurpose: data.isSpac ? SPAC_PURPOSE : GENERAL_PURPOSE,
      establishedDate: formatFullDate(data.establishedAt),
      listingDate: formatFullDate(data.listingDate),
    },
    financialSummary: data.financialSummary?.join(" ") ?? "",
    financialChart: { periods: [], terms: [] },
    sections,
  };
};

// ─── FinancialChartData 변환 ──────────────────────────────────
const SPAC_FINANCIAL_TERMS = [
  { label: "매출액", description: "영업을 하지 않는 서류상 회사" },
  { label: "자산총계", description: "공모 자금 유입으로 크게 증가" },
  { label: "부채총계", description: "주로 발행한 전환사채 관련 부채" },
  { label: "당기순손익", description: "운영비 지출로 인한 장부상 손실" },
] as const;

const GENERAL_FINANCIAL_TERMS = [
  {
    label: "매출액",
    description: "기업이 영업 활동으로 벌어들인 총 수입이에요.",
  },
  { label: "자산총계", description: "기업이 보유한 모든 자산의 합계예요." },
  { label: "부채총계", description: "기업이 갚아야 할 모든 부채의 합계예요." },
  {
    label: "당기순손익",
    description: "해당 기간 동안 발생한 최종 손익이에요.",
  },
] as const;

export const toFinancialChartData = (
  data: IpoFinancialsResponse,
  isSpac: boolean,
): FinancialChartData | null => {
  if (!data.available || data.financials.length === 0) return null;

  const terms = isSpac ? SPAC_FINANCIAL_TERMS : GENERAL_FINANCIAL_TERMS;

  const allPositive = data.financials.every(
    (f) => f.netIncome === null || f.netIncome >= 0,
  );
  const allNegative = data.financials.every(
    (f) => f.netIncome === null || f.netIncome < 0,
  );

  const netIncomeLabel = allPositive
    ? "당기순이익"
    : allNegative
      ? "당기순손실"
      : "당기순손익";

  const netIncomeDescription = allPositive
    ? "해당 기간 동안 수입이 지출보다 많아 발생한 이익이에요."
    : allNegative
      ? "해당 기간 동안 지출이 수입보다 많아 발생한 손실이에요."
      : "당기순이익은 수입이 지출보다 많을 때, 당기순손실은 지출이 수입보다 많을 때 발생해요.";

  const dynamicTerms = terms.map((t, i) =>
    i === 3
      ? { ...t, label: netIncomeLabel, description: netIncomeDescription }
      : { ...t },
  );

  return {
    periods: data.financials.map((f: FinancialYear) => ({
      periodName: f.year,
      values: [
        Math.max(f.revenue ?? 0, 0),
        Math.max(f.totalAssets ?? 0, 0),
        Math.max(f.totalLiabilities ?? 0, 0),
        Math.abs(f.netIncome ?? 0),
      ],
    })),
    terms: dynamicTerms,
  };
};
