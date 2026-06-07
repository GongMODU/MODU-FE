import { colors, spacing, typography } from "@/styles";
import type { IpoHomeItem } from "@/types/ipo";
import { type YoutubeSummaryItem } from "@/types/youtube";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfitRateSection from "./_components/ProfitRateSection";
import ScheduleCard, {
  type ScheduleCardData,
} from "./_components/ScheduleCard";
import YoutubeBottomSheet from "./_components/YoutubeBottomSheet";
import YoutubeCard from "./_components/YoutubeCard";
import { ipoHomeOptions, youtubeSummariesOptions } from "./_components/queries";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function getThisWeekRange(): { start: Date; end: Date } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = today.getDay(); // 0=일, 1=월 ... 6=토
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { start: monday, end: sunday };
}

function isThisWeek(item: IpoHomeItem): boolean {
  const { start, end } = getThisWeekRange();
  const [y, m, d] = item.subscriptionStartDate.split("-").map(Number);
  const itemStart = new Date(y, m - 1, d);
  return itemStart >= start && itemStart <= end;
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}/${day}(${WEEKDAYS[date.getDay()]})`;
}

function formatPriceRange(item: IpoHomeItem): string {
  if (item.offerPrice != null) {
    return `${item.offerPrice.toLocaleString()}원`;
  }
  return `${item.offerPriceMin.toLocaleString()}~${item.offerPriceMax.toLocaleString()}원`;
}

function toScheduleCardData(item: IpoHomeItem): ScheduleCardData {
  return {
    id: String(item.ipoEventId),
    dday: item.ddayLabel ?? "",
    companyName: item.companyName,
    startDate: formatDate(item.subscriptionStartDate),
    priceRange: formatPriceRange(item),
    broker: item.brokerNames[0] ?? "-",
  };
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState<Pick<
    YoutubeSummaryItem,
    "videoId" | "channelName"
  > | null>(null);

  const { data: youtubeSummaries = [] } = useQuery(youtubeSummariesOptions);
  const { data: ipoItemsAll = [] } = useQuery(ipoHomeOptions());
  const ipoItems = ipoItemsAll.filter(isThisWeek);

  const handlePressDetail = (card: YoutubeSummaryItem) => {
    setSelectedCard({ videoId: card.videoId, channelName: card.channelName });
  };

  const handleCloseBottomSheet = () => {
    setSelectedCard(null);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 이번주 청약 일정 */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => router.push("/schedule")}
          >
            <Text style={styles.sectionTitle}>이번주 청약 일정</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.gray400} />
          </TouchableOpacity>

          {ipoItems.length === 0 ? (
            <Text style={styles.emptyScheduleText}>이번주 청약 일정이 없어요.</Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scheduleScrollContent}
            >
              {ipoItems.map((item) => (
                <ScheduleCard
                  key={item.ipoEventId}
                  data={toScheduleCardData(item)}
                  onPress={() => router.push(`/ipo/${item.ipoEventId}`)}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* 오늘의 유튜브 핵심 요약 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>오늘의 유튜브 핵심 요약</Text>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x /
                  e.nativeEvent.layoutMeasurement.width,
              );
              setActiveCardIndex(index);
            }}
          >
            {youtubeSummaries.map((card) => (
              <View key={card.videoId} style={styles.cardWrapper}>
                <YoutubeCard
                  data={card}
                  onPressDetail={() => handlePressDetail(card)}
                />
              </View>
            ))}
          </ScrollView>

          <View style={styles.pagination}>
            {youtubeSummaries.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === activeCardIndex
                    ? styles.dotActive
                    : styles.dotInactive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* 나의 평균 수익률 */}
        <ProfitRateSection />
      </ScrollView>

      {selectedCard !== null && (
        <YoutubeBottomSheet
          videoId={selectedCard.videoId}
          channelName={selectedCard.channelName}
          onClose={handleCloseBottomSheet}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: 72,
    paddingBottom: spacing.xl,
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    ...typography.largeTitleMedium20,
    color: colors.gray800,
  },
  scheduleScrollContent: {
    gap: spacing.sm,
  },
  emptyScheduleText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.gray400,
    textAlign: "center",
    paddingVertical: spacing.lg,
  },
  cardWrapper: {
    width: SCREEN_WIDTH - spacing.lg * 2,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    backgroundColor: colors.primary600,
  },
  dotInactive: {
    backgroundColor: colors.primary100,
  },
});
