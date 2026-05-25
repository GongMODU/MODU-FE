import { getIpoHome } from "@/lib/api/ipo";
import { fetchYoutubeDetail, fetchYoutubeSummaries } from "@/lib/api/youtube";
import { queryKeys } from "@/lib/queryKeys";
import type { IpoHomeFilter } from "@/types/ipo";
import { queryOptions } from "@tanstack/react-query";

export const youtubeSummariesOptions = queryOptions({
  queryKey: queryKeys.youtube.summary(),
  queryFn: fetchYoutubeSummaries,
  staleTime: 1000 * 60 * 5,
});

export const youtubeDetailOptions = (videoId: string) =>
  queryOptions({
    queryKey: queryKeys.youtube.detail(videoId),
    queryFn: () => fetchYoutubeDetail(videoId),
    staleTime: 1000 * 60 * 5,
  });

export const ipoHomeOptions = (filter: IpoHomeFilter = "SUBSCRIPTION") =>
  queryOptions({
    queryKey: queryKeys.ipo.home(filter),
    queryFn: () => getIpoHome(filter).then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });
