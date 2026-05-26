import apiClient from "@/lib/axios";
import type { FavoriteItem, IpoHomeFilter, IpoHomeItem } from "@/types/ipo";

export const getIpoHome = (filter: IpoHomeFilter = "SUBSCRIPTION") =>
  apiClient.get<IpoHomeItem[]>("/api/ipo/home", { params: { filter } });

export const getFavorites = () =>
  apiClient.get<FavoriteItem[]>("/api/interest-ipos");

export const addFavorite = (ipoEventId: number) =>
  apiClient.post(`/api/interest-ipos/${ipoEventId}`);

export const deleteFavorite = (ipoEventId: number) =>
  apiClient.delete(`/api/interest-ipos/${ipoEventId}`);
