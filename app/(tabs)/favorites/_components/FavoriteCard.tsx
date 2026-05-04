import { colors, spacing, typography } from "@/styles";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FavoriteItem } from "../index";

// ─── 증권사 태그 ──────────────────────────────────────────────
const MAX_VISIBLE_BROKERS = 2;

function BrokerTags({ brokers }: { brokers: string[] }) {
  const visible = brokers.slice(0, MAX_VISIBLE_BROKERS);
  const remaining = brokers.length - MAX_VISIBLE_BROKERS;

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
export default function FavoriteCard({ item }: { item: FavoriteItem }) {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push(`/ipo/${item.id}`)}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.name}</Text>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>청약시작일</Text>
            <Text style={styles.infoValue}>{item.subscriptionStartDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>공모예정가</Text>
            <Text style={styles.infoValue}>{item.offeringPrice}</Text>
          </View>
        </View>

        <BrokerTags brokers={item.brokers} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
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
    backgroundColor: colors.gray50,
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
