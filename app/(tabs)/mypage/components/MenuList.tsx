import { colors, spacing, typography } from "@/styles";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MENU_ITEMS = [
  { label: "도움말 및 FAQ" },
  { label: "서비스 이용약관" },
  { label: "개인정보 처리방침" },
  { label: "로그아웃" },
];

export function MenuList() {
  return (
    <View style={styles.menuList}>
      {MENU_ITEMS.map((item, index) => (
        <TouchableOpacity
          key={item.label}
          style={[
            styles.menuItem,
            index === MENU_ITEMS.length - 1 && styles.menuItemLast,
          ]}
          onPress={() => {}}
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
