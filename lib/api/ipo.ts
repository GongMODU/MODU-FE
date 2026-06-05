import apiClient from "@/lib/axios";
import type {
  FavoriteItem,
  IpoDetailResponse,
  IpoDisclosureResponse,
  IpoFinancialsResponse,
  IpoHomeFilter,
  IpoHomeItem,
  IpoSearchItem,
} from "@/types/ipo";

export const getIpoHome = (filter: IpoHomeFilter = "SUBSCRIPTION") =>
  apiClient.get<IpoHomeItem[]>("/api/ipo/home", { params: { filter } });

export const searchIpo = (keyword: string) =>
  apiClient.get<IpoSearchItem[]>("/api/ipo/search", { params: { keyword } });

export const getFavorites = () =>
  apiClient.get<FavoriteItem[]>("/api/interest-ipos");

export const addFavorite = (ipoEventId: number) =>
  apiClient.post(`/api/interest-ipos/${ipoEventId}`);

export const deleteFavorite = (ipoEventId: number) =>
  apiClient.delete(`/api/interest-ipos/${ipoEventId}`);

export const getIpoDetail = (ipoEventId: number) =>
  apiClient.get<IpoDetailResponse>(`/api/ipo/${ipoEventId}/detail`);

export const getIpoDisclosure = (ipoEventId: number) =>
  apiClient.get<IpoDisclosureResponse>(`/api/ipo/${ipoEventId}/disclosure`);

export const getIpoFinancials = (ipoEventId: number) =>
  apiClient.get<IpoFinancialsResponse>(
    `/api/ipo/${ipoEventId}/financials/status`,
  );
