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
  const fields: { label: string; key: keyof DetailData }[][] = [
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
          color={colors.white}
        />
      </View>

      {isOpen && (
        <View style={styles.detailContainer}>
          {fields.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.detailRow}>
              {row.map((field) => (
                <View key={field.key} style={styles.detailItem}>
                  <Text style={styles.detailLabel}>{field.label}</Text>
                  <TextInput
                    style={styles.detailValue}
                    value={data[field.key]}
                    onChangeText={(value) => onChange(id, field.key, value)}
                    placeholder="-"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                  />
                </View>
              ))}
              {row.length === 1 && <View style={styles.detailItem} />}
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
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    backgroundColor: colors.gray300,
    borderWidth: 1,
    borderColor: colors.gray300,
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
    backgroundColor: colors.white,
  },
  itemName: {
    ...typography.subtitleMedium14,
    color: colors.white,
  },
  detailContainer: {
    marginTop: spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    paddingVertical: spacing.sm,
  },
  detailItem: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    gap: 6,
  },
  detailLabel: {
    ...typography.bodyRegular10,
    color: "rgba(255,255,255,0.7)",
  },
  detailValue: {
    ...typography.subtitleMedium14,
    color: colors.white,
    padding: 0,
    minHeight: 24,
  },
});
