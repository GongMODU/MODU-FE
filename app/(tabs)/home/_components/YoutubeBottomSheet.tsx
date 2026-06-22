import { colors, spacing, typography } from "@/styles";
import { type YoutubeDetailData } from "@/types/youtube";
import { FontAwesome } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Linking,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { youtubeDetailOptions } from "./queries";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

/** 1단계 스냅 포인트 - 버튼 누를 때 올라오는 높이 */
const SNAP_PARTIAL = 455;
/** 2단계 스냅 포인트 - 끌어올렸을 때 최대 높이 */
const SNAP_FULL = SCREEN_HEIGHT * 0.95;
/** 드래그 방향 판단 임계값 */
const DRAG_THRESHOLD = 50;

type YoutubeBottomSheetProps = {
  /** 선택된 카드의 videoId */
  videoId: string;
  /** 채널명 (로딩 중에도 표시) */
  channelName: string;
  /** 닫기 핸들러 */
  onClose: () => void;
};

export default function YoutubeBottomSheet({
  videoId,
  channelName,
  onClose,
}: YoutubeBottomSheetProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [snapState, setSnapState] = useState<"partial" | "full">("partial");
  const snapRef = useRef<"partial" | "full">("partial");
  const insets = useSafeAreaInsets();

  const { data, isPending } = useQuery(youtubeDetailOptions(videoId));

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
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 5,
      onPanResponderRelease: (_, gestureState) => {
        const { dy } = gestureState;

        if (snapRef.current === "partial") {
          if (dy < -DRAG_THRESHOLD) {
            snapRef.current = "full";
            setSnapState("full");
            animateTo(SCREEN_HEIGHT - SNAP_FULL);
          } else if (dy > DRAG_THRESHOLD) {
            animateTo(SCREEN_HEIGHT);
            setTimeout(onClose, 300);
          } else {
            animateTo(SCREEN_HEIGHT - SNAP_PARTIAL);
          }
        } else {
          if (dy > DRAG_THRESHOLD) {
            snapRef.current = "partial";
            setSnapState("partial");
            animateTo(SCREEN_HEIGHT - SNAP_PARTIAL);
          } else {
            animateTo(SCREEN_HEIGHT - SNAP_FULL);
          }
        }
      },
    }),
  ).current;

  const handlePressUrl = useCallback((url: string) => {
    Linking.openURL(url);
  }, []);

  const renderContent = (detail: YoutubeDetailData) => (
    <>
      {detail.sections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionBody}>{section.content}</Text>
        </View>
      ))}

      <View style={styles.sourceArea}>
        <View style={styles.sourceChannelRow}>
          <FontAwesome name="youtube-play" size={13} color="#FF0000" />
          <Text style={styles.sourceChannel}>{detail.channelName}</Text>
        </View>
        <Text style={styles.sourceTitle}>{detail.videoTitle}</Text>
        <TouchableOpacity onPress={() => handlePressUrl(detail.videoUrl)}>
          <Text style={styles.sourceUrl}>{detail.videoUrl}</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <Modal
      visible={true}
      transparent
      animationType="none"
      onRequestClose={() => {
        animateTo(SCREEN_HEIGHT);
        setTimeout(onClose, 300);
      }}
    >
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
          {/* 핸들 영역 */}
          <View style={styles.handleArea} {...panResponder.panHandlers}>
            <View style={styles.handle} />
          </View>

          {/* X 버튼 */}
          <Pressable
            style={styles.closeButton}
            onPress={() => {
              animateTo(SCREEN_HEIGHT);
              setTimeout(onClose, 300);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.closeText}>×</Text>
          </Pressable>

          {/* 스크롤 콘텐츠 */}
          <View style={styles.scrollContainer}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: spacing.xl + insets.bottom },
              ]}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              scrollEnabled={snapState === "full"}
            >
              {isPending || data === undefined ? (
                <View style={styles.loadingArea}>
                  <Text style={styles.loadingChannel}>{channelName}</Text>
                  <ActivityIndicator color={colors.primary600} />
                </View>
              ) : (
                renderContent(data)
              )}
            </ScrollView>
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
    paddingBottom: spacing.md,
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
    zIndex: 1,
  },
  closeText: {
    fontSize: 16,
    color: colors.gray400,
    fontFamily: "SF Pro",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: 45,
    paddingBottom: 80,
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
  sourceChannelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
  loadingArea: {
    flex: 1,
    alignItems: "center",
    gap: spacing.md,
    paddingTop: spacing.xl,
  },
  loadingChannel: {
    ...typography.bodyRegular10,
    color: colors.gray500,
  },
});
