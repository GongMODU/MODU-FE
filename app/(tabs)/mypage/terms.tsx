import { colors, spacing, typography } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TermsSection = {
  title: string;
  paragraphs: string[];
  bulletPoints?: string[];
};

const TERMS_SECTIONS: TermsSection[] = [
  {
    title: "제1조 목적",
    paragraphs: [
      "본 약관은 공쫀쿠(이하 팀)가 제공하는 MODU 서비스(이하 서비스)의 이용 조건 및 절차, 팀과 이용자 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.",
    ],
  },
  {
    title: "제2조 서비스의 내용",
    paragraphs: ["서비스는 다음의 기능을 제공합니다."],
    bulletPoints: [
      "IPO 기업 정보 및 공모 일정 조회",
      "AI 기반 YouTube 영상 요약 제공",
      "투자 성향 테스트",
      "관심 종목(찜) 등록 및 관리",
    ],
  },
  {
    title: "제3조 서비스 이용",
    paragraphs: [
      "① 서비스는 회원 가입 후 이용할 수 있습니다.",
      "② 이용자는 타인의 정보를 도용하거나 서비스를 비정상적인 방법으로 이용해서는 안 됩니다.",
      "③ 팀은 서비스 운영상 필요한 경우 사전 공지 없이 서비스 내용을 변경하거나 일시 중단할 수 있습니다.",
    ],
  },
  {
    title: "제4조 정보 제공 및 투자 책임",
    paragraphs: [
      "① 서비스에서 제공하는 모든 정보(재무 데이터, AI 요약, 투자 성향 결과 등)는 참고용이며, 투자를 권유하거나 특정 종목을 추천하지 않습니다.",
      "② 서비스 내 정보를 바탕으로 한 투자 결정 및 그 결과에 대한 책임은 전적으로 이용자 본인에게 있습니다.",
      "③ 팀은 서비스 정보의 정확성·완전성·최신성을 보장하지 않습니다.",
    ],
  },
  {
    title: "제5조 AI 생성 콘텐츠",
    paragraphs: [
      "① AI가 생성한 요약 정보는 자동화된 분석 결과로, 오류·누락·편향이 포함될 수 있습니다.",
      "② 이용자는 AI 생성 콘텐츠를 최종 투자 판단의 근거로 사용해서는 안 됩니다.",
    ],
  },
  {
    title: "제6조 계정 관리",
    paragraphs: [
      "① 이용자는 자신의 계정 정보를 안전하게 관리할 책임이 있습니다.",
      "② 계정의 무단 사용이 발견된 경우 즉시 비밀번호를 변경하고 팀에 알려야 합니다.",
    ],
  },
  {
    title: "제7조 서비스 중단 및 종료",
    paragraphs: [
      "팀은 서비스를 사전 공지 후 종료할 수 있으며, 불가피한 사정이 있는 경우 공지 없이 종료될 수 있습니다.",
    ],
  },
  {
    title: "제8조 약관의 변경",
    paragraphs: [
      "팀은 필요한 경우 약관을 변경할 수 있으며, 변경 시 앱 내 공지를 통해 안내합니다.",
    ],
  },
];

const EFFECTIVE_DATE = "시행일 : 2026년 6월 17일";

export default function TermsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.gray800} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>서비스 이용약관</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {TERMS_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionBody}>
              {section.paragraphs.map((paragraph, index) => (
                <Text key={index} style={styles.bodyText}>
                  {paragraph}
                </Text>
              ))}
              {section.bulletPoints?.map((point, index) => (
                <Text key={index} style={styles.bulletText}>
                  {"• " + point}
                </Text>
              ))}
            </View>
          </View>
        ))}
        <Text style={styles.effectiveDate}>{EFFECTIVE_DATE}</Text>
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
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.footerBold12,
    color: colors.gray700,
  },
  sectionBody: {
    gap: spacing.xs,
  },
  bodyText: {
    ...typography.bodyRegular11,
    color: colors.gray600,
    lineHeight: 19.25,
  },
  bulletText: {
    ...typography.bodyRegular11,
    color: colors.gray600,
    lineHeight: 19.25,
  },
  effectiveDate: {
    ...typography.captionRegular9,
    color: colors.gray500,
  },
});
