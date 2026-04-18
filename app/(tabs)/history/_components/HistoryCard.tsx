import StarIcon from "@/assets/images/Star2.svg";
import { colors, spacing, typography } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export type DetailData = {
  증권사: string;
  매도일: string;
  청약수량: string;
  수수료: string;
  배정수량: string;
  제세금: string;
  매도가: string;
};

type Props = {
  id: string;
  name: string;
  favorite: boolean;
  isOpen: boolean;
  data: DetailData;
  onPress: () => void;
  onChange: (id: string, field: keyof DetailData, value: string) => void;
};

export default function HistoryCard({
  id,
  name,
  favorite,
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
    <TouchableOpacity
      style={[styles.card, isOpen && styles.cardOpen]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.itemHeader}>
        <View style={styles.itemLeft}>
          <View style={styles.dot} />
          <Text style={styles.itemName}>{name}</Text>
          {favorite && <StarIcon width={16} height={16} />}
        </View>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.gray400}
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
                    placeholderTextColor={colors.gray300}
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
    borderWidth: 1,
    borderColor: colors.gray200,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    backgroundColor: colors.white,
  },
  cardOpen: {
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
    backgroundColor: colors.gray300,
  },
  itemName: {
    ...typography.subtitleMedium14,
    color: colors.gray800,
  },
  detailContainer: {
    marginTop: spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: colors.gray100,
    paddingVertical: spacing.sm,
  },
  detailItem: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    gap: 6,
  },
  detailLabel: {
    ...typography.bodyRegular10,
    color: colors.gray400,
  },
  detailValue: {
    ...typography.subtitleMedium14,
    color: colors.gray800,
    padding: 0,
    minHeight: 24,
  },
});
