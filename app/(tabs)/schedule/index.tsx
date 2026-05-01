import { colors } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CHIPS = ["수요예측", "공모청약", "락업해제", "환불", "상장", "배정"];

// 태그 타입
type ScheduleTag =
  | "수요예측"
  | "공모청약"
  | "락업해제"
  | "환불"
  | "상장"
  | "배정";

// 태그별 색상 매핑
const TAG_COLORS: Record<ScheduleTag, string> = {
  수요예측: colors.calender.demandBlue,
  공모청약: colors.primary600,
  락업해제: colors.calender.lockupPink,
  환불: colors.calender.refundSlate,
  상장: colors.calender.listingGreen,
  배정: colors.calender.allocationOrange,
};

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

export default function SubscriptionScheduleScreen() {
  const router = useRouter();
  const [selectedChip, setSelectedChip] = useState("수요예측");

  const currentMonth = new Date().getMonth() + 1;

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 - 스크롤과 무관하게 상단 고정 */}
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
          {CHIPS.map((chip) => (
            <TouchableOpacity
              key={chip}
              style={[
                styles.chip,
                selectedChip === chip && styles.chipSelected,
              ]}
              onPress={() => setSelectedChip(chip)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedChip === chip && styles.chipTextSelected,
                ]}
              >
                {chip}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 캘린더 공백 영역 */}
        <View style={styles.calendarPlaceholder} />

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
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  chipSelected: {
    backgroundColor: "#7B61FF",
    borderColor: "#7B61FF",
  },
  chipText: {
    fontSize: 13,
    color: "#666",
  },
  chipTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  calendarPlaceholder: {
    marginHorizontal: 20,
    height: 390,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    marginBottom: 24,
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
