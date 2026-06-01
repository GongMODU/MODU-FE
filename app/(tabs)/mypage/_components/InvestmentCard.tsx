import { getPersonaMypageImage } from "@/lib/personaImage";
import { colors, spacing, typography } from "@/styles";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type InvestmentCardProps = {
  personaCode: string;
};

export default function InvestmentCard({ personaCode }: InvestmentCardProps) {
  const router = useRouter();
  const personaImage = getPersonaMypageImage(personaCode);

  return (
    <View style={styles.investmentCard}>
      {personaImage != null ? (
        <Image
          source={personaImage}
          style={styles.personaImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.personaImage} />
      )}

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
  personaImage: {
    width: "100%",
    height: 260,
    borderRadius: 8,
    backgroundColor: colors.gray200,
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
