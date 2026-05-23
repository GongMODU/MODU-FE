import { colors, spacing, typography } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from "react-native";
import { type IPOItem } from "./types";

type Props = ViewProps & {
  /** 공모주 기본 정보 */
  item: IPOItem;
  /** 찜 버튼 핸들러 */
  onToggleFavorite: () => void;
};

export default function IPODetailHeader({
  item,
  onToggleFavorite,
  style,
  ...props
}: Props) {
  const router = useRouter();

  return (
    <View style={[styles.container, style]} {...props}>
      {/* 뒤로가기 */}
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color={colors.gray800} />
      </Pressable>

      {/* 기업명 */}
      <Text style={styles.companyName} numberOfLines={1}>
        {item.companyName}
      </Text>

      {/* 찜 버튼 */}
      <Pressable onPress={onToggleFavorite} style={styles.favoriteButton}>
        <Ionicons
          name={item.isFavorite ? "star" : "star-outline"}
          size={24}
          color={item.isFavorite ? colors.primary600 : colors.gray400}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.contentArea,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  backButton: {
    width: 40,
  },
  companyName: {
    flex: 1,
    ...typography.subtitleMedium14,
    color: colors.gray800,
    textAlign: "center",
  },
  favoriteButton: {
    width: 40,
    alignItems: "flex-end",
  },
});
