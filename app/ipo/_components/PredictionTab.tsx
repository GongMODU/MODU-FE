import { colors, spacing, typography } from "@/styles";
import { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewProps,
} from "react-native";
import TooltipCard from "./TooltipCard";
import { type PredictionInfo } from "./types";

// ─── 툴팁 텍스트 상수 ─────────────────────────────────────────
const TOOLTIPS = {
  lockupPeriod: {
    title: "의무보유",
    description:
      "기관투자자가 공모주를 배정받은 후 일정 기간 동안 주식을 팔지 않겠다고 약속한 비율이에요. 높을수록 상장 초기 물량 부담이 줄어 주가에 긍정적이에요.",
  },
  institutionalRate: {
    title: "기관경쟁률",
    description:
      "기관투자자들의 수요예측 경쟁률이에요. 경쟁률이 높을수록 기관의 관심이 높다는 의미로, 공모가 확정과 상장 후 주가에 긍정적인 신호예요.",
  },
} as const;

type TooltipKey = keyof typeof TOOLTIPS;

type Props = ViewProps & {
  /** 예측 탭 데이터 */
  data: PredictionInfo;
};

// ─── 일반 정보 셀 ─────────────────────────────────────────────
function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.cell}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={styles.cellValue}>{value}</Text>
    </View>
  );
}

// ─── ⓘ 아이콘이 포함된 정보 셀 ──────────────────────────────
type InfoCellWithTooltipProps = {
  label: string;
  value: string;
  tooltipKey: TooltipKey;
  activeTooltip: TooltipKey | null;
  onTooltipToggle: (key: TooltipKey, positionY: number) => void;
};

function InfoCellWithTooltip({
  label,
  value,
  tooltipKey,
  activeTooltip,
  onTooltipToggle,
}: InfoCellWithTooltipProps) {
  const iconRef = useRef<View>(null);

  const handlePress = () => {
    if (activeTooltip === tooltipKey) {
      onTooltipToggle(tooltipKey, 0);
      return;
    }
    iconRef.current?.measureInWindow((_x, y, _width, height) => {
      onTooltipToggle(tooltipKey, y + height + 4);
    });
  };

  return (
    <View style={styles.cell}>
      <View style={styles.labelRow}>
        <Text style={styles.cellLabel}>{label}</Text>
        <TouchableOpacity
          ref={iconRef}
          onPress={handlePress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={`${label} 설명 보기`}
        >
          <Text style={styles.infoIcon}>ⓘ</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.cellValue}>{value}</Text>
    </View>
  );
}

// ─── 예측 탭 ──────────────────────────────────────────────────
export default function PredictionTab({ data, style, ...props }: Props) {
  const [activeTooltip, setActiveTooltip] = useState<TooltipKey | null>(null);
  const [tooltipPositionY, setTooltipPositionY] = useState(0);

  const handleTooltipToggle = (key: TooltipKey, positionY: number) => {
    if (activeTooltip === key) {
      setActiveTooltip(null);
      return;
    }
    setTooltipPositionY(positionY);
    setActiveTooltip(key);
  };

  const handleTooltipClose = () => setActiveTooltip(null);

  return (
    <View style={[styles.container, style]} {...props}>
      <View style={styles.grid}>
        {/* 확정공모가 - 2열 전체 너비 */}
        <View style={styles.cellFull}>
          <Text style={styles.cellLabel}>확정공모가</Text>
          <Text style={styles.offeringPrice}>
            {data.offeringPrice === null
              ? "-"
              : `${data.offeringPrice.toLocaleString()}원`}
          </Text>
        </View>

        <InfoCell label="수요예측일" value={data.demandForecastDate} />
        <InfoCell label="희망공모가" value={data.expectedOfferingPrice} />
        <InfoCellWithTooltip
          label="의무보유"
          value={data.lockupPeriod}
          tooltipKey="lockupPeriod"
          activeTooltip={activeTooltip}
          onTooltipToggle={handleTooltipToggle}
        />
        <InfoCellWithTooltip
          label="기관경쟁률"
          value={data.institutionalRate}
          tooltipKey="institutionalRate"
          activeTooltip={activeTooltip}
          onTooltipToggle={handleTooltipToggle}
        />
      </View>

      {activeTooltip !== null && (
        <TooltipCard
          visible
          title={TOOLTIPS[activeTooltip].title}
          description={TOOLTIPS[activeTooltip].description}
          positionY={tooltipPositionY}
          onClose={handleTooltipClose}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    backgroundColor: colors.white,
    gap: spacing.xs,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  cellFull: {
    width: "100%",
    padding: spacing.sm,
    gap: 4,
    borderRadius: 8,
    backgroundColor: colors.gray50,
    alignItems: "center",
  },
  cell: {
    width: "48%",
    padding: spacing.sm,
    gap: 4,
    borderRadius: 8,
    backgroundColor: colors.gray50,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cellLabel: {
    ...typography.bodyRegular10,
    color: colors.gray500,
  },
  cellValue: {
    ...typography.labelMedium10,
    color: colors.gray600,
  },
  offeringPrice: {
    ...typography.subtitleMedium14,
    color: colors.gray800,
  },
  infoIcon: {
    fontSize: 10,
    color: colors.gray400,
    lineHeight: 13,
  },
});
