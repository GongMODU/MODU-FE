import {
    getIpoDetail,
    getIpoDisclosure,
    getIpoFinancials,
} from "@/lib/api/ipo";
import { queryKeys } from "@/lib/queryKeys";
import { queryOptions } from "@tanstack/react-query";

export const ipoDetailOptions = (ipoEventId: number) =>
  queryOptions({
    queryKey: queryKeys.ipo.detail(ipoEventId),
    queryFn: () => getIpoDetail(ipoEventId).then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });

export const ipoDisclosureOptions = (ipoEventId: number) =>
  queryOptions({
    queryKey: queryKeys.ipo.disclosure(ipoEventId),
    queryFn: () => getIpoDisclosure(ipoEventId).then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });

export const ipoFinancialsOptions = (ipoEventId: number) =>
  queryOptions({
    queryKey: queryKeys.ipo.financials(ipoEventId),
    queryFn: () => getIpoFinancials(ipoEventId).then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });
