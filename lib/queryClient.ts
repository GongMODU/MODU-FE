import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      // TODO: 전역 에러 처리 - 토스트 라이브러리 도입 시 교체
      console.error("[Query Error]", error);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      // TODO: 전역 에러 처리 - 토스트 라이브러리 도입 시 교체
      console.error("[Mutation Error]", error);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분
      retry: 1,
    },
  },
});

export default queryClient;
