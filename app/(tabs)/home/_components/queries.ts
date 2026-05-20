import { fetchYoutubeDetail, fetchYoutubeSummaries } from "@/lib/api/youtube";
import { queryKeys } from "@/lib/queryKeys";
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
