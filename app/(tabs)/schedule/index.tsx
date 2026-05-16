import { colors } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubscriptionCalendar, {
  CalendarEvent,
  ScheduleTag,
  TAG_COLORS,
} from "./_components/SubscriptionCalendar";

const CHIPS: ScheduleTag[] = [
  "수요예측",
  "공모청약",
  "락업해제",
  "환불",
  "상장",
  "배정",
];

// TODO: API 연동 시 교체
type TodayScheduleItem = {
  id: string;
  companyName: string;
  tags: ScheduleTag[];
};

const MOCK_TODAY_SCHEDULE: TodayScheduleItem[] = [
  {
    id: "1",
    companyName: "신한제18호기업인수목적",
    tags: ["배정", "환불"],
  },
  {
    id: "2",
    companyName: "플레드",
    tags: ["수요예측"],
  },
  {
    id: "3",
    companyName: "키움히어로제2호기업인수목적",
    tags: ["상장"],
  },
];

// TODO: API 연동 시 교체
const today = new Date();
const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: "e1",
    date: new Date(today.getFullYear(), today.getMonth(), 1),
    companyName: "공쫀쿠제12호",
    tag: "수요예측",
  },
  {
    id: "e2",
    date: new Date(today.getFullYear(), today.getMonth(), 1),
    companyName: "공쫀쿠인수목적",
    tag: "배정",
  },
  {
    id: "e3",
    date: new Date(today.getFullYear(), today.getMonth(), 2),
    companyName: "공쫀쿠인수목적",
    tag: "공모청약",
  },
  {
    id: "e4",
    date: new Date(today.getFullYear(), today.getMonth(), 3),
    companyName: "공쫀ㄹ쿠인수목적",
    tag: "환불",
  },
  {
    id: "e5",
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    companyName: "신한제18호",
    tag: "배정",
  },
  {
    id: "e6",
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    companyName: "플레드",
    tag: "수요예측",
  },
];

const TOOLTIP_TERMS: { key: string; description: string }[] = [
  {
    key: "수요예측",
    description:
      "IPO(기업공개) 전에 기관투자자를 대상으로 공모 주식에 대한 수요와 희망 가격을 조사해 최종 공모가를 결정하는 절차입니다. 기관들의 수요 데이터를 바탕으로 공모 가격 범위가 확정됩니다.",
  },
  {
    key: "공모청약",
    description:
      "공모청약은 일반 투자자가 기업공개 시 공모 주식을 배정받기 위해 증권사에 청약을 신청하는 절차입니다.",
  },
  {
    key: "락업",
    description:
      "락업(보호예수)은 상장 후 일정 기간 동안 주요 주주가 보유 주식을 매도하지 못하도록 하는 의무 보유 제도입니다.",
  },
  {
    key: "상장",
    description:
      "상장은 기업의 주식이 증권거래소에서 공식적으로 매매될 수 있도록 등록하는 절차입니다.",
  },
  {
    key: "배정",
    description:
      "배정은 공모청약 후 청약자들에게 실제로 주식을 나눠주는 절차입니다. 청약 경쟁률에 따라 배정 수량이 결정됩니다.",
  },
];

export default function SubscriptionScheduleScreen() {
  const router = useRouter();
  const [selectedChip, setSelectedChip] = useState<ScheduleTag>("수요예측");
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const handleTermPress = (term: string) => {
    setExpandedTerm((prev) => (prev === term ? null : term));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 스크롤 콘텐츠 — paddingTop: 72으로 다른 페이지와 동일한 상단 공백 */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 현재 월 */}
        <Text style={styles.monthText}>{currentMonth}월</Text>

        {/* 칩 목록 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipContainer}
          contentContainerStyle={styles.chipContent}
        >
          {CHIPS.map((chip) => {
            const isSelected = selectedChip === chip;
            const chipColor = TAG_COLORS[chip];
            return (
              <TouchableOpacity
                key={chip}
                style={[
                  styles.chip,
                  { borderColor: chipColor },
                  isSelected && { backgroundColor: chipColor },
                ]}
                onPress={() => setSelectedChip(chip)}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: chipColor },
                    isSelected && styles.chipTextSelected,
                  ]}
                >
                  {chip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 캘린더 */}
        <SubscriptionCalendar
          year={currentYear}
          month={currentMonth}
          events={MOCK_EVENTS}
          selectedTag={selectedChip}
        />

        {/* 오늘 주요 일정 */}
        <Text style={styles.sectionTitle}>오늘 주요 일정</Text>
        <View style={styles.todayScheduleList}>
          {MOCK_TODAY_SCHEDULE.map((item) => (
            <View key={item.id} style={styles.scheduleCard}>
              <Text style={styles.scheduleCompanyName}>{item.companyName}</Text>
              <View style={styles.tagRow}>
                {item.tags.map((tag) => (
                  <View
                    key={tag}
                    style={[styles.tag, { borderColor: TAG_COLORS[tag] }]}
                  >
                    <Text style={[styles.tagText, { color: TAG_COLORS[tag] }]}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 고정 헤더 — 스크롤 위에 절대 위치로 올라탐 */}
      <View style={styles.fixedHeader} pointerEvents="box-none">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>청약 일정</Text>
        <TouchableOpacity
          onPress={() => setTooltipVisible((v) => !v)}
          hitSlop={8}
        >
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.gray400}
          />
        </TouchableOpacity>
      </View>

      {/* 툴팁 오버레이 */}
      {tooltipVisible && (
        <>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setTooltipVisible(false)}
          />
          <View style={styles.tooltipCard}>
            <Text style={styles.tooltipTitle}>
              청약 일정 용어가 궁금하신가요?
            </Text>
            <View>
              {TOOLTIP_TERMS.map((term) => {
                const isExpanded = expandedTerm === term.key;
                return (
                  <TouchableOpacity
                    key={term.key}
                    style={styles.termSection}
                    onPress={() => handleTermPress(term.key)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.termHeader}>
                      <Text style={styles.termName}>{term.key}</Text>
                      <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={14}
                        color={colors.gray500}
                      />
                    </View>
                    {isExpanded && (
                      <Text style={styles.termDescription}>
                        {term.description}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingTop: 120,
    paddingBottom: 24,
  },
  // 고정 헤더: 스크롤 위에 겹쳐서 표시
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 95,
    paddingBottom: 4,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  monthText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 18,
  },
  chipContainer: {
    flexGrow: 0,
    marginBottom: 16,
  },
  chipContent: {
    paddingHorizontal: 16,
    gap: 8,
    justifyContent: "center",
    flexGrow: 1,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: colors.white,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
  },
  chipTextSelected: {
    color: colors.white,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 25,
    marginBottom: 10,
  },
  todayScheduleList: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 24,
  },
  scheduleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  scheduleCompanyName: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray800,
    flex: 1,
  },
  tagRow: {
    flexDirection: "row",
    gap: 4,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  tagText: {
    fontSize: 9,
    fontWeight: "500",
    paddingHorizontal: 4,
  },
  // 툴팁
  tooltipCard: {
    position: "absolute",
    top: 100,
    right: 16,
    width: 280,
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 100,
  },
  tooltipTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.gray700,
    lineHeight: 15.6,
    marginBottom: 16,
  },
  termSection: {
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingVertical: 16,
  },
  termHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  termName: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.gray600,
  },
  termDescription: {
    fontSize: 9,
    fontWeight: "500",
    color: colors.gray400,
    lineHeight: 11.7,
    marginTop: 8,
  },
});
