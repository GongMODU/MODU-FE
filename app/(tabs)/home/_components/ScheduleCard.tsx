import { colors, spacing, typography } from "@/styles";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// TODO: API 연동 시 @/types/schedule 로 분리
export type ScheduleCardData = {
  id: string;
  dday: number; // D-11
  companyName: string; // 종목명
  startDate: string; // "04/14(화)"
  priceRange: string; // "2,000~2,000원"
  broker: string; // "신한투자증권"
};

type Props = {
  data: ScheduleCardData;
  onPress?: () => void;
};

export default function ScheduleCard({ data, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        {/* D-day 뱃지 */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>D-{data.dday}</Text>
        </View>

        {/* 종목명 */}
        <Text style={styles.companyName} numberOfLines={1}>
          {data.companyName}
        </Text>

        {/* 정보 rows */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>청약시작일</Text>
            <Text style={styles.infoValue}>{data.startDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>공모예정가</Text>
            <Text style={styles.infoValue}>{data.priceRange}</Text>
          </View>
        </View>

        {/* 증권사 태그 */}
        <View style={styles.brokerTag}>
          <Text style={styles.brokerText}>{data.broker}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 236,
    height: 153,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    padding: spacing.md,
    gap: spacing.xs,
    justifyContent: "space-between",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "transparent",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary600,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    ...typography.labelMedium10,
    color: colors.primary600,
  },
  companyName: {
    ...typography.subtitleMedium14,
    color: colors.gray800,
  },
  infoSection: {
    gap: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    ...typography.bodyRegular11,
    color: colors.gray700,
  },
  infoValue: {
    ...typography.bodyMedium11,
    color: colors.gray700,
  },
  brokerTag: {
    alignSelf: "flex-start",
    backgroundColor: colors.gray100,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  brokerText: {
    ...typography.captionMedium9,
    color: colors.gray600,
  },
});
