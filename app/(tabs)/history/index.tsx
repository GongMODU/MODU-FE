import EmptyHistoryIcon from "@/assets/images/empty-history.svg";
import { getFavorites } from "@/lib/api/ipo";
import {
  completeHistory,
  createCompletedHistory,
  createOngoingHistory,
  deleteSubscriptionHistory,
  getSubscriptionHistories,
  updateSubscriptionHistory,
} from "@/lib/api/subscriptionHistory";
import queryClient from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { colors, spacing, typography } from "@/styles";
import type {
  CompleteHistoryRequest,
  CompletedHistoryCreateRequest,
  OngoingHistoryCreateRequest,
  SubscriptionHistoryItem,
  SubscriptionHistoryUpdateRequest,
} from "@/types/subscriptionHistory";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CompleteModal from "./_components/CompleteModal";
import EditModal from "./_components/EditModal";
import HistoryCard, { DetailData } from "./_components/HistoryCard";

const INITIAL_DETAIL: DetailData = {
  증권사: "",
  매도일: "",
  청약수량: "",
  수수료: "",
  배정수량: "",
  제세금: "",
  공모가: "",
  매도가: "",
};

// API 응답 → UI DetailData 변환
function toDetailData(item: SubscriptionHistoryItem): DetailData {
  return {
    증권사: item.securityCompany ?? "",
    매도일: item.sellDate ?? "",
    청약수량:
      item.subscribedQuantity != null ? String(item.subscribedQuantity) : "",
    수수료: item.fee != null ? String(item.fee) : "",
    배정수량:
      item.allocatedQuantity != null ? String(item.allocatedQuantity) : "",
    제세금: item.tax != null ? String(item.tax) : "",
    공모가: item.offerPrice != null ? String(item.offerPrice) : "",
    매도가: item.sellPrice != null ? String(item.sellPrice) : "",
  };
}

// 문자열 → 숫자 파싱 (단위 제거)
function parseNum(val: string): number | undefined {
  const n = Number(val.replace(/[^0-9.-]/g, ""));
  return val.trim() === "" || isNaN(n) ? undefined : n;
}

