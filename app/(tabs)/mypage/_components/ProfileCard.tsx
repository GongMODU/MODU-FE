import { getPersonaImage } from "@/lib/personaImage";
import { colors, spacing, typography } from "@/styles";
import { type Provider } from "@/types/mypage";
import { useRouter } from "expo-router";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewProps,
} from "react-native";

type Props = ViewProps & {
  nickname: string;
  email: string;
  provider: Provider;
  /** 페르소나 코드 (K1R1 ~ K4R4) */
  personaCode: string;
};

export default function ProfileCard({
  nickname,
  email,
  provider,
  personaCode,
  style,
  ...props
}: Props) {
  const router = useRouter();
  const image = getPersonaImage(personaCode);

  return (
    <View style={[styles.profileCard, style]} {...props}>
      {image != null ? (
        <Image source={image} style={styles.avatar} resizeMode="cover" />
      ) : (
        <View style={styles.avatar} />
      )}
      <View style={styles.profileInfo}>
        <Text style={styles.nickname}>{nickname}</Text>
        <View style={styles.bioBadge}>
          <Text style={styles.bio}>
            {provider === "LOCAL"
              ? email
              : provider === "KAKAO"
                ? "Kakao"
                : "Google"}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.editButtonWrapper}
        onPress={() => router.push("/mypage/profile-edit")}
      >
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
    gap: spacing.sm,
    marginBottom: 20,
    backgroundColor: colors.white,
  },
  editButtonWrapper: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
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
    color: colors.gray600,
  },
  bioBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.gray50,
    borderRadius: 2,
    paddingVertical: 2,
    paddingHorizontal: 4,
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
