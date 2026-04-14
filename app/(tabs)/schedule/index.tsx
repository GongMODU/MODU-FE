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

export default function SubscriptionScheduleScreen() {
  const router = useRouter();
  const [selectedChip, setSelectedChip] = useState("수요예측");

  const currentMonth = new Date().getMonth() + 1; // 현재 달

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
            style={[styles.chip, selectedChip === chip && styles.chipSelected]}
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

      {/* 오늘 주요 일정 공백 영역 */}
      <Text style={styles.sectionTitle}>오늘 주요 일정</Text>
      <View style={styles.todayPlaceholder} />
      <View style={styles.todayPlaceholder} />
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
  backButton: {
    fontSize: 20,
    color: "#333",
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
    height: 280,
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
  todayPlaceholder: {
    marginHorizontal: 20,
    height: 56,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 8,
  },
});
