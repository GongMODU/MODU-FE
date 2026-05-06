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

export default function SubscriptionScheduleScreen() {
  const router = useRouter();
  const [selectedChip, setSelectedChip] = useState<ScheduleTag>("수요예측");

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>청약 일정</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  monthText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 12,
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
});
