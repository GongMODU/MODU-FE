import { investmentResultStore } from "@/lib/investmentResultStore";
import { tokenStore } from "@/lib/tokenStore";
import { colors, spacing } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InvestmentIntroScreen() {
  const result = investmentResultStore.get();
  const nickname = tokenStore.getNickname() ?? "";
  const keywordTags = (() => {
    const raw = result?.keywordTags;
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed
          .map((t: unknown) => String(t).trim())
          .filter(Boolean)
          .map((t) => (t.startsWith("#") ? t : `#${t}`));
      }
    } catch {}
    return raw
      .replace(/[\[\]"']/g, "")
      .split(/[,\s]+/)
      .filter(Boolean)
      .map((t) => (t.startsWith("#") ? t : `#${t}`));
  })();

  const knowledgeScoreEntries = result?.knowledgeScoreMap
    ? Object.entries(result.knowledgeScoreMap)
    : [];
  const riskScoreEntries = result?.riskScoreMap
    ? Object.entries(result.riskScoreMap)
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/(tabs)/home")}
        >
          <Ionicons name="chevron-back" size={24} color={colors.gray800} />
        </TouchableOpacity>

        {/* 인사 텍스트 */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>{result?.koreanName ?? ""}</Text>
          <Text style={styles.greetingNickname}>
            <Text style={styles.nicknameHighlight}>{nickname}</Text>
            <Text style={styles.greetingText}> 님, 안녕하세요!</Text>
          </Text>
        </View>

        {/* 이미지 플레이스홀더 */}
        <View style={styles.imagePlaceholder} />

        {/* 투자 성향 키워드 */}
        <Text style={styles.sectionTitle}>투자 성향 키워드</Text>
        <View style={styles.chipRow}>
          {keywordTags.map((tag) => (
            <View key={tag} style={styles.chip}>
              <Text style={styles.chipText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* 페르소나 정보 카드 */}
        <View style={styles.infoCard}>
          <View style={styles.personaHeader}>
            {result?.personaCode ? (
              <View style={styles.personaCodeBadge}>
                <Text style={styles.personaCodeText}>{result.personaCode}</Text>
              </View>
            ) : null}
            {result?.englishName ? (
              <Text style={styles.englishName}>{result.englishName}</Text>
            ) : null}
          </View>
          {result?.axisSummary ? (
            <Text style={styles.axisSummary}>{result.axisSummary}</Text>
          ) : null}
        </View>

        {/* 지식 수준 / 위험 수준 */}
        <View style={styles.levelRow}>
          <View style={[styles.levelCard, { flex: 1 }]}>
            <Text style={styles.levelLabel}>지식 수준</Text>
            <Text style={styles.levelValue}>
              {result?.knowledgeLevel ?? "-"}
            </Text>
          </View>
          <View style={[styles.levelCard, { flex: 1 }]}>
            <Text style={styles.levelLabel}>위험 수준</Text>
            <Text style={styles.levelValue}>{result?.riskLevel ?? "-"}</Text>
          </View>
        </View>

        {/* 페르소나 설명 */}
        {result?.personaDescription ? (
          <View style={styles.descSection}>
            <Text style={styles.sectionTitle}>페르소나 설명</Text>
            <Text style={styles.descText}>{result.personaDescription}</Text>
          </View>
        ) : null}

        {/* 추천 전략 */}
        {result?.recommendedStrategy ? (
          <View style={styles.descSection}>
            <Text style={styles.sectionTitle}>추천 전략</Text>
            <Text style={styles.descText}>{result.recommendedStrategy}</Text>
          </View>
        ) : null}

        {/* 주의사항 */}
        {result?.warningMessage ? (
          <View style={styles.warningSection}>
            <Text style={styles.warningTitle}>주의사항</Text>
            <Text style={styles.warningText}>{result.warningMessage}</Text>
          </View>
        ) : null}

        {/* 지식 점수 */}
        {knowledgeScoreEntries.length > 0 ? (
          <View style={styles.descSection}>
            <Text style={styles.sectionTitle}>지식 점수</Text>
            {knowledgeScoreEntries.map(([key, value]) => (
              <View key={key} style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>{key}</Text>
                <Text style={styles.scoreValue}>{value}점</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* 위험 점수 */}
        {riskScoreEntries.length > 0 ? (
          <View style={styles.descSection}>
            <Text style={styles.sectionTitle}>위험 점수</Text>
            {riskScoreEntries.map(([key, value]) => (
              <View key={key} style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>{key}</Text>
                <Text style={styles.scoreValue}>{value}점</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* 시작하기 버튼 */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.replace("/(tabs)/home")}
        >
          <Text style={styles.startButtonText}>시작하기</Text>
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
  inner: {
    flexGrow: 1,
    paddingHorizontal: spacing.contentArea,
    paddingBottom: spacing.xl,
  },
  backButton: {
    paddingTop: 72,
    paddingBottom: spacing.md,
    alignSelf: "flex-start",
  },
  greetingSection: {
    gap: 4,
    marginTop: spacing.sm,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.gray700,
  },
  greetingNickname: {
    fontSize: 22,
    fontWeight: "700",
  },
  nicknameHighlight: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary600,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.gray700,
  },
  imagePlaceholder: {
    width: "100%",
    height: 322,
    backgroundColor: "#D9D9D9",
    marginTop: spacing.lg,
    alignSelf: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gray700,
    marginTop: spacing.md,
  },
  chipRow: {
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.xs,
    flexWrap: "wrap",
  },
  chip: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary600,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.primary600,
  },
  infoCard: {
    backgroundColor: colors.gray100,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  personaHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    flexWrap: "wrap",
  },
  personaCodeBadge: {
    backgroundColor: colors.primary600,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  personaCodeText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.white,
  },
  englishName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.gray700,
  },
  axisSummary: {
    fontSize: 13,
    color: colors.gray600,
    lineHeight: 20,
    marginTop: 4,
  },
  levelRow: {
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  levelCard: {
    backgroundColor: colors.primary50,
    borderRadius: 10,
    padding: spacing.md,
    alignItems: "center",
    gap: 4,
  },
  levelLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.primary600,
  },
  levelValue: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary800,
  },
  descSection: {
    marginTop: spacing.md,
  },
  descText: {
    fontSize: 14,
    color: colors.gray600,
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  warningSection: {
    backgroundColor: "#FFF7ED",
    borderRadius: 10,
    padding: spacing.md,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#C2410C",
  },
  warningText: {
    fontSize: 14,
    color: "#9A3412",
    lineHeight: 22,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  scoreLabel: {
    fontSize: 14,
    color: colors.gray600,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray800,
  },
  startButton: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary600,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xl,
    alignSelf: "center",
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
});
