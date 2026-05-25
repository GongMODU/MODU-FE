import { colors, spacing, typography } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import {
    Dimensions,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { DetailData } from "./HistoryCard";

const { height: SCREEN_HEIGHT } = Dimensions.get("screen");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.9;

type Props = {
  visible: boolean;
  name: string;
  data: DetailData;
  onClose: () => void;
  onSave: (data: DetailData) => void;
  onChange: (field: keyof DetailData, value: string) => void;
  onNameChange: (value: string) => void;
  mode?: "add" | "edit";
};

export default function EditModal({
  visible,
  name,
  data,
  onClose,
  onSave,
  onChange,
  onNameChange,
  mode = "edit",
}: Props) {
  const fieldRows: { label: string; key: keyof DetailData }[][] = [
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
    [{ label: "매도가", key: "매도가" }],
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* 배경 터치시 닫기 */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.sheet}>
          {/* 핸들 + 닫기 버튼 */}
          <View style={styles.topArea}>
            <View style={styles.handle} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={8}
            >
              <Ionicons name="close" size={20} color={colors.gray400} />
            </TouchableOpacity>
          </View>

          {/* 타이틀 */}
          <View style={styles.titleArea}>
            <Text style={styles.title}>{mode === "add" ? "청약 이력 추가" : "청약 이력 수정"}</Text>
          </View>

          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* 종목명 - 수정 가능 */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>종목명</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.inputText}
                  value={name}
                  onChangeText={onNameChange}
                  placeholder="종목명 입력"
                  placeholderTextColor={colors.gray300}
                />
              </View>
            </View>

            {/* 2열 필드들 */}
            {fieldRows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.fieldRow}>
                {row.map((field, fieldIndex) => (
                  <View
                    key={field.key}
                    style={[
                      styles.fieldGroup,
                      styles.fieldFlex,
                      fieldIndex < row.length - 1 && styles.fieldRowGap,
                    ]}
                  >
                    <Text style={styles.fieldLabel}>{field.label}</Text>
                    <View style={styles.inputBox}>
                      <TextInput
                        style={styles.inputText}
                        value={data[field.key]}
                        onChangeText={(value) => onChange(field.key, value)}
                        placeholder="-"
                        placeholderTextColor={colors.gray300}
                      />
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>

          {/* 저장 버튼 */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => onSave(data)}
            activeOpacity={0.85}
          >
            <Text style={styles.saveButtonText}>{mode === "add" ? "추가하기" : "수정하기"}</Text>
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
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.contentArea,
    paddingBottom: spacing.sm,
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
  fieldRowGap: {
    marginRight: spacing.sm,
  },
  fieldLabel: {
    ...typography.bodyMedium11,
    color: colors.gray500,
    marginBottom: 6,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    justifyContent: "center",
    height: 46,
  },
  inputText: {
    ...typography.bodyMedium11,
    color: colors.gray500,
    padding: 0,
  },
  saveButton: {
    marginHorizontal: spacing.contentArea,
    marginTop: spacing.sm,
    marginBottom: Platform.OS === "ios" ? 34 : 24,
    borderRadius: 10,
    backgroundColor: colors.primary600,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    ...typography.footerBold12,
    color: colors.primary50,
  },
});
