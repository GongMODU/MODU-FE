// ─── 질문 / 답변 ───────────────────────────────────────────────

/** 질문 옵션 하나 */
export type InvestmentQuestionOption = {
  /** 옵션 인덱스 (API 제출 시 사용) */
  index: number;
  /** 옵션 텍스트 */
  content: string;
};

/** 질문 하나 */
export type InvestmentQuestion = {
  /** 질문 번호 (1~10) */
  questionNumber: number;
  /** 축 (knowledge / risk 등) */
  axis: string;
  /** 질문 텍스트 */
  content: string;
  /** 보조 설명 — API 응답에 없을 수 있음, 연동 시 검증 필요 */
  description?: string;
  /** 선택지 목록 */
  options: InvestmentQuestionOption[];
};

/** GET /api/investment-profile/questions 응답
 *  GET /api/mypage/investment-profile/questions 응답 (동일 구조)
 */
export type InvestmentQuestionsResponse = {
  questions: InvestmentQuestion[];
};

// ─── 제출 ──────────────────────────────────────────────────────

/** POST /api/investment-profile/analyze 요청 바디
 *  POST /api/mypage/investment-profile/reanalyze 요청 바디 (동일 구조)
 *  key: "q{questionNumber}", value: 선택한 optionIndex
 */
export type InvestmentAnswersPayload = Record<`q${number}`, number>;

// ─── 결과 ──────────────────────────────────────────────────────

/** 지식 축(K) 점수 분포 */
export type KnowledgeScoreMap = {
  K1: number;
  K2: number;
  K3: number;
  K4: number;
};

/** 리스크 축(R) 점수 분포 */
export type RiskScoreMap = {
  R1: number;
  R2: number;
  R3: number;
  R4: number;
};

/** POST /api/investment-profile/analyze 응답
 *  POST /api/mypage/investment-profile/reanalyze 응답 (동일 구조)
 */
export type InvestmentAnalysisResult = {
  /** 페르소나 코드 (K1R1 ~ K4R4) */
  personaCode: string;
  /** 지식 축 결과 (K1~K4) */
  knowledgeLevel: string;
  /** 리스크 축 결과 (R1~R4) */
  riskLevel: string;
  /** 한글 유형명 */
  koreanName: string;
  /** 영문 유형명 */
  englishName: string;
  /** 태그 목록 — DB JSONB 기반으로 string[] 추정, 연동 시 검증 필요 */
  keywordTags: string[];
  /** 축 조합 요약 설명 */
  axisSummary: string;
  /** 유형 상세 설명 */
  personaDescription: string;
  /** 추천 접근 방식 */
  recommendedStrategy: string;
  /** 주의 메시지 */
  warningMessage: string;
  /** 지식 축 점수 분포 */
  knowledgeScoreMap: KnowledgeScoreMap;
  /** 리스크 축 점수 분포 */
  riskScoreMap: RiskScoreMap;
};

export default {};
