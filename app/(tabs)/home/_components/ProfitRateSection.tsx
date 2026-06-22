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
import Svg, {
  Circle,
  G,
  Line,
  Polyline,
  Text as SvgText,
} from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - spacing.lg * 2;
const CARD_HEIGHT = 220;

const SVG_W = CARD_WIDTH;
const SVG_H = CARD_HEIGHT;

const FIGMA_CARD_W = 312;
const S = CARD_WIDTH / FIGMA_CARD_W;

const GRID_X1 = 24 * S;
const GRID_X2 = SVG_W;
const GRID_Y1 = 0;
const GRID_Y2 = SVG_H - 28;
const GRID_W = GRID_X2 - GRID_X1;
const GRID_H = GRID_Y2 - GRID_Y1;

// X레이블: 하단선 바로 아래 6px
const X_LABEL_Y = GRID_Y2 + 14;

// → 첫 점은 Y축에서 한 칸 띄고, 마지막 점도 한 칸 여백, 항상 범위 안에 유지
function getXPositions(n: number): number[] {
  const step = GRID_W / (n + 1);
  return Array.from({ length: n }, (_, i) => GRID_X1 + step * (i + 1));
}

const TREND_CAPTIONS: Record<string, string> = {
  INCREASED: "저번달에 비해 이번달 평균 수익률이 증가했어요!",
  DECREASED: "저번달에 비해 이번달 평균 수익률이 감소했어요!",
  UNCHANGED: "저번달과 이번달 평균 수익률이 동일해요.",
  NO_DATA: "아직 수익률 데이터가 없어요.",
};

