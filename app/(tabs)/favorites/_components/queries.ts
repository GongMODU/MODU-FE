import { getFavorites } from "@/lib/api/ipo";
import { queryKeys } from "@/lib/queryKeys";
import { queryOptions } from "@tanstack/react-query";

export const favoritesOptions = queryOptions({
  queryKey: queryKeys.favorites.list(),
  queryFn: () => getFavorites().then((r) => r.data),
  staleTime: 1000 * 60 * 5,
});
