import { reanalyzeInvestment } from "@/lib/api/mypage";
import { queryKeys } from "@/lib/queryKeys";
import { colors, spacing, typography } from "@/styles";
import { type InvestmentAnswersPayload } from "@/types/investment";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
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
import { retestQuestionsOptions } from "../_components/queries";

export default function InvestmentRetestScreen() {
  const [answers, setAnswers] = useState<Partial<InvestmentAnswersPayload>>({});
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery(retestQuestionsOptions());

  const { mutate: reanalyze, isPending } = useMutation({
    mutationFn: (answers: InvestmentAnswersPayload) =>
      reanalyzeInvestment(answers).then((r) => r.data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mypage.home() });
      router.push({
        pathname: "/(tabs)/mypage/investment-retest/result",
        params: {
          koreanName: result.koreanName,
          keywordTags: result.keywordTags,
        },
      });
    },
    onError: () => {
      Alert.alert("오류", "분석에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const questions = data?.questions ?? [];

  const allAnswered =
    questions.length > 0 &&
    questions.every((q) => answers[`q${q.questionNumber}`] !== undefined);

  const handleSelect = (questionNumber: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [`q${questionNumber}`]: optionIndex,
    }));
  };

  const handleComplete = () => {
    if (!allAnswered || isPending) return;
    reanalyze(answers as InvestmentAnswersPayload);
  };

  if (isLoading) {
    return (
      <SafeAreaView edges={["top"]} style={styles.container}>
        <ActivityIndicator style={styles.loader} color={colors.primary600} />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView edges={["top"]} style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            질문을 불러오지 못했습니다. 다시 시도해주세요.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
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
          <View key={q.questionNumber} style={styles.questionBlock}>
            <Text style={styles.questionText}>
              {q.questionNumber}. {q.content}
            </Text>
            {q.description && (
              <Text style={styles.descriptionText}>{q.description}</Text>
            )}
            <View style={styles.optionsGroup}>
              {q.options.map((option) => {
                const selected =
                  answers[`q${q.questionNumber}`] === option.index;
                return (
                  <TouchableOpacity
                    key={option.index}
                    style={[
                      styles.optionButton,
                      selected && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleSelect(q.questionNumber, option.index)}
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
                      {option.content}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[
            styles.completeButton,
            allAnswered && styles.completeButtonActive,
          ]}
          onPress={handleComplete}
          disabled={!allAnswered || isPending}
        >
          <Text
            style={[
              styles.completeButtonText,
              allAnswered && styles.completeButtonTextActive,
            ]}
          >
            {isPending ? "분석 중..." : "완료하기"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  loader: { flex: 1 },
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
  questionBlock: { gap: spacing.lg },
  questionText: {
    ...typography.subtitleMedium14,
    color: colors.gray800,
  },
  descriptionText: {
    ...typography.labelMedium10,
    color: colors.gray600,
    marginTop: -12,
  },
  optionsGroup: { gap: spacing.xs },
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
  optionButtonSelected: { borderColor: colors.primary600 },
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
  optionTextSelected: { color: colors.gray800 },
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
  completeButtonTextActive: { color: colors.white },
});
