import { colors, spacing, typography } from "@/styles";
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

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "Q1",
    question: "MODU는 어떤 서비스인가요?",
    answer:
      "MODU는 국내 IPO(기업공개) 정보를 한눈에 확인할 수 있는 서비스입니다. 공모 일정, 기업 재무 정보, AI 기반 영상 요약 등을 제공하여 IPO 투자 결정에 도움을 드립니다.",
  },
  {
    id: "Q2",
    question: "투자 성향 테스트는 무엇인가요?",
    answer:
      "간단한 설문을 통해 나의 투자 성향을 분석해 드리는 기능입니다. 결과는 참고용이며, 실제 투자 결정의 근거로 사용하기에는 한계가 있을 수 있습니다.",
  },
  {
    id: "Q3",
    question: "AI 요약 정보는 어떻게 생성되나요?",
    answer:
      "MODU의 AI 요약은 해당 기업 관련 YouTube 영상을 분석하여 핵심 내용을 요약한 것입니다. AI가 생성한 내용으로, 부정확하거나 누락된 정보가 있을 수 있으니 반드시 원본 자료를 함께 확인하시기 바랍니다.",
  },
  {
    id: "Q4",
    question: "공모 청약 일정은 어디서 확인하나요?",
    answer:
      "홈 화면 및 청약 일정 탭에서 현재 진행 중이거나 예정된 공모 청약 일정을 확인할 수 있습니다.",
  },
  {
    id: "Q5",
    question: "제공되는 정보는 얼마나 정확한가요?",
    answer:
      "MODU에서 제공하는 정보는 공개된 자료를 기반으로 하며, 정보의 정확성·완전성을 보장하지 않습니다. 투자 판단 전 금융감독원 전자공시시스템(DART) 등 공식 출처를 반드시 확인하시기 바랍니다.",
  },
  {
    id: "Q6",
    question: "앱 이용 중 오류가 발생했어요.",
    answer:
      "앱을 완전히 종료 후 재실행해 주세요. 이후에도 문제가 지속되면 앱을 삭제 후 재설치해 주시기 바랍니다.",
  },
];

export default function FaqScreen() {
  const router = useRouter();
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.gray800} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>도움말 및 FAQ</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {FAQ_ITEMS.map((item) => {
          const isExpanded = expandedIds.includes(item.id);
          return (
            <View key={item.id} style={styles.faqItem}>
              {/* 질문 행 */}
              <TouchableOpacity
                style={styles.questionRow}
                onPress={() => toggleItem(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.questionLeft}>
                  <Text style={styles.questionId}>{item.id}</Text>
                  <Text style={styles.questionText}>{item.question}</Text>
                </View>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={14}
                  color={colors.gray600}
                />
              </TouchableOpacity>

              {/* 답변 */}
              {isExpanded && (
                <Text style={styles.answerText}>{item.answer}</Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.safeArea,
    paddingTop: 72,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.subtitleMedium14,
    color: colors.gray800,
  },
  headerPlaceholder: {
    width: 24,
  },
  scrollContent: {
    paddingHorizontal: spacing.contentArea,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  faqItem: {
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    gap: spacing.xs,
  },
  questionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  questionId: {
    ...typography.subtitleMedium14,
    color: colors.primary600,
  },
  questionText: {
    ...typography.subtitleMedium14,
    color: colors.gray700,
    flex: 1,
  },
  answerText: {
    ...typography.bodyRegular11,
    color: colors.gray600,
    lineHeight: 19.25,
  },
});
