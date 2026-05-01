import { colors, spacing, typography } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { DetailData } from "./HistoryCard";

type Props = {
  id: string;
  name: string;
  isOpen: boolean;
  data: DetailData;
  onPress: () => void;
  onChange: (id: string, field: keyof DetailData, value: string) => void;
};

export default function CurrentCard({
  id,
  name,
  isOpen,
  data,
  onPress,
  onChange,
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
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.itemHeader}>
        <View style={styles.itemLeft}>
          <View style={styles.dot} />
          <Text style={styles.itemName}>{name}</Text>
        </View>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.gray500}
        />
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
                    value={data[field.key]}
                    onChangeText={(value) => onChange(id, field.key, value)}
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
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.contentArea,
    marginBottom: spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    backgroundColor: colors.gray100,
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
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray500,
  },
  itemName: {
    ...typography.subtitleMedium14,
    color: colors.gray500,
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
});
