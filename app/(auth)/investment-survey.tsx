import { colors, spacing } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const questions = [
  {
    id: 1,
    question: "1. 공모주 투자에서 가장 기대하는 것은 무엇인가요?",
    options: [
      "상장 당일 수익 실현",
      "단기(1-3개월) 주가 상승",
      "장기 성장 기대",
      "일단 배정 받는 경험",
    ],
  },
  {
    id: 2,
    question: "2. 지금까지 공모주 청약에 참여해본 적 있나요?",
    options: ["전혀 없다", "1~3회 해봤다", "4회 이상 해봤다"],
  },
  {
    id: 3,
    question: "3. 아래 용어 중 뜻을 알고 있는 용어의 개수를 골라주세요.",
    description:
      "수요예측, 의무확약, 유통가능물량, 균등배정, 비례배정, 최소청약증거금, 기관경쟁률",
    options: ["모두 알고 있다", "4~6개 알고 있다", "1~3개 알고 있다"],
  },
];

export default function InvestmentSurveyScreen() {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  const handleSelect = (questionId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.gray800} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>개인 투자 성향</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.inner}
        showsVerticalScrollIndicator={false}
      >
        {questions.map((q) => (
          <View key={q.id} style={styles.questionBlock}>
            <Text style={styles.questionText}>{q.question}</Text>
            {q.description && (
              <Text style={styles.descriptionText}>{q.description}</Text>
            )}
            <View style={styles.optionsGroup}>
              {q.options.map((option) => {
                const selected = answers[q.id] === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      selected && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleSelect(q.id, option)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[styles.radio, selected && styles.radioSelected]}
                    >
                      {selected && <View style={styles.radioDot} />}
                    </View>
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* 완료하기 버튼 */}
        <TouchableOpacity
          style={[
            styles.completeButton,
            allAnswered && styles.completeButtonActive,
          ]}
          onPress={() =>
            allAnswered && router.replace("/(auth)/investment-intro")
          }
          disabled={!allAnswered}
        >
          <Text
            style={[
              styles.completeButtonText,
              allAnswered && styles.completeButtonTextActive,
            ]}
          >
            완료하기
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: spacing.contentArea,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.gray800,
  },
  inner: {
    paddingHorizontal: spacing.contentArea,
    paddingBottom: spacing.xl,
    gap: spacing.xl,
  },
  questionBlock: {
    gap: spacing.lg,
  },
  questionText: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.gray800,
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray600,
    marginTop: -12,
  },
  optionsGroup: {
    gap: spacing.xs,
  },
  optionButton: {
    width: "100%",
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  optionButtonSelected: {
    borderColor: colors.primary600,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray300,
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    borderColor: colors.primary600,
    borderWidth: 6,
    backgroundColor: colors.primary600,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray600,
    flex: 1,
  },
  optionTextSelected: {
    color: colors.gray800,
  },
  completeButton: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary100,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  completeButtonActive: {
    backgroundColor: colors.primary600,
    borderColor: colors.primary600,
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary100,
  },
  completeButtonTextActive: {
    color: colors.white,
  },
});
