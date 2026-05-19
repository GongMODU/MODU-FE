import { getMypageHome } from "@/lib/api/mypage";
import { queryKeys } from "@/lib/queryKeys";
import { queryOptions } from "@tanstack/react-query";

export const mypageHomeOptions = () =>
  queryOptions({
    queryKey: queryKeys.mypage.home(),
    queryFn: () => getMypageHome().then((r) => r.data),
  });
