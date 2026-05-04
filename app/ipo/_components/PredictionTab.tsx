import { colors, typography } from "@/styles";
import { StyleSheet, Text, View, type ViewProps } from "react-native";
import { type PredictionInfo } from "./types";

type Props = ViewProps & {
  /** 예측 탭 데이터 */
  data: PredictionInfo;
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

// ─── 예측 탭 ──────────────────────────────────────────────────
export default function PredictionTab({ data, style, ...props }: Props) {
  return (
    <View style={[styles.container, style]} {...props}>
      <View style={styles.grid}>
        {/* 확정공모가 - 2열 전체 너비 */}
        <View style={styles.cellFull}>
          <Text style={styles.cellLabel}>확정공모가</Text>
          <Text style={styles.offeringPrice}>
            {data.offeringPrice.toLocaleString()}원
          </Text>
        </View>

        <InfoCell label="수요예측일" value={data.demandForecastDate} />
        <InfoCell label="희망공모가" value={data.expectedOfferingPrice} />
        <InfoCell label="의무보유" value={data.lockupPeriod} />
        <InfoCell label="기관경쟁률" value={data.institutionalRate} />
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
  cellFull: {
    width: "100%",
    padding: 12,
    gap: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray50,
    backgroundColor: colors.white,
    alignItems: "center",
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
  cellLabel: {
    ...typography.bodyRegular10,
    color: colors.gray500,
  },
  cellValue: {
    ...typography.labelMedium10,
    color: colors.gray600,
  },
  offeringPrice: {
    ...typography.subtitleMedium14,
    color: colors.gray800,
  },
});
