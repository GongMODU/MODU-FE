import { colors, spacing, typography } from "@/styles";
import type { IpoHomeItem } from "@/types/ipo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
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
import {
  listingScheduleOptions,
  lockupScheduleOptions,
  subscriptionScheduleOptions,
} from "./_components/queries";

const CHIPS: ScheduleTag[] = [
  "수요예측",
  "공모청약",
  "락업해제",
  "환불",
  "상장",
  "배정",
];

type TodayScheduleItem = {
  id: string;
  ipoId: number;
  companyName: string;
  tags: ScheduleTag[];
};

const TOOLTIP_TERMS: { key: string; description: string }[] = [
  {
    key: "수요예측",
    description:
      "IPO(기업공개) 전에 기관투자자를 대상으로 공모 주식에 대한 수요와 희망 가격을 조사해 최종 공모가를 결정하는 절차입니다. 기관들의 수요 데이터를 바탕으로 공모 가격 범위가 확정됩니다.",
  },
  {
    key: "공모청약",
    description:
      "수요예측 이후 일반 투자자가 증권사를 통해 공모 주식을 사겠다고 신청하는 절차입니다. 청약 경쟁률이 높을수록 실제로 배정받는 수량이 줄어들 수 있습니다.",
  },
  {
    key: "락업",
    description:
      "상장 후 일정 기간 동안 최대주주·기관 등 주요 주주가 보유 주식을 팔지 못하도록 의무화한 제도입니다. 락업 기간이 끝나면 보유 주식이 시장에 풀릴 수 있어 주가에 영향을 줄 수 있습니다.",
  },
  {
    key: "상장",
    description:
      "기업의 주식이 증권거래소에 등록되어 일반 투자자들이 자유롭게 사고팔 수 있게 되는 첫 거래 시작일입니다. 상장 당일은 공모가 대비 주가 변동이 크게 나타나는 경우가 많습니다.",
  },
  {
    key: "배정",
    description:
      "공모청약이 끝난 후 청약자들에게 실제로 주식을 나눠주는 절차입니다. 청약 경쟁률에 따라 배정 수량이 결정되며, 미배정된 금액은 환불됩니다.",
  },
];

