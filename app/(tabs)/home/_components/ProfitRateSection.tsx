import { colors, spacing, typography } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, G, Line, Polyline, Text as SvgText } from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - spacing.lg * 2;
const CARD_HEIGHT = 196;
const CARD_PADDING = 16;

const SVG_W = CARD_WIDTH - CARD_PADDING * 2;
const SVG_H = CARD_HEIGHT - CARD_PADDING * 2;

const CHART_LEFT = 28;
const CHART_RIGHT = 12;
const CHART_TOP = 28;
const CHART_BOTTOM = 28;
const CHART_W = SVG_W - CHART_LEFT - CHART_RIGHT;
const CHART_H = SVG_H - CHART_TOP - CHART_BOTTOM;

const LINE_DATA = [
  { label: "12월", value: -12 },
  { label: "1월", value: -28 },
  { label: "2월", value: 18 },
  { label: "3월", value: 13 },
  { label: "4월", value: 20 },
  { label: "5월", value: 31 },
];

const MAX_VAL = Math.max(...LINE_DATA.map((d) => d.value));
const MIN_VAL = Math.min(...LINE_DATA.map((d) => d.value));
const VALUE_RANGE = MAX_VAL - MIN_VAL;

const toLineY = (value: number) =>
  CHART_TOP + ((MAX_VAL - value) / VALUE_RANGE) * CHART_H;
const toLineX = (i: number) =>
  CHART_LEFT + (i / (LINE_DATA.length - 1)) * CHART_W;

const ZERO_Y = toLineY(0);
const POLYLINE_POINTS = LINE_DATA.map((d, i) =>
  `${toLineX(i)},${toLineY(d.value)}`
).join(" ");

const BAR_DATA = [
  { label: "저번달", value: 31, color: colors.primary200 },
  { label: "이번달", value: 20, color: colors.primary600 },
];
const BAR_MAX_VAL = Math.max(...BAR_DATA.map((d) => d.value));
const BAR_MAX_H = 90;

function ProfitBarChart() {
  return (
    <View style={styles.card}>
      <View style={styles.barChartInner}>
        {BAR_DATA.map((item) => (
          <View key={item.label} style={styles.barColumn}>
            <Text style={styles.barValueLabel}>+{item.value}%</Text>
            <View
              style={[
                styles.bar,
                {
                  height: (item.value / BAR_MAX_VAL) * BAR_MAX_H,
                  backgroundColor: item.color,
                },
              ]}
            />
            <Text style={styles.barXLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.barCaption}>
        저번달에 비해 이번달 평균 수익률이 감소했어요!
      </Text>
    </View>
  );
}

function ProfitLineChart() {
  return (
    <View style={styles.card}>
      <Svg width={SVG_W} height={SVG_H}>
        {/* Zero dashed line */}
        <Line
          x1={CHART_LEFT}
          y1={ZERO_Y}
          x2={CHART_LEFT + CHART_W}
          y2={ZERO_Y}
          stroke={colors.gray200}
          strokeWidth={1}
          strokeDasharray="4,4"
        />
        {/* Line connecting data points */}
        <Polyline
          points={POLYLINE_POINTS}
          fill="none"
          stroke={colors.primary200}
          strokeWidth={1.5}
        />
        {/* Data points + percentage labels */}
        {LINE_DATA.map((d, i) => {
          const cx = toLineX(i);
          const cy = toLineY(d.value);
          const isLast = i === LINE_DATA.length - 1;
          const label = `${d.value > 0 ? "+" : ""}${d.value}%`;
          const labelY = cy < ZERO_Y ? cy - 8 : cy + 14;
          return (
            <G key={i}>
              <Circle
                cx={cx}
                cy={cy}
                r={3}
                fill={isLast ? colors.primary600 : colors.primary200}
              />
              <SvgText
                x={cx}
                y={labelY}
                textAnchor="middle"
                fontSize={8}
                fontWeight="500"
                fill={isLast ? colors.primary600 : colors.gray400}
              >
                {label}
              </SvgText>
            </G>
          );
        })}
        {/* X-axis labels */}
        {LINE_DATA.map((d, i) => (
          <SvgText
            key={`xl-${i}`}
            x={toLineX(i)}
            y={SVG_H - 4}
            textAnchor="middle"
            fontSize={8}
            fontWeight="500"
            fill={colors.gray400}
          >
            {d.label}
          </SvgText>
        ))}
        {/* Y-axis 0 label */}
        <SvgText
          x={CHART_LEFT - 4}
          y={ZERO_Y + 3}
          textAnchor="end"
          fontSize={8}
          fontWeight="500"
          fill={colors.gray400}
        >
          0
        </SvgText>
      </Svg>
    </View>
  );
}

export default function ProfitRateSection() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => router.push("/history")}
      >
        <Text style={styles.sectionTitle}>나의 평균 수익률</Text>
        <Ionicons name="chevron-forward" size={24} color={colors.gray400} />
      </TouchableOpacity>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / CARD_WIDTH,
          );
          setActiveIndex(index);
        }}
      >
        <View style={{ width: CARD_WIDTH }}>
          <ProfitBarChart />
        </View>
        <View style={{ width: CARD_WIDTH }}>
          <ProfitLineChart />
        </View>
      </ScrollView>

      <View style={styles.pagination}>
        {[0, 1].map((i) => (
          <View
            key={i}
            style={[
              styles.paginationDot,
              i === activeIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    ...typography.largeTitleMedium20,
    color: colors.gray800,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 10,
    backgroundColor: colors.white,
    padding: CARD_PADDING,
    overflow: "hidden",
  },
  barChartInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 32,
  },
  barColumn: {
    alignItems: "center",
    gap: 6,
  },
  barValueLabel: {
    ...typography.captionMedium9,
    color: colors.gray600,
  },
  bar: {
    width: 44,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  barXLabel: {
    ...typography.captionMedium8,
    color: colors.gray400,
  },
  barCaption: {
    ...typography.bodyRegular10,
    color: colors.gray600,
    textAlign: "center",
    paddingTop: 4,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
  },
  paginationDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    backgroundColor: colors.primary600,
  },
  dotInactive: {
    backgroundColor: colors.primary100,
  },
});
