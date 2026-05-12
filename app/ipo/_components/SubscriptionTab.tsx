import { colors, typography } from "@/styles";
import { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewProps,
} from "react-native";
import TooltipCard from "./TooltipCard";
import { type SubscriptionInfo } from "./types";

// ─── 툴팁 텍스트 상수 ─────────────────────────────────────────
const TOOLTIPS = {
  proportionalRate: {
    title: "비례경쟁률",
    description:
      "청약 증거금에 비례하여 배정받는 방식의 경쟁률이에요. 증거금을 많이 넣을수록 더 많은 주식을 받을 수 있어요.",
  },
  equalAllocation: {
    title: "균등배정",
    description:
      "청약 증거금에 상관없이 청약자 모두에게 동일한 수량을 배정하는 방식이에요. 최소 증거금만 넣어도 동일하게 배정받을 수 있어요.",
  },
  generalAllocation: {
    title: "일반배정",
    description:
      "일반 투자자에게 배정되는 총 주식 수예요. 균등배정과 비례배정을 합산한 전체 물량이에요.",
  },
} as const;

type TooltipKey = keyof typeof TOOLTIPS;

type Props = ViewProps & {
  /** 청약 탭 데이터 */
  data: SubscriptionInfo;
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
      // 같은 ⓘ 재클릭 시 닫기
      onTooltipToggle(tooltipKey, 0);
      return;
    }
    iconRef.current?.measureInWindow((_x, y, _width, height) => {
      // 카드를 ⓘ 아이콘 바로 아래에 위치
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

// ─── 청약 탭 ──────────────────────────────────────────────────
export default function SubscriptionTab({ data, style, ...props }: Props) {
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
        <InfoCell label="청약일" value={data.subscriptionDate} />
        <InfoCell label="상장일" value={data.listingDate} />
        <InfoCell label="경쟁률" value={data.competitionRate} />
        <InfoCellWithTooltip
          label="비례경쟁률"
          value={data.proportionalRate}
          tooltipKey="proportionalRate"
          activeTooltip={activeTooltip}
          onTooltipToggle={handleTooltipToggle}
        />
        <InfoCellWithTooltip
          label="균등배정"
          value={data.equalAllocation}
          tooltipKey="equalAllocation"
          activeTooltip={activeTooltip}
          onTooltipToggle={handleTooltipToggle}
        />
        <InfoCellWithTooltip
          label="일반배정"
          value={data.generalAllocation}
          tooltipKey="generalAllocation"
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
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.white,
    padding: 16,
    gap: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cell: {
    width: "48%",
    padding: 12,
    gap: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray50,
    backgroundColor: colors.white,
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
  infoIcon: {
    fontSize: 10,
    color: colors.gray400,
    lineHeight: 13,
  },
});
