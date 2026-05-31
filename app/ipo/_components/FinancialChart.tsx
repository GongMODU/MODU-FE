import { colors, typography } from "@/styles";
import { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type LayoutChangeEvent,
  type ViewProps,
} from "react-native";
import Svg, { Line, Rect } from "react-native-svg";
import TooltipCard from "./TooltipCard";
import { type FinancialChartData } from "./types";

type Props = ViewProps & {
  /** 재무제표 차트 데이터 */
  data: FinancialChartData;
};

// ─── 상수 ──────────────────────────────────────────────────────
const CHART_HEIGHT = 153;
const Y_AXIS_WIDTH = 30;
const CHART_PADDING_TOP = 8;
const BAR_GROUP_GAP = 16;
const BAR_GAP = 4;
const TICK_COUNT = 5;
const LOG_LINEAR_THRESHOLD = 10;

/** 막대 색상 — 기수 인덱스 순서대로 매핑 */
const BAR_COLORS = [colors.primary200, colors.primary600] as const;

const TOOLTIPS = {
  totalAssets: {
    title: "자산총계",
    description:
      "기업이 가진 모든 것의 합계예요. 현금, 건물, 장비 등을 모두 더한 값으로, 숫자가 클수록 기업이 더 많은 것을 보유하고 있어요.",
  },
  totalLiabilities: {
    title: "부채총계",
    description:
      "기업이 갚아야 할 모든 빚의 합계예요. 자산 대비 부채가 너무 많으면 재무적으로 불안정할 수 있어요.",
  },
  netIncome: {
    title: "당기순이익 / 당기순손실",
    description:
      "당기순이익은 해당 기간 동안 수입이 지출보다 많아 발생한 이익이에요. 당기순손실은 반대로 지출이 수입보다 많을 때 발생하며, 손실이 크거나 지속되면 기업의 재무 건전성을 꼼꼼히 살펴볼 필요가 있어요.",
  },
} as const;

type TooltipKey = keyof typeof TOOLTIPS;

/** 툴팁이 있는 term 인덱스 매핑 (0: 매출액 제외) */
const TOOLTIP_TERM_MAP: Record<number, TooltipKey> = {
  1: "totalAssets",
  2: "totalLiabilities",
  3: "netIncome",
};

// ─── Y축 유틸 ───────────────────────────────────────────────────

/** 원 단위 숫자 → Y축 라벨 문자열 */
function formatAxisLabel(value: number): string {
  if (value >= 1_0000_0000_0000) {
    const v = value / 1_0000_0000_0000;
    return `${v % 1 === 0 ? v : v.toFixed(1)}조`;
  }
  if (value >= 1_0000_0000) {
    const v = value / 1_0000_0000;
    return `${v % 1 === 0 ? v : v.toFixed(1)}억`;
  }
  if (value >= 10000) {
    const v = value / 10000;
    return `${v % 1 === 0 ? v : v.toFixed(1)}만`;
  }
  return `${value.toLocaleString()}`;
}

function ceilToSignificant(value: number): number {
  if (value <= 0) return 0;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)) - 1);
  return Math.ceil(value / magnitude) * magnitude;
}

function floorToSignificant(value: number): number {
  if (value <= 0) return 0;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)) - 1);
  return Math.floor(value / magnitude) * magnitude;
}

/**
 * 데이터 양수값 기준으로 Y축 눈금 5개 생성
 * 최댓값/최솟값 비율 10배 이상 → 로그 스케일
 * 미만 → 선형 스케일
 */
function buildYTicks(allValues: number[]): { label: string; value: number }[] {
  const positiveValues = allValues.filter((v) => v > 0);
  if (positiveValues.length === 0) return [];

  const maxValue = Math.max(...positiveValues);
  const minValue = Math.min(...positiveValues);

  const topTick = ceilToSignificant(maxValue);
  const bottomTick =
    Math.floor(Math.log10(maxValue)) === Math.floor(Math.log10(minValue))
      ? 0
      : floorToSignificant(minValue);

  const useLog = bottomTick > 0 && topTick / bottomTick >= LOG_LINEAR_THRESHOLD;

  return Array.from({ length: TICK_COUNT }, (_, i) => {
    const ratio = i / (TICK_COUNT - 1);
    let value: number;
    if (useLog) {
      const logTop = Math.log10(topTick);
      const logBottom = Math.log10(bottomTick);
      const rawValue = Math.pow(10, logTop - ratio * (logTop - logBottom));
      // 첫째(topTick)와 마지막(bottomTick)은 그대로, 중간값만 반올림
      value =
        i === 0
          ? topTick
          : i === TICK_COUNT - 1
            ? bottomTick
            : ceilToSignificant(rawValue);
    } else {
      value = topTick - ratio * (topTick - bottomTick);
    }
    return { label: formatAxisLabel(value), value };
  });
}

/**
 * 원 단위 값을 차트 Y 좌표로 변환
 * value가 0이거나 음수면 최하단 반환
 */
function valueToY(
  value: number,
  chartHeight: number,
  topTick: number,
  bottomTick: number,
  useLog: boolean,
): number {
  if (value <= 0) return chartHeight;
  let ratio: number;
  if (useLog && bottomTick > 0) {
    const logTop = Math.log10(topTick);
    const logBottom = Math.log10(bottomTick);
    ratio = (Math.log10(value) - logBottom) / (logTop - logBottom);
  } else {
    ratio = (value - bottomTick) / (topTick - bottomTick);
  }
  const clampedRatio = Math.min(Math.max(ratio, 0), 1);
  return chartHeight - clampedRatio * (chartHeight - CHART_PADDING_TOP);
}

