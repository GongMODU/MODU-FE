import apiClient from "@/lib/axios";
import type {
  CompleteHistoryRequest,
  CompletedHistoryCreateRequest,
  OngoingHistoryCreateRequest,
  ReturnRateSummaryResponse,
  SubscriptionHistoryItem,
  SubscriptionHistoryUpdateRequest,
} from "@/types/subscriptionHistory";

export const getSubscriptionHistories = (status?: "ONGOING" | "COMPLETED") =>
  apiClient.get<SubscriptionHistoryItem[]>("/api/subscription-history", {
    params: status ? { status } : undefined,
  });

export const getSubscriptionHistory = (historyId: number) =>
  apiClient.get<SubscriptionHistoryItem>(`/api/subscription-history/${historyId}`);

export const getReturnRate = (months = 6) =>
  apiClient.get<ReturnRateSummaryResponse>("/api/subscription-history/return-rate", {
    params: { months },
  });

export const createCompletedHistory = (data: CompletedHistoryCreateRequest) =>
  apiClient.post<{ historyId: number }>("/api/subscription-history/completed", data);

export const createOngoingHistory = (data: OngoingHistoryCreateRequest) =>
  apiClient.post<{ historyId: number }>("/api/subscription-history/ongoing", data);

export const completeHistory = (historyId: number, data: CompleteHistoryRequest) =>
  apiClient.post(`/api/subscription-history/${historyId}/complete`, data);

export const updateSubscriptionHistory = (
  historyId: number,
  data: SubscriptionHistoryUpdateRequest,
) => apiClient.patch(`/api/subscription-history/${historyId}`, data);

export const deleteSubscriptionHistory = (historyId: number) =>
  apiClient.delete(`/api/subscription-history/${historyId}`);
