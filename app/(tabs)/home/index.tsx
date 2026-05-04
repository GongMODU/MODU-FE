import { colors, spacing, typography } from "@/styles";
import { type YoutubeCardData } from "@/types/youtube";
import { Ionicons } from "@expo/vector-icons";
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
import ScheduleCard, {
  type ScheduleCardData,
} from "./_components/ScheduleCard";
import YoutubeBottomSheet from "./_components/YoutubeBottomSheet";
import YoutubeCard from "./_components/YoutubeCard";

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
    sections: [
      {
        title: "\"기름이 모자라요\" 국가 에너지 경보 '주의' 발령",
        body: "최근 중동 지역의 갈등으로 인해 우리나라로 들어오는 원유 수급에 빨간불이 켜졌습니다. 정부는 에너지 위기 경보를 '관심'에서 '주의' 단계로 격상했습니다. '주의' 단계는 단순히 걱정하는 수준을 넘어 실제로 기름을 들여오는 데 차질이 생기기 시작했음을 의미합니다. 이에 따라 전국 공공기관과 공무원들을 대상으로 '승용차 5부제'가 강제 시행되었습니다.최근 중동 지역의 갈등으로 인해 우리나라로 들어오는 원유 수급에 빨간불이 켜졌습니다. 정부는 에너지 위기 경보를 '관심'에서 '주의' 단계로 격상했습니다. '주의' 단계는 단순히 걱정하는 수준을 넘어 실제로 기름을 들여오는 데 차질이 생기기 시작했음을 의미합니다. 이에 따라 전국 공공기관과 공무원들을 대상으로 '승용차 5부제'가 강제 시행되었습니다.",
      },
      {
        title: "쓰레기 봉투 대란? 기름 부족이 가져온 뜻밖의 여파",
        body: "최근 중동 지역의 갈등으로 인해 우리나라로 들어오는 원유 수급에 빨간불이 켜졌습니다. 정부는 에너지 위기 경보를 '관심'에서 '주의' 단계로 격상했습니다. '주의' 단계는 단순히 걱정하는 수준을 넘어 실제로 기름을 들여오는 데 차질이 생기기 시작했음을 의미합니다. 이에 따라 전국 공공기관과 공무원들을 대상으로 '승용차 5부제'가 강제 시행되었습니다.기름이 부족해지면 자동차만 못 가는 것이 아닙니다. 우리가 흔히 쓰는 플라스틱, 비닐의 원료인 '나프타'도 기름에서 나오기 때문입니다. 최근 '쓰레기 봉투를 사기 힘들다'는 소문이 돌면서 일부 지역에서는 1인당 구매 제한까지 생겼습니다.",
      },
      {
        title: "올라가는 기름값과 금리, 얇아지는 지갑",
        body: "최근 중동 지역의 갈등으로 인해 우리나라로 들어오는 원유 수급에 빨간불이 켜졌습니다. 정부는 에너지 위기 경보를 '관심'에서 '주의' 단계로 격상했습니다. '주의' 단계는 단순히 걱정하는 수준을 넘어 실제로 기름을 들여오는 데 차질이 생기기 시작했음을 의미합니다. 이에 따라 전국 공공기관과 공무원들을 대상으로 '승용차 5부제'가 강제 시행되었습니다.당장 주유소의 기름값도 크게 올랐습니다. 정부가 가격을 억제하기 위해 '최고 가격제'를 쓰고 있지만, 그럼에도 불구하고 휘발유와 경유 가격이 일제히 인상되었습니다. 물가가 계속 치솟자 은행 금리도 함께 들썩이고 있습니다.",
      },
      {
        title: '"각자도생" 선언한 미국과 위기의 아시아',
        body: "가장 큰 문제는 이 위기가 언제 끝날지 모른다는 점입니다. 한국, 일본, 필리핀 등 아시아 국가들은 중동 기름 의존도가 매우 높아 다 같이 비명이 나오고 있습니다. 하지만 미국은 냉정한 태도를 보이고 있습니다.",
      },
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
    sections: [
      {
        title: "금리 동결 이후 시장 전망",
        body: "미국 연준이 금리를 동결하면서 시장은 연내 금리 인하 기대를 높이고 있습니다. 국내 증시는 외국인 매수세가 유입되며 반등 흐름을 보이고 있습니다.",
      },
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
    sections: [
      {
        title: "장기투자 원칙 3가지",
        body: "장기 투자의 핵심은 좋은 기업을 싸게 사서 오래 보유하는 것입니다. 단기 변동성에 흔들리지 않고 기업 본질 가치에 집중해야 하며, 배당 재투자를 통한 복리 효과가 장기적으로 큰 차이를 만들어냅니다.",
      },
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

          {/* 청약 일정 카드 슬라이더 */}
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
