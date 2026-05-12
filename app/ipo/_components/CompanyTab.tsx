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
import { type CompanyTabInfo } from "./types";

// ─── 툴팁 텍스트 상수 ─────────────────────────────────────────
const TOOLTIPS = {
  lockupShares: {
    title: "보호예수",
    description:
      "대주주나 임원 등 주요 주주들이 상장 후 일정 기간 주식을 팔지 못하도록 묶어두는 제도예요. 비율이 높을수록 상장 초기 매도 물량이 적어 주가 안정에 유리해요.",
  },
} as const;

type TooltipKey = keyof typeof TOOLTIPS;

type Props = ViewProps & {
  /** 기업 탭 데이터 */
  data: CompanyTabInfo;
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

// ─── 기업 탭 ──────────────────────────────────────────────────
export default function CompanyTab({ data, style, ...props }: Props) {
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
        <InfoCell label="매출액" value={data.revenue} />
        <InfoCell label="순이익" value={data.netIncome} />
        <InfoCell label="공모주식수" value={data.offeringShares} />
        <InfoCell label="상장주식수" value={data.listedShares} />
        {/* 보호예수는 두 셀 모두 동일한 툴팁 사용 */}
        <InfoCellWithTooltip
          label="보호예수"
          value={data.lockupShares[0]}
          tooltipKey="lockupShares"
          activeTooltip={activeTooltip}
          onTooltipToggle={handleTooltipToggle}
        />
        <InfoCellWithTooltip
          label="보호예수"
          value={data.lockupShares[1]}
          tooltipKey="lockupShares"
          activeTooltip={activeTooltip}
          onTooltipToggle={handleTooltipToggle}
        />

        {/* 청약 증권사 - 2열 전체 너비 */}
        <View style={styles.cellFull}>
          <Text style={styles.cellLabel}>청약 증권사</Text>
          <View style={styles.brokerRow}>
            {data.brokers.map((broker, index) => (
              <View key={index} style={styles.brokerTag}>
                <Text style={styles.brokerText}>{broker}</Text>
              </View>
            ))}
          </View>
        </View>
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
  cellFull: {
    width: "100%",
    padding: 12,
    gap: 8,
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
  brokerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  brokerTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: colors.gray50,
  },
  brokerText: {
    ...typography.labelMedium10,
    color: colors.gray600,
  },
  infoIcon: {
    fontSize: 10,
    color: colors.gray400,
    lineHeight: 13,
  },
});
