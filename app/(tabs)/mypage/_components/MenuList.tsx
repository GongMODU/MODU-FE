import { logout } from "@/lib/api/mypage";
import queryClient from "@/lib/queryClient";
import { tokenStore } from "@/lib/tokenStore";
import { colors, spacing, typography } from "@/styles";
import { router } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MENU_ITEMS = [
  { label: "도움말 및 FAQ", href: "/mypage/faq" as const },
  { label: "서비스 이용약관", href: "/mypage/terms" as const },
  { label: "개인정보 처리방침", href: "/mypage/privacy" as const },
  { label: "로그아웃", href: null },
] satisfies { label: string; href: string | null }[];

export default function MenuList() {
  const handleLogout = async () => {
    Alert.alert("로그아웃", "로그아웃 하시겠어요?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch {
            // 서버 오류여도 로컬 상태는 정리하고 로그인 화면으로 이동
          } finally {
            tokenStore.clear();
            queryClient.clear();
            router.replace("/onboarding");
          }
        },
      },
    ]);
  };

  const handlePress = (item: (typeof MENU_ITEMS)[number]) => {
    if (item.href) {
      router.push(item.href);
    } else {
      handleLogout();
    }
  };

  return (
    <View style={styles.menuList}>
      {MENU_ITEMS.map((item, index) => (
        <TouchableOpacity
          key={item.label}
          style={[
            styles.menuItem,
            index === MENU_ITEMS.length - 1 && styles.menuItemLast,
          ]}
          onPress={() => handlePress(item)}
        >
          <Text style={styles.menuItemText}>{item.label}</Text>
          <Text style={styles.menuItemChevron}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  menuList: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.white,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    ...typography.bodyMedium11,
    color: colors.gray400,
  },
  menuItemChevron: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.gray400,
  },
});
