import { colors, spacing, typography } from "@/styles";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  top: number;
};

export default function FavoriteInfoCard({ top }: Props) {
  return (
    <View style={[styles.card, { top }]}>
      <Text style={styles.title}>다른 관심 공모주를 찾을 수 없나요?</Text>
      <Text style={styles.body}>
        MODU에서는 최근 3개월 이내의 데이터만 제공하고 있기 때문에,{"\n"}
        기간이 지나면 관심 공모주 내역이 사라질 수 있어요.{"\n"}
        실제로 청약을 진행했다면, 청약 이력을 남겨 기록해주세요!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    width: "80%",
    right: spacing.contentArea,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: spacing.md,
    paddingRight: 32,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    ...typography.footerBold12,
    color: colors.gray700,
  },
  body: {
    ...typography.captionMedium9,
    color: colors.gray400,
    lineHeight: 11.7,
  },
});
