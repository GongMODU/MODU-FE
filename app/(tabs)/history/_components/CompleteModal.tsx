import { colors, spacing, typography } from "@/styles";
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
import type { CompleteHistoryRequest } from "@/types/subscriptionHistory";

const { height: SCREEN_HEIGHT } = Dimensions.get("screen");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.55;

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

  const parseNum = (val: string): number | undefined => {
    const n = Number(val.replace(/[^0-9.-]/g, ""));
    return val.trim() === "" || isNaN(n) ? undefined : n;
  };

  const handleComplete = () => {
    const price = parseNum(sellPrice);
    if (!price || !sellDate.trim()) return;
    onComplete({
      sellPrice: price,
      sellDate: sellDate.trim(),
      fee: parseNum(fee),
      tax: parseNum(tax),
    });
    setSellPrice("");
    setSellDate("");
    setFee("");
    setTax("");
  };

  const handleClose = () => {
    setSellPrice("");
    setSellDate("");
    setFee("");
    setTax("");
    onClose();
  };

  const isValid = sellPrice.trim() !== "" && sellDate.trim() !== "";

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View style={styles.sheet}>
          <View style={styles.topArea}>
            <View style={styles.handle} />
            <TouchableOpacity style={styles.closeButton} onPress={handleClose} hitSlop={8}>
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

            <View style={styles.fieldRow}>
              <View style={[styles.fieldGroup, styles.fieldFlex, { marginRight: spacing.sm }]}>
                <Text style={styles.fieldLabel}>수수료</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    style={styles.inputText}
                    value={fee}
                    onChangeText={setFee}
                    placeholder="-"
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
                    placeholder="-"
                    placeholderTextColor={colors.gray300}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.completeButton, !isValid && styles.completeButtonDisabled]}
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
    top: 8,
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
    flex: 1,
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
