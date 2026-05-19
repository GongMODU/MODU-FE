import { colors, spacing, typography } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { mypageHomeOptions } from "../_components/queries";

type ResultParams = {
  koreanName: string;
  keywordTags: string;
};

export default function InvestmentRetestResultScreen() {
  const router = useRouter();
  const { koreanName, keywordTags: keywordTagsJson } =
    useLocalSearchParams<ResultParams>();

  const { data } = useQuery(mypageHomeOptions());
  const nickname = data?.nickname ?? "";

  const rawKeywordTags = keywordTagsJson ? JSON.parse(keywordTagsJson) : [];
  const keywordTags: string[] = Array.isArray(rawKeywordTags)
    ? rawKeywordTags.map((t: string) => (t.startsWith("#") ? t : `#${t}`))
    : [];

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.dismiss(2)}
        >
          <Ionicons name="chevron-back" size={24} color={colors.gray800} />
        </TouchableOpacity>

        {/* 인사 텍스트 */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>{koreanName}</Text>
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

        {/* 검사 완료 버튼 */}
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => router.dismiss(2)}
        >
          <Text style={styles.completeButtonText}>검사 완료</Text>
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
  completeButton: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary600,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xl,
    alignSelf: "center",
  },
  completeButtonText: {
    ...typography.footerBold12,
    color: colors.white,
  },
});