// ─── 재무제표 차트 ──────────────────────────────────────────────
export default function FinancialChart({ data, style, ...props }: Props) {
  const { periods, terms } = data;
  const periodCount = periods.length;
  const termCount = terms.length;

  const [svgWidth, setSvgWidth] = useState(0);

  const allValues = periods.flatMap((p) => p.values.filter((v) => v > 0));
  const yTicks = buildYTicks(allValues);
  const topTick = yTicks.length > 0 ? yTicks[0].value : 1;
  const bottomTick = yTicks.length > 0 ? yTicks[yTicks.length - 1].value : 0;
  const useLog = bottomTick > 0 && topTick / bottomTick >= LOG_LINEAR_THRESHOLD;
  const toY = (value: number) =>
    valueToY(value, CHART_HEIGHT, topTick, bottomTick, useLog);

  const [activeTooltip, setActiveTooltip] = useState<TooltipKey | null>(null);
  const [tooltipPositionY, setTooltipPositionY] = useState(0);
  const iconRefs = useRef<Record<number, View | null>>({});

  const handleTooltipToggle = (key: TooltipKey, positionY: number) => {
    if (activeTooltip === key) {
      setActiveTooltip(null);
      return;
    }
    setTooltipPositionY(positionY);
    setActiveTooltip(key);
  };

  function handleLayout(e: LayoutChangeEvent): void {
    setSvgWidth(e.nativeEvent.layout.width);
  }

  const groupWidth =
    svgWidth > 0 ? (svgWidth - BAR_GROUP_GAP * (termCount - 1)) / termCount : 0;
  const barWidth =
    groupWidth > 0
      ? (groupWidth - BAR_GAP * (periodCount - 1)) / periodCount
      : 0;

  return (
    <View style={[styles.container, style]} {...props}>
      {/* 범례 */}
      <View style={styles.legend}>
        {periods.map((period, i) => (
          <View key={period.periodName} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: BAR_COLORS[i % BAR_COLORS.length] },
              ]}
            />
            <Text style={styles.legendText}>{period.periodName}</Text>
          </View>
        ))}
      </View>

      {/* 차트 영역 */}
      <View style={styles.chartRow}>
        {/* Y축 라벨 */}
        <View style={[styles.yAxisLabels, { height: CHART_HEIGHT }]}>
          {yTicks.map((tick) => (
            <Text
              key={tick.label}
              style={[styles.yLabel, { top: toY(tick.value) - 5 }]}
            >
              {tick.label}
            </Text>
          ))}
        </View>

        {/* SVG 차트 본체 */}
        <View style={styles.svgWrapper} onLayout={handleLayout}>
          <Svg width={svgWidth} height={CHART_HEIGHT}>
            {/* 수평 그리드 라인 */}
            {yTicks.map((tick) => {
              const y = toY(tick.value);
              return (
                <Line
                  key={tick.label}
                  x1={0}
                  y1={y}
                  x2={svgWidth}
                  y2={y}
                  stroke={colors.gray100}
                  strokeWidth={1}
                />
              );
            })}

            {/* 막대 */}
            {terms.map((_, termIdx) => {
              const groupX = termIdx * (groupWidth + BAR_GROUP_GAP);
              return periods.map((period, periodIdx) => {
                const value = period.values[termIdx];
                const barColor = BAR_COLORS[periodIdx % BAR_COLORS.length];
                const barX = groupX + periodIdx * (barWidth + BAR_GAP);
                const barY = toY(value);
                const barHeight = CHART_HEIGHT - barY;

                return (
                  <Rect
                    key={`${termIdx}-${periodIdx}`}
                    x={barX}
                    y={barY}
                    width={barWidth}
                    height={Math.max(barHeight, 0)}
                    fill={barColor}
                  />
                );
              });
            })}
          </Svg>

          {/* X축 라벨 */}
          <View style={styles.xAxisLabels}>
            {terms.map((term) => (
              <Text key={term.label} style={styles.xLabel}>
                {term.label}
              </Text>
            ))}
          </View>
        </View>
      </View>

      {/* 용어 설명 */}
      <View style={styles.termList}>
        {terms.map((term, i) => {
          const tooltipKey = TOOLTIP_TERM_MAP[i];
          return (
            <View
              key={term.label}
              style={[
                styles.termItem,
                i < terms.length - 1 && styles.termItemGap,
              ]}
            >
              <View style={styles.termLabelRow}>
                <Text style={styles.termLabel}>{term.label}</Text>
                {tooltipKey !== undefined && (
                  <TouchableOpacity
                    ref={(el) => {
                      iconRefs.current[i] = el;
                    }}
                    onPress={() => {
                      if (activeTooltip === tooltipKey) {
                        setActiveTooltip(null);
                        return;
                      }
                      iconRefs.current[i]?.measureInWindow(
                        (_x, y, _width, height) => {
                          handleTooltipToggle(tooltipKey, y + height + 4);
                        },
                      );
                    }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.infoIcon}>ⓘ</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.termDescription}>{term.description}</Text>
            </View>
          );
        })}
      </View>

      {activeTooltip !== null && (
        <TooltipCard
          visible
          title={TOOLTIPS[activeTooltip].title}
          description={TOOLTIPS[activeTooltip].description}
          positionY={tooltipPositionY}
          onClose={() => setActiveTooltip(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 20,
  },
  legendText: {
    ...typography.captionMedium8,
    color: colors.gray400,
  },
  chartRow: {
    flexDirection: "row",
    gap: 4,
  },
  yAxisLabels: {
    width: Y_AXIS_WIDTH,
    position: "relative",
  },
  yLabel: {
    ...typography.captionMedium8,
    color: colors.gray400,
    textAlign: "right",
    width: Y_AXIS_WIDTH,
    position: "absolute",
  },
  svgWrapper: {
    flex: 1,
    gap: 4,
  },
  xAxisLabels: {
    flexDirection: "row",
  },
  xLabel: {
    ...typography.captionMedium8,
    color: colors.gray500,
    textAlign: "center",
    flex: 1,
  },
  termList: {
    gap: 0,
  },
  termItem: {
    flexDirection: "row",
    gap: 16,
    paddingVertical: 8,
  },
  termItemGap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray100,
  },
  termLabel: {
    ...typography.labelMedium10,
    color: colors.gray600,
    width: 52,
  },
  termDescription: {
    ...typography.bodyRegular10,
    color: colors.gray500,
    flex: 1,
  },
  termLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: 68,
  },
  infoIcon: {
    fontSize: 10,
    color: colors.gray400,
    lineHeight: 13,
  },
});
