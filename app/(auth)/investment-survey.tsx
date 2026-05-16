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
  {
    id: 4,
    question: "4. 공시 리포트나 투자 뉴스를 읽을 때 어떤 느낌인가요?",
    options: [
      "무슨 말인지 거의 모르겠다",
      "어느 정도 읽히지만 어렵다",
      "대부분 이해한다",
    ],
  },
  {
    id: 5,
    question: "5. 공모주 청약에 쓸 수 있는 여유 자금 규모는 어느 정도인가요?",
    options: ["50만 원 미만", "50~200만 원", "200~500만 원", "500만 원 이상"],
  },
  {
    id: 6,
    question: "6. 상장 후 주가가 공모가보다 10% 떨어졌다면 어떻게 하시겠어요?",
    options: [
      "즉시 손절한다",
      "조금 기다려본다",
      "물타기(추가 매수)를 고려한다",
      "장기 보유한다",
    ],
  },
  {
    id: 7,
    question:
      "7. 공모주 청약에 넣는 돈이 전체 투자 자산에서 차지하는 비중이 어느 정도인가요?",
    options: ["10% 미만", "10~30%", "30~50%", "절반 이상"],
  },
  {
    id: 8,
    question:
      "8. 신호등이 '위험'인 공모주라도 관심이 가는 기업이라면 청약할 의향이 있나요?",
    options: [
      "절대 안 한다",
      "다른 정보를 더 찾아보고 결정한다",
      "신호등보다 내 판단을 믿는다",
    ],
  },
  {
    id: 9,
    question: "9. 평소 투자 자산을 어떻게 운용하고 있나요?",
    options: [
      "예/적금만 한다",
      "주식 일부 + 예적금 병행",
      "주식/펀드 위주로 운용",
      "코인/레버리지 등 고위험 자산 포함",
    ],
  },
  {
    id: 10,
    question: "10. 공모주에서 기대하는 수익 실현 시점은 언제인가요?",
    options: [
      "상장 당일 팔겠다",
      "1~3개월 내 팔겠다",
      "6개월~1년 이상 보유하겠다",
      "상황 봐서 / 정해두지 않겠다",
    ],
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
    paddingTop: 72,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.gray800,
  },
  inner: {
    paddingHorizontal: spacing.contentArea,
    paddingBottom: spacing.xl,
    paddingTop: 20,
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
