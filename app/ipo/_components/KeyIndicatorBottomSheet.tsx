import { colors, spacing, typography } from "@/styles";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    LayoutChangeEvent,
    Modal,
    PanResponder,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SNAP_HEIGHT = SCREEN_HEIGHT * 0.75;
const DRAG_THRESHOLD = 50;

const GRADE_DESCRIPTIONS = [
  { color: colors.trafficGreen, label: "안정 ≥ 70" },
  { color: colors.trafficYellow, label: "보통 40 ~ 69" },
  { color: colors.trafficRed, label: "위험 < 40" },
] as const;

const ACCORDION_ITEMS = [
  {
    title: "기관 경쟁률 40%",
    what: "기관 경쟁률은 증권사, 자산운용사 같은 전문 투자자들이 이 공모주를 얼마나 많이 신청했는지를 보여주는 숫자예요.",
    why: '전문 투자자들이 많이 신청했다는 건 그만큼 이 공모주에 관심이 크다는 뜻이에요. 그래서 기관 경쟁률이 높으면 "전문가들도 많이 관심 가진 공모주구나"라고 볼 수 있어요.',
  },
  {
    title: "의무확약 비율 30%",
    what: "의무확약비율은 기관투자자들이 받은 주식을 상장하자마자 바로 팔지 않고, 일정 기간 가지고 있겠다고 약속한 비율이에요.",
    why: '이 비율이 높으면 상장 직후에 바로 팔리는 주식이 줄어들 수 있어요. 그래서 의무확약비율이 높으면 "기관들이 당장 팔 생각보다는 조금 더 지켜보려는구나"라고 볼 수 있어요.',
  },
  {
    title: "유통가능 물량 20%",
    what: "유통가능물량은 상장한 뒤에 바로 시장에서 사고팔 수 있는 주식의 양이에요.",
    why: '상장 직후에 팔 수 있는 주식이 많으면, 사람들이 한꺼번에 팔면서 주가가 흔들릴 수 있어요. 그래서 유통가능물량은 "상장일에 팔릴 수 있는 주식이 얼마나 많은지"를 보는 지표예요. 보통은 너무 많지 않은 편이 부담이 적어요.',
  },
  {
    title: "일반청약 경쟁률 10%",
    what: "일반청약 경쟁률은 개인 투자자들이 이 공모주 청약에 얼마나 많이 몰렸는지를 보여주는 숫자예요.",
    why: '경쟁률이 높으면 개인 투자자들의 관심이 크다는 뜻이에요. 다만 인기 때문에 몰리는 경우도 있어서, 이것만 보고 판단하기보다는 다른 지표와 함께 보는 게 좋아요. 즉, 일반청약 경쟁률은 "개인 투자자들 사이에서 얼마나 인기 있는 공모주인지"를 보여주는 지표예요.',
  },
] as const;

type AccordionItemProps = {
  title: string;
  what: string;
  why: string;
};

function AccordionItem({ title, what, why }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.accordionItem}>
      <Pressable
        style={styles.accordionHeader}
        onPress={() => setIsOpen((prev) => !prev)}
      >
        <Text style={styles.accordionTitle}>{title}</Text>
        <Text style={styles.accordionChevron}>{isOpen ? "∧" : "∨"}</Text>
      </Pressable>
      {isOpen && (
        <View style={styles.accordionContent}>
          <Text style={styles.accordionWhat}>{what}</Text>
          <Text style={styles.accordionWhy}>{why}</Text>
        </View>
      )}
    </View>
  );
}

type Props = {
  /** 닫기 핸들러 */
  onClose: () => void;
};

export default function KeyIndicatorBottomSheet({ onClose }: Props) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const insets = useSafeAreaInsets();
  const [fixedHeaderHeight, setFixedHeaderHeight] = useState(0);

  const animateTo = useCallback(
    (toValue: number) => {
      Animated.spring(translateY, {
        toValue,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    },
    [translateY],
  );

  useEffect(() => {
    animateTo(SCREEN_HEIGHT - SNAP_HEIGHT);
  }, [animateTo]);

  const handleClose = useCallback(() => {
    animateTo(SCREEN_HEIGHT);
    setTimeout(onClose, 300);
  }, [animateTo, onClose]);

  const handleFixedHeaderLayout = useCallback((e: LayoutChangeEvent) => {
    const height = e.nativeEvent.layout.height;
    if (height > 0) {
      setFixedHeaderHeight(height);
    }
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 5,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > DRAG_THRESHOLD) {
          handleClose();
        } else {
          animateTo(SCREEN_HEIGHT - SNAP_HEIGHT);
        }
      },
    }),
  ).current;

  const scrollContainerHeight =
    fixedHeaderHeight > 0
      ? SNAP_HEIGHT * 0.75 - fixedHeaderHeight - insets.bottom
      : 0;

  return (
    <Modal
      visible
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={StyleSheet.absoluteFill}>
        {/* 딤 배경 */}
        <Pressable style={styles.dim} onPress={handleClose} />

        {/* 바텀시트 래퍼 — 애니메이션 + 그림자 */}
        <Animated.View
          style={[styles.sheetWrapper, { transform: [{ translateY }] }]}
        >
          {/* 실제 컨테이너 */}
          <View style={styles.sheet}>
            {/* 고정 상단 영역 */}
            <View onLayout={handleFixedHeaderLayout}>
              {/* 핸들 + 드래그 영역 */}
              <View style={styles.handleArea} {...panResponder.panHandlers}>
                <View style={styles.handle} />
              </View>

              {/* 헤더 */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>
                  핵심 지표 신호등은 이렇게 계산 돼요.
                </Text>
                <Pressable
                  onPress={handleClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.closeText}>×</Text>
                </Pressable>
              </View>

              {/* 등급 설명 */}
              <View style={styles.gradeList}>
                {GRADE_DESCRIPTIONS.map((item) => (
                  <View key={item.label} style={styles.gradeItem}>
                    <View
                      style={[styles.gradeDot, { backgroundColor: item.color }]}
                    />
                    <Text style={styles.gradeLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 아코디언 목록 */}
            <View style={{ height: scrollContainerHeight }}>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
              >
                {ACCORDION_ITEMS.map((item) => (
                  <AccordionItem key={item.title} {...item} />
                ))}
              </ScrollView>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `${colors.gray500}1A`,
  },
  sheetWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: SNAP_HEIGHT,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: "column",
  },
  handleArea: {
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  handle: {
    width: 62,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray400,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
  },
  headerTitle: {
    ...typography.footerBold12,
    color: colors.gray700,
    flex: 1,
    marginRight: spacing.sm,
  },
  closeText: {
    fontSize: 16,
    color: colors.gray400,
  },
  gradeList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  gradeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  gradeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  gradeLabel: {
    ...typography.bodyRegular10,
    color: colors.gray500,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  accordionItem: {
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  accordionTitle: {
    ...typography.labelMedium10,
    color: colors.gray600,
  },
  accordionChevron: {
    fontSize: 10,
    color: colors.gray600,
  },
  accordionContent: {
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  accordionWhat: {
    ...typography.captionMedium9,
    color: colors.gray400,
    lineHeight: 14,
  },
  accordionWhy: {
    ...typography.captionMedium9,
    color: colors.gray500,
    lineHeight: 14,
  },
});
