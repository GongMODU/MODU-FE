import { colors, spacing, typography } from "@/styles";
import { useCallback, useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Linking,
    PanResponder,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { YoutubeCardData } from "./types";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

/** 1단계 스냅 포인트 - 버튼 누를 때 올라오는 높이 */
const SNAP_PARTIAL = 455;
/** 2단계 스냅 포인트 - 끌어올렸을 때 최대 높이 */
const SNAP_FULL = SCREEN_HEIGHT * 0.9;
/** 드래그 방향 판단 임계값 */
const DRAG_THRESHOLD = 50;

type YoutubeBottomSheetProps = {
  /** 표시할 카드 데이터 */
  data: YoutubeCardData;
  /** 닫기 핸들러 */
  onClose: () => void;
};

export default function YoutubeBottomSheet({
  data,
  onClose,
}: YoutubeBottomSheetProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const currentSnap = useRef<"partial" | "full">("partial");

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

  // 마운트 시 1단계로 올라옴
  useEffect(() => {
    animateTo(SCREEN_HEIGHT - SNAP_PARTIAL);
  }, [animateTo]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 5,
      onPanResponderRelease: (_, gestureState) => {
        const { dy } = gestureState;

        if (currentSnap.current === "partial") {
          if (dy < -DRAG_THRESHOLD) {
            // 위로 드래그 → 2단계
            currentSnap.current = "full";
            animateTo(SCREEN_HEIGHT - SNAP_FULL);
          } else if (dy > DRAG_THRESHOLD) {
            // 아래로 드래그 → 닫기
            animateTo(SCREEN_HEIGHT);
            setTimeout(onClose, 300);
          } else {
            animateTo(SCREEN_HEIGHT - SNAP_PARTIAL);
          }
        } else {
          if (dy > DRAG_THRESHOLD) {
            // 위에서 아래로 드래그 → 1단계로
            currentSnap.current = "partial";
            animateTo(SCREEN_HEIGHT - SNAP_PARTIAL);
          } else {
            animateTo(SCREEN_HEIGHT - SNAP_FULL);
          }
        }
      },
    }),
  ).current;

  const handlePressUrl = useCallback(() => {
    Linking.openURL(data.videoUrl);
  }, [data.videoUrl]);

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* 딤 배경 */}
      <Pressable
        style={styles.dim}
        onPress={() => {
          animateTo(SCREEN_HEIGHT);
          setTimeout(onClose, 300);
        }}
      />

      {/* 바텀 시트 */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        {/* 핸들 영역 - 드래그 가능 */}
        <View style={styles.handleArea} {...panResponder.panHandlers}>
          <View style={styles.handle} />
        </View>

        {/* X 버튼 */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            animateTo(SCREEN_HEIGHT);
            setTimeout(onClose, 300);
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>

        {/* 스크롤 콘텐츠 */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {data.summaries.map((summary, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{`섹션 ${index + 1}`}</Text>
              <Text style={styles.sectionBody}>{summary}</Text>
            </View>
          ))}

          {/* 출처 영역 */}
          <View style={styles.sourceArea}>
            <Text style={styles.sourceChannel}>{data.channelName}</Text>
            <Text style={styles.sourceTitle}>{data.videoTitle}</Text>
            <TouchableOpacity onPress={handlePressUrl}>
              <Text style={styles.sourceUrl}>{data.videoUrl}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `${colors.gray500}1A`, // gray500 10%
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: SNAP_FULL,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  handleArea: {
    alignItems: "center",
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  handle: {
    width: 62,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray400,
  },
  closeButton: {
    position: "absolute",
    top: 22,
    right: spacing.lg,
  },
  closeText: {
    fontSize: 16,
    color: colors.gray400,
    fontFamily: "SF Pro",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
    gap: 36,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.footerBold12,
    color: colors.gray800,
  },
  sectionBody: {
    ...typography.bodyRegular11,
    color: colors.gray700,
    lineHeight: 19.25,
  },
  sourceArea: {
    flexDirection: "column",
    gap: 2,
  },
  sourceChannel: {
    ...typography.bodyRegular10,
    color: colors.gray700,
  },
  sourceTitle: {
    ...typography.bodyRegular10,
    color: colors.gray700,
  },
  sourceUrl: {
    ...typography.bodyRegular10,
    color: colors.gray500,
  },
});
