import { colors, spacing, typography } from "@/styles";
import { StyleSheet, Text, View, type ViewProps } from "react-native";
import { type KeyIndicator } from "./types";

type Props = ViewProps & {
  /** 핵심 지표 신호등 데이터 */
  keyIndicator: KeyIndicator;
};

export default function KeyIndicatorSection({
  keyIndicator,
  style,
  ...props
}: Props) {
  return (
    <View style={[styles.container, style]} {...props}>
      {/* TODO: 디자인 나오면 구현 */}
      <Text style={styles.placeholder}>핵심 지표 신호등 (준비 중)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.contentArea,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  placeholder: {
    ...typography.bodyRegular11,
    color: colors.gray400,
  },
});
