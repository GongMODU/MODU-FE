import { colors, spacing, typography } from "@/styles";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileCard() {
  return (
    <View style={styles.profileCard}>
      <View style={styles.avatar} />

      <View style={styles.profileInfo}>
        <Text style={styles.nickname}>사용자 닉네임</Text>
        <Text style={styles.bio} numberOfLines={1}>
          소셜 로그인 상태 등 추가로 표시할 내용
        </Text>
      </View>

      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.editButton}>프로필 편집</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    gap: 12,
    marginBottom: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray200,
  },
  profileInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  nickname: {
    ...typography.footerBold12,
    color: colors.gray900,
  },
  bio: {
    ...typography.captionMedium9,
    color: colors.gray500,
  },
  editButton: {
    ...typography.captionRegular9,
    color: colors.gray400,
  },
});
