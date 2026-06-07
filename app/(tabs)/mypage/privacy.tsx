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

type PrivacySection = {
  title: string;
  paragraphs: string[];
  bulletPoints?: string[];
};

const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    title: "제1조 수집하는 개인정보 항목",
    paragraphs: ["서비스 이용을 위해 아래 정보를 수집합니다."],
    bulletPoints: [
      "필수 : 이메일 주소, 비밀번호(암호화 저장)",
      "서비스 이용 중 자동 수집 : 앱 이용 기록, 투자 성향 테스트 결과, 관심 종목 목록",
    ],
  },
  {
    title: "제2조 개인정보의 수집 및 이용 목적",
    paragraphs: ["수집된 개인정보는 아래 목적으로만 사용됩니다."],
    bulletPoints: [
      "회원 식별 및 서비스 제공",
      "투자 성향 분석 결과 저장 및 제공",
      "관심 종목 데이터 저장 및 동기화",
      "서비스 개선을 위한 이용 통계 분석",
    ],
  },
  {
    title: "제3조 개인정보의 보유 및 이용 기간",
    paragraphs: [
      "① 회원 탈퇴 시 개인정보는 즉시 삭제됩니다.",
      "② 단, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관할 수 있습니다.",
    ],
  },
  {
    title: "제4조 개인정보의 제3자 제공",
    paragraphs: [
      "팀은 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 단, 이용자의 사전 동의가 있거나 법령에 의한 경우는 예외로 합니다.",
    ],
  },
  {
    title: "제5조 개인정보의 안전성 확보",
    paragraphs: [
      "① 비밀번호는 암호화하여 저장하며, 팀도 확인할 수 없습니다.",
      "② 인증 토큰(JWT)은 기기 내 안전한 저장소에 보관됩니다.",
    ],
  },
  {
    title: "제6조 이용자의 권리",
    paragraphs: [
      "이용자는 언제든지 자신의 개인정보를 조회·수정하거나 회원 탈퇴를 통해 삭제를 요청할 수 있습니다.",
    ],
  },
  {
    title: "제7조 개인정보 처리방침의 변경",
    paragraphs: [
      "본 방침이 변경되는 경우 앱 내 공지를 통해 사전에 안내합니다.",
    ],
  },
];

const EFFECTIVE_DATE = "시행일 : 2026년 6월 17일";

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.gray800} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>개인정보 처리방침</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {PRIVACY_SECTIONS.map((section) => (
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
