import { colors, spacing, typography } from "@/styles";
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
import { youtubeSummariesOptions } from "./_components/queries";

// TODO: API 연동 시 교체
const MOCK_SCHEDULE_CARDS: ScheduleCardData[] = [
  {
    id: "1",
    dday: 11,
    companyName: "키움히어로제2호기업인수목적",
    startDate: "04/14(화)",
    priceRange: "2,000~2,000원",
    broker: "신한투자증권",
  },
  {
    id: "2",
    dday: 12,
    companyName: "채비",
    startDate: "04/15(수)",
    priceRange: "12,000~14,000원",
    broker: "신한투자증권",
  },
  {
    id: "3",
    dday: 13,
    companyName: "예시종목",
    startDate: "04/16(목)",
    priceRange: "5,000~6,000원",
    broker: "미래에셋증권",
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState<Pick<
    YoutubeSummaryItem,
    "videoId" | "channelName"
  > | null>(null);

  const { data: youtubeSummaries = [] } = useQuery(youtubeSummariesOptions);

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

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scheduleScrollContent}
          >
            {MOCK_SCHEDULE_CARDS.map((card) => (
              <ScheduleCard
                key={card.id}
                data={card}
                onPress={() => router.push(`/ipo/${card.id}`)}
              />
            ))}
          </ScrollView>
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
    gap: spacing.sm,
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
