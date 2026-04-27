/** 바텀 시트 섹션 하나 */
export type YoutubeSectionData = {
  /** 섹션 제목 */
  title: string;
  /** 섹션 본문 */
  body: string;
};

/** 유튜브 요약 카드 한 개의 데이터 */
export type YoutubeCardData = {
  /** 카드 고유 ID */
  id: string;
  /** 유튜버/채널명 */
  channelName: string;
  /** 카드에 표시되는 3줄 짧은 요약 */
  summaries: string[];
  /** 바텀 시트에 표시되는 긴 요약 섹션들 */
  sections: YoutubeSectionData[];
  /** 영상 제목 */
  videoTitle: string;
  /** 유튜브 영상 URL */
  videoUrl: string;
};

/** API 응답 타입 - 나중에 백엔드 연동 시 여기에 맞춰서 교체 */
export type YoutubeCardsResponse = {
  cards: YoutubeCardData[];
};
