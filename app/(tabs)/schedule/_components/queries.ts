import { getIpoHome } from "@/lib/api/ipo";
import { queryKeys } from "@/lib/queryKeys";
import { queryOptions } from "@tanstack/react-query";

export const subscriptionScheduleOptions = queryOptions({
  queryKey: queryKeys.ipo.home("SUBSCRIPTION"),
  queryFn: () => getIpoHome("SUBSCRIPTION").then((r) => r.data),
  staleTime: 1000 * 60 * 5,
});

export const listingScheduleOptions = queryOptions({
  queryKey: queryKeys.ipo.home("LISTING"),
  queryFn: () => getIpoHome("LISTING").then((r) => r.data),
  staleTime: 1000 * 60 * 5,
});

export const lockupScheduleOptions = queryOptions({
  queryKey: queryKeys.ipo.home("LOCKUP_EXPIRY"),
  queryFn: () => getIpoHome("LOCKUP_EXPIRY").then((r) => r.data),
  staleTime: 1000 * 60 * 5,
});
