import { colors, spacing, typography } from "@/styles";
import type { CompleteHistoryRequest } from "@/types/subscriptionHistory";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("screen");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.9;

type Props = {
  visible: boolean;
  onClose: () => void;
  onComplete: (data: CompleteHistoryRequest) => void;
};

export default function CompleteModal({ visible, onClose, onComplete }: Props) {
  const [sellPrice, setSellPrice] = useState("");
  const [sellDate, setSellDate] = useState("");
  const [fee, setFee] = useState("");
  const [tax, setTax] = useState("");
  const [allocatedQuantity, setAllocatedQuantity] = useState("");

  const parseNum = (val: string): number | undefined => {
    const n = Number(val.replace(/[^0-9.-]/g, ""));
    return val.trim() === "" || isNaN(n) ? undefined : n;
  };

  const parseDate = (val: string): string | undefined => {
    if (!val.trim()) return undefined;
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    const parts = val
      .replace(/[./]/g, "-")
      .split("-")
      .map((p) => p.trim());
    let year: number, month: number, day: number;
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        [year, month, day] = parts.map(Number);
      } else {
        year = 2000 + Number(parts[0]);
        [, month, day] = parts.map(Number);
      }
    } else if (parts.length === 2) {
      year = new Date().getFullYear();
      [month, day] = parts.map(Number);
    } else {
      return undefined;
    }
    if (isNaN(year) || isNaN(month) || isNaN(day)) return undefined;
    if (month < 1 || month > 12 || day < 1 || day > 31) return undefined;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const handleComplete = () => {
    const price = parseNum(sellPrice);
    const date = parseDate(sellDate);
    if (!price || !date) return;
    onComplete({
      sellPrice: price,
      sellDate: date,
      fee: parseNum(fee),
      tax: parseNum(tax),
      allocatedQuantity: parseNum(allocatedQuantity),
    });
    setSellPrice("");
    setSellDate("");
    setFee("");
    setTax("");
    setAllocatedQuantity("");
  };

  const handleClose = () => {
    setSellPrice("");
    setSellDate("");
    setFee("");
    setTax("");
    setAllocatedQuantity("");
    onClose();
  };

  const isValid = sellPrice.trim() !== "" && sellDate.trim() !== "";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View style={styles.sheet}>
          <View style={styles.topArea}>
            <View style={styles.handle} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              hitSlop={8}
            >
              <Ionicons name="close" size={20} color={colors.gray400} />
            </TouchableOpacity>
          </View>

          <View style={styles.titleArea}>
            <Text style={styles.title}>청약 완료 처리</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                매도가 <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.inputText}
                  value={sellPrice}
                  onChangeText={setSellPrice}
                  placeholder="매도 단가 입력"
                  placeholderTextColor={colors.gray300}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                매도일 <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.inputText}
                  value={sellDate}
                  onChangeText={setSellDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.gray300}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                배정 수량 <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.inputText}
                  value={allocatedQuantity}
                  onChangeText={setAllocatedQuantity}
                  placeholder="배정 수량 입력"
                  placeholderTextColor={colors.gray300}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.fieldRow}>
              <View
                style={[
                  styles.fieldGroup,
                  styles.fieldFlex,
                  { marginRight: spacing.sm },
                ]}
              >
                <Text style={styles.fieldLabel}>수수료</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    style={styles.inputText}
                    value={fee}
                    onChangeText={setFee}
                    placeholder="수수료 입력"
                    placeholderTextColor={colors.gray300}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View style={[styles.fieldGroup, styles.fieldFlex]}>
                <Text style={styles.fieldLabel}>제세금</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    style={styles.inputText}
                    value={tax}
                    onChangeText={setTax}
                    placeholder="제세금 입력"
                    placeholderTextColor={colors.gray300}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.completeButton,
              !isValid && styles.completeButtonDisabled,
            ]}
            onPress={handleComplete}
            activeOpacity={0.85}
            disabled={!isValid}
          >
            <Text style={styles.completeButtonText}>완료하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    position: "absolute",
    top: SCREEN_HEIGHT - SHEET_HEIGHT,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  topArea: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 62,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray400,
  },
  closeButton: {
    position: "absolute",
    right: spacing.contentArea,
    top: 44,
  },
  titleArea: {
    paddingHorizontal: spacing.contentArea,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.subtitleMedium14,
    color: colors.gray600,
  },
  content: {
    paddingHorizontal: spacing.contentArea,
  },
  fieldGroup: {
    marginBottom: spacing.sm,
  },
  fieldFlex: {
    flex: 1,
  },
  fieldRow: {
    flexDirection: "row",
  },
  fieldLabel: {
    ...typography.bodyMedium11,
    color: colors.gray500,
    marginBottom: 6,
  },
  required: {
    color: colors.primary600,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    height: 46,
    backgroundColor: colors.white,
    justifyContent: "center",
  },
  inputText: {
    ...typography.bodyMedium11,
    color: colors.gray500,
    padding: 0,
  },
  completeButton: {
    marginHorizontal: spacing.contentArea,
    marginTop: spacing.sm,
    marginBottom: Platform.OS === "ios" ? 34 : 24,
    borderRadius: 10,
    backgroundColor: colors.primary600,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  completeButtonDisabled: {
    backgroundColor: colors.gray300,
  },
  completeButtonText: {
    ...typography.footerBold12,
    color: colors.primary50,
  },
});