// "YYYY-MM-DD" 문자열 → 로컬 Date (타임존 오류 방지)
function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// 오늘 날짜를 "YYYY-MM-DD" 형식으로
function todayString(): string {
  const t = new Date();
  const y = t.getFullYear();
  const m = String(t.getMonth() + 1).padStart(2, "0");
  const d = String(t.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function SubscriptionScheduleScreen() {
  const router = useRouter();
  const [selectedChips, setSelectedChips] = useState<ScheduleTag[]>([]);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const { data: subscriptionItems = [] } = useQuery(
    subscriptionScheduleOptions,
  );
  const { data: listingItems = [] } = useQuery(listingScheduleOptions);
  const { data: lockupItems = [] } = useQuery(lockupScheduleOptions);

  // 달력 이벤트 생성 (날짜 필드가 있는 3가지 타입만)
  const calendarEvents = useMemo((): CalendarEvent[] => {
    const events: CalendarEvent[] = [];

    subscriptionItems.forEach((item: IpoHomeItem) => {
      events.push({
        id: `sub-${item.ipoEventId}`,
        ipoId: item.ipoEventId,
        date: parseLocalDate(item.subscriptionStartDate),
        companyName: item.companyName,
        tag: "공모청약",
      });
    });

    listingItems.forEach((item: IpoHomeItem) => {
      events.push({
        id: `list-${item.ipoEventId}`,
        ipoId: item.ipoEventId,
        date: parseLocalDate(item.listingDate),
        companyName: item.companyName,
        tag: "상장",
      });
    });

    lockupItems.forEach((item: IpoHomeItem) => {
      events.push({
        id: `lock-${item.ipoEventId}`,
        ipoId: item.ipoEventId,
        date: parseLocalDate(item.lockupExpiryDate),
        companyName: item.companyName,
        tag: "락업해제",
      });
    });

    return events;
  }, [subscriptionItems, listingItems, lockupItems]);

  // 오늘 주요 일정 (오늘 날짜와 매칭되는 항목)
  const todaySchedule = useMemo((): TodayScheduleItem[] => {
    const today = todayString();
    const map = new Map<number, TodayScheduleItem>();

    const addTag = (item: IpoHomeItem, tag: ScheduleTag) => {
      const existing = map.get(item.ipoEventId);
      if (existing) {
        if (!existing.tags.includes(tag)) existing.tags.push(tag);
      } else {
        map.set(item.ipoEventId, {
          id: String(item.ipoEventId),
          ipoId: item.ipoEventId,
          companyName: item.companyName,
          tags: [tag],
        });
      }
    };

    subscriptionItems.forEach((item) => {
      if (
        item.subscriptionStartDate <= today &&
        today <= item.subscriptionEndDate
      ) {
        addTag(item, "공모청약");
      }
    });

    listingItems.forEach((item) => {
      if (item.listingDate === today) {
        addTag(item, "상장");
      }
    });

    lockupItems.forEach((item) => {
      if (item.lockupExpiryDate === today) {
        addTag(item, "락업해제");
      }
    });

    return Array.from(map.values());
  }, [subscriptionItems, listingItems, lockupItems]);

  const toggleChip = (chip: ScheduleTag) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip],
    );
  };

  const handleTermPress = (term: string) => {
    setExpandedTerm((prev) => (prev === term ? null : term));
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 현재 월 */}
        <Text style={styles.monthText}>{currentMonth}월</Text>

        {/* 칩 목록 */}
        <View style={styles.chipRow}>
          {CHIPS.map((chip) => {
            const isSelected = selectedChips.includes(chip);
            const chipColor = TAG_COLORS[chip];
            return (
              <TouchableOpacity
                key={chip}
                style={[
                  styles.chip,
                  { backgroundColor: isSelected ? chipColor : colors.gray100 },
                ]}
                onPress={() => toggleChip(chip)}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: isSelected ? colors.gray50 : colors.gray500 },
                  ]}
                >
                  {chip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 캘린더 */}
        <SubscriptionCalendar
          year={currentYear}
          month={currentMonth}
          events={calendarEvents}
          selectedTags={selectedChips}
          onEventPress={(ipoId) => router.push(`/ipo/${ipoId}`)}
        />

        {/* 오늘 주요 일정 */}
        <View style={styles.todaySection}>
          <Text style={styles.sectionTitle}>오늘 주요 일정</Text>
          <View style={styles.todayScheduleList}>
            {todaySchedule.length === 0 ? (
              <View style={styles.emptyToday}>
                <Text style={styles.emptyTodayText}>
                  오늘 예정된 일정이 없어요.
                </Text>
              </View>
            ) : (
              todaySchedule.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.scheduleCard}
                  onPress={() => router.push(`/ipo/${item.ipoId}`)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.scheduleCompanyName}>
                    {item.companyName}
                  </Text>
                  <View style={styles.tagRow}>
                    {item.tags.map((tag) => (
                      <View
                        key={tag}
                        style={[styles.tag, { borderColor: TAG_COLORS[tag] }]}
                      >
                        <Text
                          style={[styles.tagText, { color: TAG_COLORS[tag] }]}
                        >
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* 고정 헤더 */}
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
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingTop: 120,
    flexGrow: 1,
  },
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
  chipRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: spacing.contentArea,
    marginBottom: 16,
  },
  chip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
    borderRadius: 16,
  },
  chipText: {
    ...typography.labelMedium10,
  },
  todaySection: {
    backgroundColor: colors.gray50,
    paddingHorizontal: spacing.contentArea,
    paddingVertical: 16,
    gap: 12,
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  todayScheduleList: {
    gap: 8,
  },
  emptyToday: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyTodayText: {
    fontSize: 13,
    color: colors.gray400,
  },
  scheduleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
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
