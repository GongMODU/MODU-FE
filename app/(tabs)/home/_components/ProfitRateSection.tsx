import { getReturnRate } from "@/lib/api/subscriptionHistory";
import { queryKeys } from "@/lib/queryKeys";
import { colors, spacing, typography } from "@/styles";
import type { MonthlyReturnRate } from "@/types/subscriptionHistory";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
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

const TREND_CAPTIONS: Record<string, string> = {
  INCREASED: "저번달에 비해 이번달 평균 수익률이 증가했어요!",
  DECREASED: "저번달에 비해 이번달 평균 수익률이 감소했어요!",
  UNCHANGED: "저번달과 이번달 평균 수익률이 동일해요.",
  NO_DATA: "아직 수익률 데이터가 없어요.",
};

const BAR_MAX_H = 90;

function ProfitBarChart({
  current,
  last,
  trend,
}: {
  current: number;
  last: number;
  trend: string;
}) {
  const maxAbs = Math.max(Math.abs(current), Math.abs(last), 1);
  const barData = [
    { label: "저번달", value: last, color: colors.primary200 },
    { label: "이번달", value: current, color: colors.primary600 },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.barChartInner}>
        {barData.map((item) => (
          <View key={item.label} style={styles.barColumn}>
            <Text style={styles.barValueLabel}>
              {item.value >= 0 ? "+" : ""}
              {item.value.toFixed(1)}%
            </Text>
            <View
              style={[
                styles.bar,
                {
                  height: (Math.abs(item.value) / maxAbs) * BAR_MAX_H,
                  backgroundColor: item.color,
                },
              ]}
            />
            <Text style={styles.barXLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.barCaption}>{TREND_CAPTIONS[trend] ?? ""}</Text>
    </View>
  );
}

function ProfitLineChart({ data }: { data: MonthlyReturnRate[] }) {
  if (data.length < 2) {
    return (
      <View style={[styles.card, styles.emptyCard]}>
        <Text style={styles.emptyText}>수익률 데이터가 부족해요.</Text>
      </View>
    );
  }

  const values = data.map((d) => d.averageReturnRate);
  const MAX_VAL = Math.max(...values);
  const MIN_VAL = Math.min(...values);
  const VALUE_RANGE = MAX_VAL === MIN_VAL ? 1 : MAX_VAL - MIN_VAL;

  const toY = (v: number) => CHART_TOP + ((MAX_VAL - v) / VALUE_RANGE) * CHART_H;
  const toX = (i: number) => CHART_LEFT + (i / (data.length - 1)) * CHART_W;
  const ZERO_Y = toY(0);
  const points = data.map((d, i) => `${toX(i)},${toY(d.averageReturnRate)}`).join(" ");

  return (
    <View style={styles.card}>
      <Svg width={SVG_W} height={SVG_H}>
        <Line
          x1={CHART_LEFT} y1={ZERO_Y}
          x2={CHART_LEFT + CHART_W} y2={ZERO_Y}
          stroke={colors.gray200} strokeWidth={1} strokeDasharray="4,4"
        />
        <Polyline points={points} fill="none" stroke={colors.primary200} strokeWidth={1.5} />
        {data.map((d, i) => {
          const cx = toX(i);
          const cy = toY(d.averageReturnRate);
          const isLast = i === data.length - 1;
          const label = `${d.averageReturnRate >= 0 ? "+" : ""}${d.averageReturnRate.toFixed(1)}%`;
          const labelY = cy < ZERO_Y ? cy - 8 : cy + 14;
          return (
            <G key={i}>
              <Circle cx={cx} cy={cy} r={3} fill={isLast ? colors.primary600 : colors.primary200} />
              <SvgText x={cx} y={labelY} textAnchor="middle" fontSize={8} fontWeight="500"
                fill={isLast ? colors.primary600 : colors.gray400}>
                {label}
              </SvgText>
            </G>
          );
        })}
        {data.map((d, i) => (
          <SvgText key={`xl-${i}`} x={toX(i)} y={SVG_H - 4} textAnchor="middle"
            fontSize={8} fontWeight="500" fill={colors.gray400}>
            {d.month}월
          </SvgText>
        ))}
        <SvgText x={CHART_LEFT - 4} y={ZERO_Y + 3} textAnchor="end"
          fontSize={8} fontWeight="500" fill={colors.gray400}>
          0
        </SvgText>
      </Svg>
    </View>
  );
}

export default function ProfitRateSection() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: returnRate, isLoading } = useQuery({
    queryKey: queryKeys.subscriptionHistory.returnRate(6),
    queryFn: () => getReturnRate(6).then((r) => r.data),
  });

  return (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => router.push("/history")}
      >
        <Text style={styles.sectionTitle}>나의 평균 수익률</Text>
        <Ionicons name="chevron-forward" size={24} color={colors.gray400} />
      </TouchableOpacity>

      {isLoading ? (
        <View style={[styles.card, styles.emptyCard]}>
          <ActivityIndicator color={colors.primary600} />
        </View>
      ) : !returnRate || returnRate.trend === "NO_DATA" ? (
        <View style={[styles.card, styles.emptyCard]}>
          <Text style={styles.emptyText}>아직 수익률 데이터가 없어요.</Text>
        </View>
      ) : (
        <>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
              setActiveIndex(index);
            }}
          >
            <View style={{ width: CARD_WIDTH }}>
              <ProfitBarChart
                current={returnRate.currentMonthReturnRate}
                last={returnRate.lastMonthReturnRate}
                trend={returnRate.trend}
              />
            </View>
            <View style={{ width: CARD_WIDTH }}>
              <ProfitLineChart data={returnRate.monthlyReturnRates} />
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
        </>
      )}
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
  emptyCard: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    ...typography.bodyRegular10,
    color: colors.gray400,
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
