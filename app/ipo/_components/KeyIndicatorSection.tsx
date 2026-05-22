import { colors, spacing, typography } from "@/styles";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from "react-native";
import KeyIndicatorBottomSheet from "./KeyIndicatorBottomSheet";
import { type KeyIndicator } from "./types";

type Props = ViewProps & {
  /** 핵심 지표 신호등 데이터 */
  keyIndicator: KeyIndicator;
};

const GRADE_CONFIG = {
  양호: {
    color: colors.trafficGreen,
    description: "투자 안전도가 높은 수준 입니다.",
    activeIndex: 2,
  },
  보통: {
    color: colors.trafficYellow,
    description: "투자 안전도가 보통 수준 입니다.",
    activeIndex: 1,
  },
  위험: {
    color: colors.trafficRed,
    description: "투자 안전도가 낮은 수준 입니다.",
    activeIndex: 0,
  },
} as const;

const TRAFFIC_COLORS = [
  colors.trafficRed,
  colors.trafficYellow,
  colors.trafficGreen,
] as const;

export default function KeyIndicatorSection({
  keyIndicator,
  style,
  ...props
}: Props) {
  const config = GRADE_CONFIG[keyIndicator.grade];
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  return (
    <>
      <View style={[styles.container, style]} {...props}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>핵심 지표 신호등</Text>
          <Pressable
            onPress={() => setIsBottomSheetVisible(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.infoIcon}>ⓘ</Text>
          </Pressable>
        </View>

        {/* 신호등 + 텍스트 */}
        <View style={styles.content}>
          {/* 신호등 원 3개 */}
          <View style={styles.trafficLight}>
            {TRAFFIC_COLORS.map((color, index) => (
              <View
                key={index}
                style={[
                  styles.circle,
                  {
                    backgroundColor:
                      index === config.activeIndex ? color : colors.gray200,
                  },
                ]}
              />
            ))}
          </View>

          {/* 등급 / 점수 / 설명 */}
          <View style={styles.textArea}>
            <Text style={[styles.grade, { color: config.color }]}>
              {keyIndicator.grade}
            </Text>
            <Text style={styles.score}>{keyIndicator.score}점</Text>
            <Text style={styles.description}>{config.description}</Text>
          </View>
        </View>
      </View>

      {/* 바텀시트 */}
      {isBottomSheetVisible && (
        <KeyIndicatorBottomSheet
          onClose={() => setIsBottomSheetVisible(false)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.contentArea,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    ...typography.subtitleMedium14,
    color: colors.gray800,
  },
  infoIcon: {
    fontSize: 14,
    color: colors.gray400,
  },
  content: {
    gap: 8,
  },
  trafficLight: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.gray50,
    borderRadius: 10,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  textArea: {
    alignItems: "center",
    gap: 8,
  },
  grade: {
    ...typography.footerBold12,
  },
  score: {
    ...typography.captionRegular9,
    color: colors.gray400,
  },
  description: {
    ...typography.bodyMedium11,
    color: colors.gray500,
  },
});
