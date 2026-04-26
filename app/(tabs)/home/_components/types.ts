/** 유튜브 요약 카드 한 개의 데이터 */
export type YoutubeCardData = {
  /** 카드 고유 ID */
  id: string;
  /** 유튜버/채널명 */
  channelName: string;
  /** 핵심 요약 불릿 포인트 목록 */
  summaries: string[];
  /** 영상 제목 */
  videoTitle: string;
  /** 유튜브 영상 URL */
  videoUrl: string;
};

/** API 응답 타입 - 나중에 백엔드 연동 시 여기에 맞춰서 교체 */
export type YoutubeCardsResponse = {
  cards: YoutubeCardData[];
};
