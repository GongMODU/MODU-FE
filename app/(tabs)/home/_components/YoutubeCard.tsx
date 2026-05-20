import { colors, spacing, typography } from "@/styles";
import { type YoutubeSummaryItem } from "@/types/youtube";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewProps,
} from "react-native";

type YoutubeCardProps = ViewProps & {
  /** 카드 데이터 */
  data: YoutubeSummaryItem;
  /** 자세히 알아보기 버튼 핸들러 */
  onPressDetail: () => void;
};

export default function YoutubeCard({
  data,
  onPressDetail,
  style,
  ...props
}: YoutubeCardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {/* 채널명 */}
      <View style={styles.channelRow}>
        <Text style={styles.channelName}>{data.channelName}</Text>
      </View>

      {/* 요약 불릿 목록 */}
      <View style={styles.summaryList}>
        {data.summaryLines.map((summary, index) => (
          <View key={index} style={styles.summaryItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        ))}
      </View>

      {/* 자세히 알아보기 버튼 */}
      <TouchableOpacity style={styles.detailButton} onPress={onPressDetail}>
        <Text style={styles.detailButtonText}>자세히 알아보기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.white,
    padding: spacing.md,
    gap: spacing.md,
  },
  channelRow: {
    alignItems: "flex-end",
  },
  channelName: {
    ...typography.captionMedium8,
    color: colors.gray400,
    textAlign: "right",
  },
  summaryList: {
    flexDirection: "column",
    gap: spacing.sm,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
  },
  bullet: {
    ...typography.bodyRegular10,
    color: colors.gray700,
  },
  summaryText: {
    ...typography.bodyRegular10,
    color: colors.gray700,
    flex: 1,
  },
  detailButton: {
    borderRadius: 2,
    backgroundColor: colors.gray400,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  detailButtonText: {
    ...typography.labelMedium10,
    color: colors.gray50,
    textAlign: "center",
  },
});
