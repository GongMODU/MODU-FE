import { investmentResultStore } from "@/lib/investmentResultStore";
import { tokenStore } from "@/lib/tokenStore";
import { colors, spacing, typography } from "@/styles";
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
        <Text style={styles.keywordTitle}>투자 성향 키워드</Text>
        <View style={styles.chipRow}>
          {keywordTags.map((tag) => (
            <View key={tag} style={styles.chip}>
              <Text style={styles.chipText}>{tag}</Text>
            </View>
          ))}
        </View>

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
    ...typography.largeTitleMedium20,
    color: colors.gray700,
  },
  greetingNickname: {
    ...typography.largeTitleMedium20,
  },
  nicknameHighlight: {
    ...typography.largeTitleMedium20,
    color: colors.primary600,
  },
  greetingText: {
    ...typography.largeTitleMedium20,
    color: colors.gray700,
  },
  imagePlaceholder: {
    width: "100%",
    height: 322,
    backgroundColor: "#D9D9D9",
    marginTop: spacing.lg,
    alignSelf: "center",
  },
  keywordTitle: {
    ...typography.subtitleMedium14,
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
    ...typography.labelMedium10,
    color: colors.primary600,
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
    ...typography.footerBold12,
    color: colors.white,
  },
});
