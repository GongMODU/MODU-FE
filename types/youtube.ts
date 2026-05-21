/** 홈 카드용 유튜브 요약 아이템 (GET /api/youtube/summary) */
export type YoutubeSummaryItem = {
  /** 영상 고유 ID */
  videoId: string;
  /** 영상 제목 */
  videoTitle: string;
  /** 유튜버/채널명 */
  channelName: string;
  /** 영상 URL */
  videoUrl: string;
  /** 홈 카드에 표시되는 3줄 짧은 요약 */
  summaryLines: string[];
};

/** 바텀시트 섹션 하나 (GET /api/youtube/summary/detail) */
export type YoutubeSectionData = {
  /** 섹션 제목 */
  title: string;
  /** 섹션 본문 */
  content: string;
};

/** 바텀시트용 유튜브 상세 데이터 (GET /api/youtube/summary/detail) */
export type YoutubeDetailData = {
  /** 영상 제목 */
  videoTitle: string;
  /** 유튜버/채널명 */
  channelName: string;
  /** 영상 URL */
  videoUrl: string;
  /** 바텀시트에 표시되는 긴 요약 섹션들 */
  sections: YoutubeSectionData[];
};
