import apiClient from "@/lib/axios";
import {
    type YoutubeDetailData,
    type YoutubeSummaryItem,
} from "@/types/youtube";

export const fetchYoutubeSummaries = async (): Promise<
  YoutubeSummaryItem[]
> => {
  const response = await apiClient.get<YoutubeSummaryItem[]>(
    "/api/youtube/summary",
  );
  return response.data;
};

export const fetchYoutubeDetail = async (
  videoId: string,
): Promise<YoutubeDetailData> => {
  const response = await apiClient.get<YoutubeDetailData>(
    "/api/youtube/summary/detail",
    {
      params: { videoId },
    },
  );
  return response.data;
};
