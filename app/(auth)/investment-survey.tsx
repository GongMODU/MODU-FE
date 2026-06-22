import {
  analyzeInvestmentProfile,
  getInvestmentQuestions,
} from "@/lib/api/investmentProfile";
import { investmentResultStore } from "@/lib/investmentResultStore";
import { queryKeys } from "@/lib/queryKeys";
import { colors, spacing, typography } from "@/styles";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InvestmentSurveyScreen() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.investmentProfile.questions(),
    queryFn: () => getInvestmentQuestions().then((r) => r.data),
  });

  const questions = data?.questions ?? [];
  const allAnswered =
    questions.length > 0 &&
    questions.every((q) => answers[q.questionNumber] !== undefined);

  const handleSelect = (questionNumber: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionNumber]: optionIndex }));
  };

  const handleComplete = async () => {
    if (!allAnswered || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const body: Record<string, number> = {};
      questions.forEach((q) => {
        body[`q${q.questionNumber}`] = answers[q.questionNumber];
      });
      const res = await analyzeInvestmentProfile(body);
      investmentResultStore.set(res.data);
      router.replace("/(auth)/investment-intro");
    } catch {
      Alert.alert("오류", "분석에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
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

      {isLoading ? (
        <ActivityIndicator style={{ flex: 1 }} color={colors.primary600} />
      ) : isError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            질문을 불러오지 못했습니다. 다시 시도해주세요.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.inner}
          showsVerticalScrollIndicator={false}
        >
          {questions.map((q) => (
            <View key={q.questionNumber} style={styles.questionBlock}>
              <Text style={styles.questionText}>
                {q.questionNumber}. {q.content}
              </Text>
              <View style={styles.optionsGroup}>
                {q.options.map((option) => {
                  const selected =
                    answers[q.questionNumber] === option.index;
                  return (
                    <TouchableOpacity
                      key={option.index}
                      style={[
                        styles.optionButton,
                        selected && styles.optionButtonSelected,
                      ]}
                      onPress={() =>
                        handleSelect(q.questionNumber, option.index)
                      }
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.radio,
                          selected && styles.radioSelected,
                        ]}
                      >
                        {selected && <View style={styles.radioDot} />}
                      </View>
                      <Text
                        style={[
                          styles.optionText,
                          selected && styles.optionTextSelected,
                        ]}
                      >
                        {option.content}
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
            onPress={handleComplete}
            disabled={!allAnswered || isSubmitting}
          >
            <Text
              style={[
                styles.completeButtonText,
                allAnswered && styles.completeButtonTextActive,
              ]}
            >
              {isSubmitting ? "분석 중..." : "완료하기"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
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
    paddingTop: 72,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.subtitleMedium14,
    color: colors.gray800,
  },
  inner: {
    paddingHorizontal: spacing.contentArea,
    paddingBottom: spacing.xl,
    paddingTop: 20,
    gap: spacing.xl,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.contentArea,
  },
  errorText: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: "center",
  },
  questionBlock: {
    gap: spacing.lg,
  },
  questionText: {
    ...typography.subtitleMedium14,
    color: colors.gray800,
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
    backgroundColor: colors.primary50,
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
    ...typography.bodyMedium11,
    color: colors.gray600,
    flex: 1,
  },
  optionTextSelected: {
    color: colors.primary600,
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
    ...typography.footerBold12,
    color: colors.primary100,
  },
  completeButtonTextActive: {
    color: colors.white,
  },
});
