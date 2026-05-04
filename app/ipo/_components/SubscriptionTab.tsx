import { colors, typography } from "@/styles";
import { StyleSheet, Text, View, type ViewProps } from "react-native";
import { type SubscriptionInfo } from "./types";

type Props = ViewProps & {
  /** 청약 탭 데이터 */
  data: SubscriptionInfo;
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

// ─── 청약 탭 ──────────────────────────────────────────────────
export default function SubscriptionTab({ data, style, ...props }: Props) {
  return (
    <View style={[styles.container, style]} {...props}>
      <View style={styles.grid}>
        <InfoCell label="청약일" value={data.subscriptionDate} />
        <InfoCell label="상장일" value={data.listingDate} />
        <InfoCell label="경쟁률" value={data.competitionRate} />
        <InfoCell label="비례경쟁률" value={data.proportionalRate} />
        <InfoCell label="균등배정" value={data.equalAllocation} />
        <InfoCell label="일반배정" value={data.generalAllocation} />
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
  cellLabel: {
    ...typography.bodyRegular10,
    color: colors.gray500,
  },
  cellValue: {
    ...typography.labelMedium10,
    color: colors.gray600,
  },
});
