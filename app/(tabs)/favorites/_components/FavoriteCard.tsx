import { colors, spacing, typography } from "@/styles";
import { type FavoriteItem } from "@/types/ipo";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// ─── 날짜 포맷 변환 ───────────────────────────────────────────
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dayName = days[date.getDay()];
  return `${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}(${dayName})`;
}

// ─── 공모가 포맷 변환 ─────────────────────────────────────────
function formatOfferPrice(item: FavoriteItem): string {
  if (item.offerPrice !== null) {
    return `${item.offerPrice.toLocaleString()}원`;
  }
  return `${item.offerPriceMin.toLocaleString()}~${item.offerPriceMax.toLocaleString()}원`;
}

// ─── 증권사 태그 ──────────────────────────────────────────────
const MAX_VISIBLE_BROKERS = 2;

function BrokerTags({ brokerNames }: { brokerNames: string[] }) {
  const visible = brokerNames.slice(0, MAX_VISIBLE_BROKERS);
  const remaining = brokerNames.length - MAX_VISIBLE_BROKERS;

  return (
    <View style={styles.brokerRow}>
      {visible.map((broker, index) => (
        <View key={index} style={styles.brokerTag}>
          <Text style={styles.brokerTagText}>{broker}</Text>
        </View>
      ))}
      {remaining > 0 && (
        <>
          <View style={styles.brokerTag}>
            <Text style={styles.brokerTagText}>...</Text>
          </View>
          <Text style={styles.brokerMore}>+{remaining}</Text>
        </>
      )}
    </View>
  );
}

// ─── 카드 ─────────────────────────────────────────────────────
type Props = {
  /** 관심 공모주 아이템 */
  item: FavoriteItem;
};

export default function FavoriteCard({ item }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push(`/ipo/${item.ipoEventId}`)}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.companyName}</Text>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>청약시작일</Text>
            <Text style={styles.infoValue}>
              {formatDate(item.subscriptionStartDate)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>공모예정가</Text>
            <Text style={styles.infoValue}>{formatOfferPrice(item)}</Text>
          </View>
        </View>

        <BrokerTags brokerNames={item.brokerNames} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: 10,
    backgroundColor: colors.white,
    gap: 12,
  },
  cardTitle: {
    ...typography.bodyMedium11,
    color: colors.gray800,
  },
  infoSection: {
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    ...typography.bodyRegular10,
    color: colors.gray700,
  },
  infoValue: {
    ...typography.bodyRegular10,
    color: colors.gray700,
    textAlign: "right",
  },
  brokerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brokerTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: colors.primary50,
  },
  brokerTagText: {
    ...typography.labelMedium10,
    color: colors.gray600,
  },
  brokerMore: {
    ...typography.labelMedium10,
    color: colors.gray600,
  },
});
