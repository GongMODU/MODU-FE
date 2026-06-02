import { colors, spacing, typography } from "@/styles";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from "react-native";
import FinancialChart from "./FinancialChart";
import { type DisclosureReport, type ReportSection } from "./types";

type Props = ViewProps & {
  /** 공시 리포트 데이터 */
  data: DisclosureReport;
};

// ─── 대섹션 ───────────────────────────────────────────────────
function ReportSectionItem({ section }: { section: ReportSection }) {
  return (
    <View style={styles.reportSection}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      {section.summary !== undefined && (
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>{section.summary}</Text>
        </View>
      )}
      <View style={styles.itemList}>
        {section.items.map((item, index) => (
          <View key={index} style={styles.subItem}>
            <Text style={styles.subTitle}>{item.subTitle}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── 공시 리포트 요약 ──────────────────────────────────────────
export default function DisclosureReportSection({
  data,
  style,
  ...props
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={[styles.container, style]} {...props}>
      {/* 기업 요약 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>기업 요약</Text>
        <View style={styles.card}>
          <Text style={styles.companyName}>
            {data.companySummary.companyName}
          </Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>기업 유형</Text>
              <Text style={styles.infoValue}>
                {data.companySummary.companyType}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>주요 목적</Text>
              <Text style={styles.infoValue}>
                {data.companySummary.mainPurpose}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>설립일</Text>
              <Text style={styles.infoValue}>
                {data.companySummary.establishedDate}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>상장일</Text>
              <Text style={styles.infoValue}>
                {data.companySummary.listingDate}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 재무제표 요약 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>재무제표 요약</Text>
        {data.financial.kind === "spac" ? (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>
              SPAC은 일반 사업을 하지 않고 공모로 모은 자금을 예치하여 보관하는
              구조입니다. 따라서 매출이나 영업이익 같은 일반 기업의 재무지표는
              발생하지 않아요.
            </Text>
          </View>
        ) : data.financial.kind === "no-data" ? (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>
              제공된 재무 데이터가 없어 재무 상태를 파악하기 어렵습니다.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>{data.financial.summary}</Text>
            </View>
            {data.financial.chart.periods.length > 0 && (
              <View style={styles.card}>
                <FinancialChart data={data.financial.chart} />
              </View>
            )}
          </>
        )}
      </View>

      {/* 더보기 섹션들 */}
      {isExpanded &&
        data.sections.map((section, index) => (
          <ReportSectionItem key={index} section={section} />
        ))}

      {/* 더보기 버튼 */}
      {!isExpanded && (
        <Pressable
          onPress={() => setIsExpanded(true)}
          style={styles.expandButton}
        >
          <Text style={styles.expandText}>더보기</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.contentArea,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.white,
    padding: 16,
    gap: 36,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    ...typography.footerBold12,
    color: colors.gray800,
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.white,
    padding: 16,
    gap: 18,
  },
  companyName: {
    ...typography.bodyMedium11,
    color: colors.gray700,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 12,
  },
  infoItem: {
    gap: 4,
    width: "50%",
  },
  infoLabel: {
    ...typography.captionMedium9,
    color: colors.gray500,
  },
  infoValue: {
    ...typography.bodyRegular10,
    color: colors.gray400,
  },
  summaryBox: {
    borderRadius: 2,
    backgroundColor: colors.primary600,
    padding: 8,
    alignItems: "center",
  },
  summaryText: {
    ...typography.captionMedium9,
    color: colors.gray50,
    textAlign: "center",
  },
  reportSection: {
    gap: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  itemList: {
    gap: 16,
  },
  subItem: {
    gap: 8,
  },
  subTitle: {
    ...typography.bodyMedium11,
    color: colors.gray700,
  },
  body: {
    ...typography.bodyRegular10,
    color: colors.gray500,
  },
  expandButton: {
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  expandText: {
    ...typography.labelMedium10,
    color: colors.gray500,
  },
});
