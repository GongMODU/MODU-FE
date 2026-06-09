import { colors, typography } from "@/styles";
import { Dimensions, Modal, Pressable, StyleSheet, Text } from "react-native";

const CARD_WIDTH = 280;
const SCREEN_WIDTH = Dimensions.get("window").width;

type Props = {
  /** 툴팁 표시 여부 */
  visible: boolean;
  /** 툴팁 제목 */
  title: string;
  /** 툴팁 설명 */
  description: string;
  /** 툴팁 카드 y 위치 (measureInWindow 기준 — x는 화면 중앙 고정) */
  positionY: number;
  /** 닫기 콜백 */
  onClose: () => void;
};

/**
 * ⓘ 아이콘 클릭 시 해당 위치 아래에 떠오르는 툴팁 카드.
 * 오버레이 없이 투명 배경 Modal로 렌더링하여 ScrollView 잘림 없이 동작.
 */
export default function TooltipCard({
  visible,
  title,
  description,
  positionY,
  onClose,
}: Props) {
  const cardLeft = (SCREEN_WIDTH - CARD_WIDTH) / 2;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* 전체 화면 투명 Pressable — 바깥 탭 시 닫기 */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* 카드 영역은 탭 이벤트 소비하여 닫히지 않도록 */}
        <Pressable
          style={[styles.card, { top: positionY, left: cardLeft }]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  card: {
    position: "absolute",
    width: 280,
    borderRadius: 10,
    backgroundColor: colors.white,
    padding: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    ...typography.footerBold12,
    color: colors.gray600,
  },
  description: {
    ...typography.captionMedium9,
    color: colors.gray400,
    lineHeight: 11.7,
  },
});
