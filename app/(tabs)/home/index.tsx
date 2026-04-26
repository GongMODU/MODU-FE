import { colors, spacing, typography } from "@/styles";
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
import YoutubeBottomSheet from "./_components/YoutubeBottomSheet";
import YoutubeCard from "./_components/YoutubeCard";
import { type YoutubeCardData } from "./_components/types";

// TODO: API 연동 시 교체
const MOCK_YOUTUBE_CARDS: YoutubeCardData[] = [
  {
    id: "1",
    channelName: "슈카월드",
    summaries: [
      "중동 문제로 기름이 모자라 공공기관 차량 5부제를 실시하는 상황이에요.",
      "원료가 부족해 쓰레기 봉투까지 귀해지면서 정부가 급하게 대책을 세우고 있대요.",
      "아시아 전체가 에너지 위기인데 미국은 알아서 해결하라며 선을 그었대요.",
    ],
    videoTitle: "원유 비상, 긴급 대응에 들어간 대한민국",
    videoUrl: "https://youtu.be/xc6znHjNFOI?si=RARbI5TThykiYmHR",
  },
  {
    id: "2",
    channelName: "삼프로TV",
    summaries: [
      "미국 연준이 금리를 동결했지만 시장은 인하 기대를 높이고 있어요.",
      "국내 증시는 외국인 매수세로 반등 흐름을 보이고 있대요.",
      "반도체 업종이 AI 수요 증가로 실적 개선 기대감이 커지고 있어요.",
    ],
    videoTitle: "금리 동결 이후 시장 전망",
    videoUrl: "https://youtu.be/example2",
  },
  {
    id: "3",
    channelName: "주식농부",
    summaries: [
      "장기 투자의 핵심은 좋은 기업을 싸게 사서 오래 보유하는 거예요.",
      "단기 변동성에 흔들리지 않고 기업 본질 가치에 집중해야 해요.",
      "배당 재투자 복리 효과가 장기적으로 큰 차이를 만들어요.",
    ],
    videoTitle: "장기투자 원칙 3가지",
    videoUrl: "https://youtu.be/example3",
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState<YoutubeCardData | null>(
    null,
  );

  const handlePressDetail = (card: YoutubeCardData) => {
    setSelectedCard(card);
  };

  const handleCloseBottomSheet = () => {
    setSelectedCard(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
            <Text style={styles.sectionArrow}>{">"}</Text>
          </TouchableOpacity>
          {/* TODO: 청약 일정 카드 컴포넌트 연동 */}
        </View>

        {/* 오늘의 유튜브 핵심 요약 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>오늘의 유튜브 핵심 요약</Text>

          {/* 카드 슬라이더 */}
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
            {MOCK_YOUTUBE_CARDS.map((card) => (
              <View key={card.id} style={styles.cardWrapper}>
                <YoutubeCard
                  data={card}
                  onPressDetail={() => handlePressDetail(card)}
                />
              </View>
            ))}
          </ScrollView>

          {/* 페이지네이션 */}
          <View style={styles.pagination}>
            {MOCK_YOUTUBE_CARDS.map((_, index) => (
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
        <View style={styles.section}>
          <TouchableOpacity onPress={() => router.push("/history")}>
            <Text style={styles.sectionTitle}>나의 평균 수익률</Text>
          </TouchableOpacity>
          {/* TODO: 수익률 컴포넌트 연동 */}
        </View>
      </ScrollView>

      {/* 바텀 시트 */}
      {selectedCard !== null && (
        <YoutubeBottomSheet
          data={selectedCard}
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
    paddingTop: spacing.md,
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
    ...typography.subtitleMedium14,
    color: colors.gray800,
  },
  sectionArrow: {
    ...typography.subtitleMedium14,
    color: colors.gray400,
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
