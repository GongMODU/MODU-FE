import { colors, typography } from "@/styles";
import { StyleSheet, Text, View, type ViewProps } from "react-native";
import { type CompanyTabInfo } from "./types";

type Props = ViewProps & {
  /** 기업 탭 데이터 */
  data: CompanyTabInfo;
};

// ─── 정보 셀 ──────────────────────────────────────────────────
function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.cell}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={styles.cellValue}>{value}</Text>
    </View>
  );
}

// ─── 기업 탭 ──────────────────────────────────────────────────
export default function CompanyTab({ data, style, ...props }: Props) {
  return (
    <View style={[styles.container, style]} {...props}>
      <View style={styles.grid}>
        <InfoCell label="매출액" value={data.revenue} />
        <InfoCell label="순이익" value={data.netIncome} />
        <InfoCell label="공모주식수" value={data.offeringShares} />
        <InfoCell label="상장주식수" value={data.listedShares} />
        <InfoCell label="보호예수" value={data.lockupShares[0]} />
        <InfoCell label="보호예수" value={data.lockupShares[1]} />

        {/* 청약 증권사 - 2열 전체 너비 */}
        <View style={styles.cellFull}>
          <Text style={styles.cellLabel}>청약 증권사</Text>
          <View style={styles.brokerRow}>
            {data.brokers.map((broker, index) => (
              <View key={index} style={styles.brokerTag}>
                <Text style={styles.brokerText}>{broker}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.white,
    padding: 16,
    gap: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cell: {
    width: "48%",
    padding: 12,
    gap: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray50,
    backgroundColor: colors.white,
  },
  cellFull: {
    width: "100%",
    padding: 12,
    gap: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray50,
    backgroundColor: colors.white,
  },
  cellLabel: {
    ...typography.bodyRegular10,
    color: colors.gray500,
  },
  cellValue: {
    ...typography.labelMedium10,
    color: colors.gray600,
  },
  brokerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  brokerTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: colors.gray50,
  },
  brokerText: {
    ...typography.labelMedium10,
    color: colors.gray600,
  },
});
