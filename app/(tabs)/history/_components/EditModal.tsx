import { searchIpo } from "@/lib/api/ipo";
import { colors, spacing, typography } from "@/styles";
import type { IpoSearchItem } from "@/types/ipo";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
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
  onSave: (data: DetailData, ipoEventId?: number) => void;
  onChange: (field: keyof DetailData, value: string) => void;
  onNameChange: (value: string) => void;
  mode?: "add" | "edit";
  recordStatus?: "ONGOING" | "COMPLETED";
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
  recordStatus,
}: Props) {
  const fieldRows: {
    label: string;
    key: keyof DetailData;
    placeholder: string;
  }[][] = [
    [
      { label: "증권사", key: "증권사", placeholder: "증권사 입력" },
      { label: "매도일", key: "매도일", placeholder: "YYYY-MM-DD" },
    ],
    [
      { label: "배정 수량", key: "배정수량", placeholder: "배정 수량 입력" },
      { label: "청약 수량", key: "청약수량", placeholder: "청약 수량 입력" },
    ],
    [{ label: "공모가", key: "공모가", placeholder: "공모가 입력" }],
    [{ label: "매도가", key: "매도가", placeholder: "매도 단가 입력" }],
    [
      { label: "수수료", key: "수수료", placeholder: "수수료 입력" },
      { label: "제세금", key: "제세금", placeholder: "제세금 입력" },
    ],
  ];

  const numericFields: (keyof DetailData)[] = [
    "배정수량",
    "청약수량",
    "공모가",
    "매도가",
    "수수료",
    "제세금",
  ];

  const [searchResults, setSearchResults] = useState<IpoSearchItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIpoEventId, setSelectedIpoEventId] = useState<
    number | undefined
  >(undefined);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOngoing =
    recordStatus === "ONGOING" || selectedIpoEventId !== undefined;

  const filteredFieldRows: {
    label: string;
    key: keyof DetailData;
    placeholder: string;
  }[][] = isOngoing
    ? [
        [{ label: "증권사", key: "증권사", placeholder: "증권사 입력" }],
        [
          {
            label: "청약 수량",
            key: "청약수량",
            placeholder: "청약 수량 입력",
          },
          { label: "공모가", key: "공모가", placeholder: "공모가 입력" },
        ],
      ]
    : fieldRows;

  useEffect(() => {
    if (!visible) {
      setSearchResults([]);
      setShowDropdown(false);
      setSelectedIpoEventId(undefined);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    }
  }, [visible]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const handleNameChange = useCallback(
    (text: string) => {
      onNameChange(text);
      if (mode !== "add") return;
      setSelectedIpoEventId(undefined);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (text.trim().length === 0) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }
      debounceTimer.current = setTimeout(async () => {
        try {
          const res = await searchIpo(text.trim());
          setSearchResults(res.data);
          setShowDropdown(res.data.length > 0);
        } catch {
          setSearchResults([]);
          setShowDropdown(false);
        }
      }, 300);
    },
    [onNameChange, mode],
  );

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
            <Text style={styles.title}>
              {mode === "add" ? "청약 이력 추가" : "청약 이력 수정"}
            </Text>
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
                  onChangeText={handleNameChange}
                  placeholder="종목명 입력"
                  placeholderTextColor={colors.gray300}
                />
              </View>
              {mode === "add" && showDropdown && (
                <View style={styles.dropdown}>
                  {searchResults.map((item) => (
                    <TouchableOpacity
                      key={item.ipoEventId}
                      style={styles.dropdownItem}
                      onPress={() => {
                        onNameChange(item.companyName);
                        setSelectedIpoEventId(item.ipoEventId);
                        setShowDropdown(false);
                        setSearchResults([]);
                      }}
                    >
                      <Text style={styles.dropdownText}>
                        {item.companyName}
                      </Text>
                      <Text style={styles.dropdownSub}>
                        {item.subscriptionStartDate} ~{" "}
                        {item.subscriptionEndDate}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* 2열 필드들 */}
            {filteredFieldRows.map((row, rowIndex) => (
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
                        placeholder={field.placeholder}
                        placeholderTextColor={colors.gray300}
                        keyboardType={
                          numericFields.includes(field.key)
                            ? "numeric"
                            : "default"
                        }
                      />
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>

          {/* 저장 버튼 */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              mode === "add" && !name.trim() && styles.saveButtonDisabled,
            ]}
            onPress={() => onSave(data, selectedIpoEventId)}
            activeOpacity={0.85}
            disabled={mode === "add" && !name.trim()}
          >
            <Text style={styles.saveButtonText}>
              {mode === "add" ? "추가하기" : "수정하기"}
            </Text>
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
    top: 22,
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
    paddingBottom: 120,
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
    backgroundColor: colors.white,
    justifyContent: "center",
    height: 46,
  },
  inputText: {
    ...typography.bodyMedium11,
    color: colors.gray500,
    padding: 0,
    flex: 1,
    textAlignVertical: "center",
  },
  saveButton: {
    position: "absolute",
    bottom: 100,
    left: spacing.contentArea,
    right: spacing.contentArea,
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
  dropdown: {
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 10,
    backgroundColor: colors.white,
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 100,
  },
  dropdownItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    gap: 2,
  },
  dropdownText: {
    ...typography.bodyMedium11,
    color: colors.gray700,
  },
  dropdownSub: {
    ...typography.captionRegular9,
    color: colors.gray400,
  },
  saveButtonDisabled: {
    backgroundColor: colors.gray300,
  },
});
