import StarIcon from "@/assets/images/Star2.svg";
import { colors, spacing, typography } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

function formatDisplayValue(key: keyof DetailData, value: string): string {
  if (!value.trim()) return "-";
  const num = Number(value.replace(/[^0-9.-]/g, ""));
  if (isNaN(num)) return value;
  if (key === "청약수량" || key === "배정수량") {
    return `${num.toLocaleString()}주`;
  }
  if (
    key === "수수료" ||
    key === "제세금" ||
    key === "매도가" ||
    key === "공모가"
  ) {
    return `${num.toLocaleString()}원`;
  }
  return value;
}

export type DetailData = {
  증권사: string;
  매도일: string;
  청약수량: string;
  수수료: string;
  배정수량: string;
  제세금: string;
  공모가: string;
  매도가: string;
};

type Props = {
  id: string;
  name: string;
  favorite: boolean;
  isOpen: boolean;
  data: DetailData;
  recordStatus?: "ONGOING" | "COMPLETED";
  onPress: () => void;
  onChange: (id: string, field: keyof DetailData, value: string) => void;
  onEditPress: (id: string) => void;
  onDeletePress: (id: string) => void;
  onCompletePress?: (id: string) => void;
};

export default function HistoryCard({
  id,
  name,
  favorite,
  isOpen,
  data,
  recordStatus = "COMPLETED",
  onPress,
  onChange,
  onEditPress,
  onDeletePress,
  onCompletePress,
}: Props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const menuButtonRef = useRef<any>(null);

  const fieldRows: { label: string; key: keyof DetailData }[][] =
    recordStatus === "ONGOING"
      ? [
          [{ label: "증권사", key: "증권사" }],
          [
            { label: "청약 수량", key: "청약수량" },
            { label: "공모가", key: "공모가" },
          ],
        ]
      : [
          [
            { label: "증권사", key: "증권사" },
            { label: "매도일", key: "매도일" },
          ],
          [
            { label: "청약 수량", key: "청약수량" },
            { label: "수수료", key: "수수료" },
          ],
          [
            { label: "배정 수량", key: "배정수량" },
            { label: "제세금", key: "제세금" },
          ],
          [
            { label: "공모가", key: "공모가" },
            { label: "매도가", key: "매도가" },
          ],
        ];

  const handleMenuPress = () => {
    menuButtonRef.current?.measure(
      (
        _fx: number,
        _fy: number,
        _w: number,
        h: number,
        _px: number,
        py: number,
      ) => {
        setMenuPosition({ top: py + h, right: spacing.contentArea });
        setMenuVisible(true);
      },
    );
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.card,
          isOpen && styles.cardOpen,
          recordStatus === "COMPLETED" && styles.cardCompleted,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.itemHeader}>
          <View style={styles.itemLeft}>
            <View
              style={[
                styles.dot,
                recordStatus === "ONGOING" && styles.dotOngoing,
              ]}
            />
            <Text style={styles.itemName}>{name}</Text>
            {favorite && <StarIcon width={16} height={16} />}
          </View>
          <View style={styles.itemRight}>
            <TouchableOpacity
              ref={menuButtonRef}
              onPress={(e) => {
                e.stopPropagation();
                handleMenuPress();
              }}
              hitSlop={8}
              style={styles.menuButton}
            >
              <Text style={styles.menuDots}>···</Text>
            </TouchableOpacity>
            <Ionicons
              name={isOpen ? "chevron-up" : "chevron-down"}
              size={20}
              color={colors.gray500}
            />
          </View>
        </View>

        {isOpen && (
          <View style={styles.detailContainer}>
            {fieldRows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.detailRow}>
                {row.map((field, fieldIndex) => (
                  <View
                    key={field.key}
                    style={[
                      styles.detailBox,
                      fieldIndex < row.length - 1 && styles.detailBoxGap,
                    ]}
                  >
                    <Text style={styles.detailLabel}>{field.label}</Text>
                    <TextInput
                      style={styles.detailValue}
                      value={formatDisplayValue(field.key, data[field.key])}
                      editable={false}
                      placeholder="-"
                      placeholderTextColor={colors.gray300}
                    />
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>

      {/* 드롭다운 메뉴 */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={StyleSheet.absoluteFill}>
            <View
              style={[
                styles.dropdown,
                { top: menuPosition.top, right: menuPosition.right },
              ]}
            >
              {recordStatus === "ONGOING" && (
                <>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setMenuVisible(false);
                      onCompletePress?.(id);
                    }}
                  >
                    <Text style={[styles.dropdownText, styles.completeText]}>
                      완료 처리
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.dropdownDivider} />
                </>
              )}
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setMenuVisible(false);
                  onEditPress(id);
                }}
              >
                <Text style={styles.dropdownText}>수정</Text>
              </TouchableOpacity>
              <View style={styles.dropdownDivider} />
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setMenuVisible(false);
                  onDeletePress(id);
                }}
              >
                <Text style={[styles.dropdownText, styles.deleteText]}>
                  삭제
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.contentArea,
    marginBottom: spacing.xs,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gray200,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
  },
  cardOpen: {
    borderColor: colors.gray200,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    flex: 1,
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.calender.refundSlate,
  },
  dotOngoing: {
    backgroundColor: colors.calender.listingGreen,
  },
  completeText: {
    color: colors.primary600,
  },
  itemName: {
    ...typography.bodyMedium11,
    color: colors.gray500,
  },
  menuButton: {
    paddingHorizontal: 4,
  },
  menuDots: {
    fontSize: 20,
    color: colors.gray500,
    letterSpacing: 2,
    lineHeight: 22,
  },
  detailContainer: {
    marginTop: spacing.md,
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
  },
  detailBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.white,
    gap: 6,
  },
  detailBoxGap: {
    marginRight: 8,
  },
  detailLabel: {
    ...typography.bodyRegular10,
    color: colors.gray500,
  },
  detailValue: {
    ...typography.subtitleMedium14,
    color: colors.gray700,
    padding: 0,
    minHeight: 24,
  },
  // 드롭다운
  dropdown: {
    position: "absolute",
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    minWidth: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "flex-start",
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: colors.gray200,
  },
  dropdownText: {
    ...typography.bodyRegular10,
    color: colors.gray400,
  },
  deleteText: {
    color: "#EF4444",
  },
  cardCompleted: {
    backgroundColor: colors.gray100,
  },
});
