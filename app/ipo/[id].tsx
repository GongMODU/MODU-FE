import { addFavorite, deleteFavorite } from "@/lib/api/ipo";
import { queryKeys } from "@/lib/queryKeys";
import { colors, spacing, typography } from "@/styles";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DetailInfoSection from "./_components/DetailInfoSection";
import DisclosureReportSection from "./_components/DisclosureReportSection";
import IPODetailHeader from "./_components/IPODetailHeader";
import KeyIndicatorSection from "./_components/KeyIndicatorSection";
import {
  ipoDetailOptions,
  ipoDisclosureOptions,
  ipoFinancialsOptions,
} from "./_components/queries";
import {
  toCompanyTabInfo,
  toDisclosureReport,
  toKeyIndicator,
  toPredictionInfo,
  toSubscriptionInfo,
} from "./_components/transforms";

export default function IPODetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ipoEventId = parseInt(id, 10);
  const queryClient = useQueryClient();

  const {
    data: detail,
    isPending: isDetailPending,
    isError: isDetailError,
  } = useQuery(ipoDetailOptions(ipoEventId));

  const {
    data: disclosure,
    isPending: isDisclosurePending,
    isError: isDisclosureError,
  } = useQuery(ipoDisclosureOptions(ipoEventId));

  const { data: financials, isPending: isFinancialsPending } = useQuery(
    ipoFinancialsOptions(ipoEventId),
  );

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: (isFavorited: boolean) =>
      isFavorited ? deleteFavorite(ipoEventId) : addFavorite(ipoEventId),
    onMutate: async (isFavorited: boolean) => {
      await queryClient.cancelQueries(ipoDetailOptions(ipoEventId));
      const previous = queryClient.getQueryData(
        queryKeys.ipo.detail(ipoEventId),
      );
      queryClient.setQueryData(
        queryKeys.ipo.detail(ipoEventId),
        (old: typeof detail) =>
          old ? { ...old, favorited: !isFavorited } : old,
      );
      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.ipo.detail(ipoEventId),
          context.previous,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.ipo.detail(ipoEventId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.list() });
    },
  });

  if (isDetailPending || isDisclosurePending || isFinancialsPending) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  if (
    isDetailError ||
    isDisclosureError ||
    !detail ||
    !disclosure ||
    !financials
  ) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.center}>
          <Text style={styles.errorText}>데이터를 불러오지 못했어요.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const keyIndicator = toKeyIndicator(detail.signalLevel, detail.riskScore);
  const subscription = toSubscriptionInfo(detail.subscription);
  const prediction = toPredictionInfo(detail.forecast);
  const companyTab = toCompanyTabInfo(detail.company);
  const disclosureReport = toDisclosureReport(disclosure, financials);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <IPODetailHeader
          item={detail}
          onToggleFavorite={() => toggleFavorite(detail.favorited)}
        />
        <KeyIndicatorSection keyIndicator={keyIndicator} />
        <DetailInfoSection
          subscription={subscription}
          prediction={prediction}
          companyTab={companyTab}
        />
        <DisclosureReportSection data={disclosureReport} />

        {/* 면책 문구 */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            MODU는 정보 제공을 우선하며, 투자를 권유 및 유도하지 않습니다.
          </Text>
          <Text style={styles.disclaimerText}>
            제공하는 정보들은 오류가 존재할 수 있으며, 투자 결과에 대한 법적인
            책임을 지지 않습니다.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingTop: 48,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  disclaimer: {
    paddingLeft: 32,
    gap: 4,
  },
  disclaimerText: {
    ...typography.captionMedium8,
    color: colors.gray400,
  },
  errorText: {
    ...typography.bodyRegular10,
    color: colors.gray500,
  },
});
