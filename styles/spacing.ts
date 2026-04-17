export const spacing = {
  // 레이아웃 여백 (피그마 기준)
  safeArea: 16, // 좌우 최소 여백
  contentArea: 24, // 콘텐츠 시작 여백

  // 컴포넌트 간격
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 36,
} as const;

// 상하 여백 (참고용 - 실제로는 SafeAreaView가 처리)
export const layout = {
  headerHeight: 72,
  tabBarHeight: 144,
} as const;
