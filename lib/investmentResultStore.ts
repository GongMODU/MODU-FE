import { InvestmentAnalysisResult } from "./api/investmentProfile";

let result: InvestmentAnalysisResult | null = null;

export const investmentResultStore = {
  get: () => result,
  set: (r: InvestmentAnalysisResult) => {
    result = r;
  },
  clear: () => {
    result = null;
  },
};
