import { colors, spacing, typography } from "@/styles";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function InvestmentCard() {
  const router = useRouter();

  return (
    <View style={styles.investmentCard}>
      <View style={styles.chartPlaceholder} />

      <TouchableOpacity
        style={styles.retestButton}
        onPress={() => router.push("/(tabs)/mypage/investment-retest")}
      >
        <Text style={styles.retestButtonText}>다시 검사하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  investmentCard: {
    padding: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    marginBottom: 20,
  },
  chartPlaceholder: {
    width: "100%",
    height: 260,
    backgroundColor: colors.gray200,
    borderRadius: 4,
    marginBottom: 7,
  },
  retestButton: {
    alignSelf: "stretch",
    paddingVertical: 12,
    paddingHorizontal: spacing.xs,
    marginTop: 12,
    marginBottom: spacing.xs,
  },
  retestButtonText: {
    ...typography.labelMedium10,
    color: colors.gray500,
    textAlign: "center",
  },
});