// 문자열 → YYYY-MM-DD 파싱 ("5.2", "2026.5.2", "5/2" 등 지원)
function parseDate(val: string): string | undefined {
  if (!val.trim()) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;

  const parts = val
    .replace(/[./]/g, "-")
    .split("-")
    .map((p) => p.trim());
  let year: number, month: number, day: number;

  if (parts.length === 3) {
    if (parts[0].length === 4) {
      [year, month, day] = parts.map(Number);
    } else {
      year = 2000 + Number(parts[0]);
      [, month, day] = parts.map(Number);
    }
  } else if (parts.length === 2) {
    year = new Date().getFullYear();
    [month, day] = parts.map(Number);
  } else {
    return undefined;
  }

  if (isNaN(year) || isNaN(month) || isNaN(day)) return undefined;
  if (month < 1 || month > 12 || day < 1 || day > 31) return undefined;

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function toCreateRequest(
  name: string,
  data: DetailData,
): CompletedHistoryCreateRequest {
  return {
    inputStockName: name,
    securityCompany: data.증권사 || undefined,
    subscribedQuantity: parseNum(data.청약수량),
    fee: parseNum(data.수수료),
    allocatedQuantity: parseNum(data.배정수량),
    tax: parseNum(data.제세금),
    offerPrice: parseNum(data.공모가),
    sellPrice: parseNum(data.매도가),
    sellDate: parseDate(data.매도일),
  };
}

function toUpdateRequest(
  name: string,
  data: DetailData,
): SubscriptionHistoryUpdateRequest {
  return {
    inputStockName: name || undefined,
    securityCompany: data.증권사 || undefined,
    subscribedQuantity: parseNum(data.청약수량),
    fee: parseNum(data.수수료),
    allocatedQuantity: parseNum(data.배정수량),
    tax: parseNum(data.제세금),
    offerPrice: parseNum(data.공모가),
    sellPrice: parseNum(data.매도가),
    sellDate: parseDate(data.매도일),
  };
}

function getItemName(item: SubscriptionHistoryItem): string {
  return (
    item.inputStockName ??
    item.ipoEventCompanyName ??
    item.inputCompanyName ??
    ""
  );
}

export default function HistoryScreen() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [completeId, setCompleteId] = useState<string | null>(null);
  const [draftData, setDraftData] = useState<DetailData | null>(null);
  const [draftName, setDraftName] = useState<string>("");

  const { data: completedHistories = [], isLoading: isLoadingCompleted } =
    useQuery({
      queryKey: queryKeys.subscriptionHistory.list(),
      queryFn: () => getSubscriptionHistories("COMPLETED").then((r) => r.data),
    });

  const { data: ongoingHistories = [], isLoading: isLoadingOngoing } = useQuery(
    {
      queryKey: queryKeys.subscriptionHistory.ongoingList(),
      queryFn: () => getSubscriptionHistories("ONGOING").then((r) => r.data),
    },
  );

  const isLoading = isLoadingCompleted || isLoadingOngoing;
  const allHistories = [...ongoingHistories, ...completedHistories];

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["subscription-history"] });

  const createMutation = useMutation({
    mutationFn: (req: CompletedHistoryCreateRequest) =>
      createCompletedHistory(req),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      req,
    }: {
      id: number;
      req: SubscriptionHistoryUpdateRequest;
    }) => updateSubscriptionHistory(id, req),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSubscriptionHistory(id),
    onSuccess: invalidate,
  });

  const completeMutation = useMutation({
    mutationFn: ({ id, req }: { id: number; req: CompleteHistoryRequest }) =>
      completeHistory(id, req),
    onSuccess: invalidate,
  });

  const handleModalChange = (field: keyof DetailData, value: string) => {
    setDraftData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleAddPress = () => {
    setDraftName("");
    setDraftData({ ...INITIAL_DETAIL });
    setEditId("__new__");
  };

  const handleCompletePress = (id: string) => {
    setCompleteId(id);
  };

  const handleComplete = (data: CompleteHistoryRequest) => {
    if (!completeId) return;
    completeMutation.mutate({ id: Number(completeId), req: data });
    setCompleteId(null);
  };

  const handleEditPress = (id: string) => {
    const item = allHistories.find((i) => String(i.id) === id);
    setDraftName(item ? getItemName(item) : "");
    setDraftData(item ? toDetailData(item) : { ...INITIAL_DETAIL });
    setEditId(id);
  };

  const createOngoingMutation = useMutation({
    mutationFn: (req: OngoingHistoryCreateRequest) => createOngoingHistory(req),
    onSuccess: invalidate,
  });

  const { data: favorites = [] } = useQuery({
    queryKey: queryKeys.favorites.list(),
    queryFn: () => getFavorites().then((r) => r.data),
  });

  const favoriteIpoIds = new Set(favorites.map((f) => f.ipoEventId));

  const handleSave = (data: DetailData, ipoEventId?: number) => {
    if (editId === "__new__") {
      if (ipoEventId) {
        createOngoingMutation.mutate({
          ipoEventId,
          securityCompany: data.증권사 || undefined,
          subscribedQuantity: parseNum(data.청약수량),
          offerPrice: parseNum(data.공모가),
          subscriptionAmount: undefined,
          memo: undefined,
        });
      } else {
        createMutation.mutate(toCreateRequest(draftName, data));
      }
    } else if (editId) {
      updateMutation.mutate({
        id: Number(editId),
        req: toUpdateRequest(draftName, data),
      });
    }
    setEditId(null);
    setDraftData(null);
    setDraftName("");
  };

  const handleCloseModal = () => {
    setEditId(null);
    setDraftData(null);
    setDraftName("");
  };

  const handleDeletePress = (id: string) => {
    deleteMutation.mutate(Number(id));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          allHistories.length === 0 && styles.scrollContentEmpty,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>청약 이력</Text>
          <TouchableOpacity
            style={styles.addButton}
            hitSlop={8}
            onPress={handleAddPress}
          >
            <Ionicons name="add" size={20} color={colors.gray400} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator color={colors.primary600} />
          </View>
        ) : allHistories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyHistoryIcon width={71} height={68} />
            <View style={styles.emptyTextGroup}>
              <Text style={styles.emptyText}>아직 청약 이력이 없어요.</Text>
              <Text style={styles.emptyText}>
                버튼을 눌러 이력을 추가해보세요.
              </Text>
            </View>
          </View>
        ) : (
          allHistories.map((item) => (
            <HistoryCard
              key={item.id}
              id={String(item.id)}
              name={getItemName(item)}
              favorite={
                item.ipoEventId != null && favoriteIpoIds.has(item.ipoEventId)
              }
              recordStatus={item.recordStatus}
              isOpen={openId === String(item.id)}
              data={toDetailData(item)}
              onPress={() =>
                setOpenId(openId === String(item.id) ? null : String(item.id))
              }
              onChange={() => {}}
              onEditPress={handleEditPress}
              onDeletePress={handleDeletePress}
              onCompletePress={handleCompletePress}
            />
          ))
        )}
      </ScrollView>

      {editId && draftData && (
        <EditModal
          visible={true}
          name={draftName}
          data={draftData}
          onClose={handleCloseModal}
          onSave={handleSave}
          onChange={handleModalChange}
          onNameChange={setDraftName}
          mode={editId === "__new__" ? "add" : "edit"}
          recordStatus={
            editId === "__new__"
              ? undefined
              : allHistories.find((i) => String(i.id) === editId)?.recordStatus
          }
        />
      )}

      <CompleteModal
        visible={completeId !== null}
        onClose={() => setCompleteId(null)}
        onComplete={handleComplete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 72,
    paddingBottom: spacing.xl,
  },
  scrollContentEmpty: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyTextGroup: {
    alignItems: "center",
    gap: 4,
  },
  emptyText: {
    ...typography.bodyMedium11,
    color: colors.gray400,
    textAlign: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: spacing.contentArea,
    paddingBottom: spacing.lg,
  },
  pageTitle: {
    ...typography.largeTitleMedium20,
    color: colors.gray800,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray400,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
});