function ProfitBarChart({
  current,
  last,
  trend,
}: {
  current: number | null;
  last: number | null;
  trend: string;
}) {
  const cur = current ?? 0;
  const prv = last ?? 0;
  const maxAbs = Math.max(Math.abs(cur), Math.abs(prv), 1);

  // 피그마 기준 312w × 200h
  const SX = CARD_WIDTH / 312;
  const SY = CARD_HEIGHT / 200;

  const gridH = Math.round(130 * SY); // 격자 영역 높이
  const barW = Math.round(64 * SX); // 막대 너비
  const hpad = Math.round(45.5 * SX); // 양쪽 수평 여백
  const maxBarH = Math.round(100 * SY); // 최대 막대 높이 (하단선까지)

  const vLines = [78, 156, 234].map((x) => Math.round(x * SX));

  const barItems = [
    {
      value: prv,
      h: Math.max(Math.round((Math.abs(prv) / maxAbs) * maxBarH), 1),
      color: colors.primary200,
      label: "저번달",
      textColor: colors.primary200,
    },
    {
      value: cur,
      h: Math.max(Math.round((Math.abs(cur) / maxAbs) * maxBarH), 1),
      color: colors.primary600,
      label: "이번달",
      textColor: colors.primary600,
    },
  ];

  return (
    <View style={styles.cardNopad}>
      {/* 격자 SVG */}
      <Svg
        width={CARD_WIDTH}
        height={gridH}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {vLines.map((x, i) => (
          <Line
            key={i}
            x1={x}
            y1={0}
            x2={x}
            y2={gridH}
            stroke={colors.gray100}
            strokeWidth={1}
          />
        ))}
        <Line
          x1={0}
          y1={gridH}
          x2={CARD_WIDTH}
          y2={gridH}
          stroke={colors.gray200}
          strokeWidth={1}
        />
      </Svg>

      {/* 막대 + % 레이블 */}
      <View
        style={{
          height: gridH,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingHorizontal: hpad,
          paddingBottom: 0,
        }}
      >
        {barItems.map((item) => (
          <View
            key={item.label}
            style={{ width: barW, alignItems: "center", gap: 4 }}
          >
            <Text style={[styles.barValueLabel, { color: item.textColor }]}>
              {item.value >= 0 ? "+" : ""}
              {item.value.toFixed(1)}%
            </Text>
            <View
              style={{
                width: barW,
                height: item.h,
                backgroundColor: item.color,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            />
          </View>
        ))}
      </View>

      {/* 월 레이블 */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: hpad,
          paddingTop: 4,
        }}
      >
        {barItems.map((item) => (
          <Text
            key={item.label}
            style={[styles.barXLabel, { width: barW, textAlign: "center" }]}
          >
            {item.label}
          </Text>
        ))}
      </View>

      {/* 코멘트 */}
      <Text
        style={[styles.barCaption, { paddingHorizontal: 16, paddingTop: 18 }]}
      >
        {TREND_CAPTIONS[trend] ?? ""}
      </Text>
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

  const xPositions = getXPositions(data.length);

  const values = data.map((d) => d.averageReturnRate);
  const effMax = Math.max(...values, 0);
  const effMin = Math.min(...values, 0);

  const LABEL_PAD = 14;
  const dynamicZeroY = GRID_Y1 + GRID_H / 2;
  const HALF = GRID_H / 2 - LABEL_PAD;

  const MIN_SCALE = 50;
  const maxAbs = Math.max(Math.abs(effMax), Math.abs(effMin), 1);
  const SCALE_MAX = Math.max(maxAbs * 1.2, MIN_SCALE);

  const toY = (v: number) => dynamicZeroY - (v / SCALE_MAX) * HALF;

  const points = data
    .map((d, i) => `${xPositions[i]},${toY(d.averageReturnRate)}`)
    .join(" ");

  return (
    <View style={styles.cardNopad}>
      <Svg width={SVG_W} height={SVG_H}>
        {/* Y축 왼쪽 세로선 */}
        <Line
          x1={GRID_X1}
          y1={GRID_Y1}
          x2={GRID_X1}
          y2={GRID_Y2}
          stroke={colors.gray200}
          strokeWidth={1}
        />

        {/* 수직 격자선 */}
        {xPositions.map((x, i) => (
          <Line
            key={`vg-${i}`}
            x1={x}
            y1={GRID_Y1}
            x2={x}
            y2={GRID_Y2}
            stroke={colors.gray100}
            strokeWidth={1}
          />
        ))}

        {/* 0 기준선: GRID_X1에서 시작 */}
        <Line
          x1={GRID_X1}
          y1={dynamicZeroY}
          x2={GRID_X2}
          y2={dynamicZeroY}
          stroke={colors.gray200}
          strokeWidth={1}
        />

        {/* 하단 경계선: Y축 세로선 꼭짓점부터 */}
        <Line
          x1={GRID_X1}
          y1={GRID_Y2}
          x2={GRID_X2}
          y2={GRID_Y2}
          stroke={colors.gray200}
          strokeWidth={1}
        />

        {/* 꺾은선 */}
        <Polyline
          points={points}
          fill="none"
          stroke={colors.primary200}
          strokeWidth={1.5}
        />

        {/* 포인트 + 레이블 */}
        {data.map((d, i) => {
          const cx = xPositions[i];
          const cy = toY(d.averageReturnRate);
          const isLast = i === data.length - 1;
          const label = `${d.averageReturnRate >= 0 ? "+" : ""}${Math.round(d.averageReturnRate)}%`;
          const labelY = cy <= dynamicZeroY ? cy - 14 : cy + 18;
          return (
            <G key={i}>
              <Circle
                cx={cx}
                cy={cy}
                r={6.5}
                fill={isLast ? colors.primary600 : colors.primary200}
              />
              <Circle cx={cx} cy={cy} r={3.5} fill={colors.white} />
              <SvgText
                x={cx}
                y={labelY}
                textAnchor="middle"
                fontSize={9}
                fontWeight="500"
                fill={isLast ? colors.primary600 : colors.primary200}
              >
                {label}
              </SvgText>
            </G>
          );
        })}

        {/* X축 레이블 */}
        {data.map((d, i) => (
          <SvgText
            key={`xl-${i}`}
            x={xPositions[i]}
            y={X_LABEL_Y}
            textAnchor="middle"
            fontSize={8}
            fontWeight="500"
            fill={colors.gray400}
          >
            {d.month}월
          </SvgText>
        ))}

        {/* Y축 "0" */}
        <SvgText
          x={GRID_X1 - 4}
          y={dynamicZeroY + 4}
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

  const { data: returnRate, isLoading } = useQuery({
    queryKey: queryKeys.subscriptionHistory.returnRate(6),
    queryFn: () => getReturnRate(6).then((r) => r.data),
  });

  const hasCurrentMonth =
    returnRate != null && returnRate.currentMonthReturnRate != null;

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
      ) : !returnRate ||
        (returnRate.trend === "NO_DATA" &&
          returnRate.monthlyReturnRates.length === 0) ? (
        <View style={[styles.card, styles.emptyCard]}>
          <Text style={styles.emptyText}>아직 수익률 데이터가 없어요.</Text>
        </View>
      ) : hasCurrentMonth ? (
        <>
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
      ) : (
        <>
          <ProfitLineChart data={returnRate.monthlyReturnRates} />
          <View style={styles.pagination}>
            <View style={[styles.paginationDot, styles.dotActive]} />
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
    padding: 16,
    overflow: "hidden",
    position: "relative",
  },
  cardNopad: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 10,
    backgroundColor: colors.white,
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
  barValueLabel: {
    ...typography.labelMedium10,
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
