import { colors, typography } from "@/styles";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
    type ViewProps,
} from "react-native";

export type SegmentTab = "청약" | "예측" | "기업";

const TABS: SegmentTab[] = ["청약", "예측", "기업"];

type Props = ViewProps & {
  /** 현재 선택된 탭 */
  selectedTab: SegmentTab;
  /** 탭 변경 핸들러 */
  onTabChange: (tab: SegmentTab) => void;
};

export default function SegmentControl({
  selectedTab,
  onTabChange,
  style,
  ...props
}: Props) {
  return (
    <View style={[styles.container, style]} {...props}>
      {TABS.map((tab) => (
        <Pressable
          key={tab}
          style={[styles.tab, selectedTab === tab && styles.tabSelected]}
          onPress={() => onTabChange(tab)}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === tab && styles.tabTextSelected,
            ]}
          >
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.gray100,
    borderRadius: 12,
    padding: 4,
    gap: 6,
  },
  tab: {
    flex: 1,
    paddingVertical: 2,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  tabSelected: {
    backgroundColor: colors.white,
  },
  tabText: {
    ...typography.labelMedium10,
    color: colors.gray600,
  },
  tabTextSelected: {
    ...typography.labelMedium10,
    color: colors.gray600,
  },
});
