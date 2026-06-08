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
  GREEN: {
    color: colors.trafficGreen,
    description: "투자 안전도가 높은 수준 입니다.",
    activeIndex: 2,
  },
  YELLOW: {
    color: colors.trafficYellow,
    description: "투자 안전도가 보통 수준 입니다.",
    activeIndex: 1,
  },
  RED: {
    color: colors.trafficRed,
    description: "투자 안전도가 낮은 수준 입니다.",
    activeIndex: 0,
  },
} as const;

const GRADE_LABEL = {
  GREEN: "양호",
  YELLOW: "보통",
  RED: "위험",
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
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const isUnrated = keyIndicator.grade === null;
  const config = isUnrated ? null : GRADE_CONFIG[keyIndicator.grade];

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
                      !isUnrated && index === config!.activeIndex
                        ? color
                        : colors.gray200,
                  },
                ]}
              />
            ))}
          </View>

          {/* 등급 / 점수 / 설명 */}
          <View style={styles.textArea}>
            {isUnrated ? (
              <>
                <Text style={[styles.grade, { color: colors.gray400 }]}>
                  미산정
                </Text>
                <Text style={styles.score}>--점</Text>
                <Text style={styles.description}>
                  수요예측 전인 공모주는 지표 계산이 불가능 합니다.
                </Text>
              </>
            ) : (
              <>
                <Text style={[styles.grade, { color: config!.color }]}>
                  {GRADE_LABEL[keyIndicator.grade]}
                </Text>
                <Text style={styles.score}>{keyIndicator.score}점</Text>
                <Text style={styles.description}>{config!.description}</Text>
              </>
            )}
          </View>
        </View>
      </View>

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
    gap: spacing.xs,
  },
  trafficLight: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
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
    gap: spacing.xs,
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
