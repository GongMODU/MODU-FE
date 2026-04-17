import StarIcon from "@/assets/images/Star2.svg";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PAST_HISTORY = [
  { id: "1", name: "리센스메디컬", favorite: true },
  { id: "2", name: "신한제17호기업인수목적", favorite: false },
  { id: "3", name: "교보20호기업인수목적", favorite: true },
  { id: "4", name: "공쫀쿠20호기업인수목적", favorite: false },
];

const CURRENT_HISTORY = [
  { id: "c1", name: "공공" },
  { id: "c2", name: "쫀쫀" },
  { id: "c3", name: "쿠쿠" },
];

type DetailData = {
  증권사: string;
  매도일: string;
  청약수량: string;
  수수료: string;
  배정수량: string;
  제세금: string;
  매도가: string;
};

const INITIAL_DETAIL: DetailData = {
  증권사: "",
  매도일: "",
  청약수량: "",
  수수료: "",
  배정수량: "",
  제세금: "",
  매도가: "",
};

const GONGJONKU_DETAIL: DetailData = {
  증권사: "신한투자증권",
  매도일: "04.28",
  청약수량: "30주",
  수수료: "2,490원",
  배정수량: "20주",
  제세금: "24,900원",
  매도가: "42,900원",
};

export default function HistoryScreen() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<Record<string, DetailData>>({
    "1": { ...INITIAL_DETAIL },
    "2": { ...INITIAL_DETAIL },
    "3": { ...INITIAL_DETAIL },
    "4": { ...GONGJONKU_DETAIL },
    c1: { ...INITIAL_DETAIL },
    c2: { ...INITIAL_DETAIL },
    c3: { ...INITIAL_DETAIL },
  });

  const handleChange = (id: string, field: keyof DetailData, value: string) => {
    setDetailData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const renderDetailBox = (id: string, isWhite: boolean) => {
    const data = detailData[id];
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
      <View style={styles.detailContainer}>
        {fields.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={[
              styles.detailRow,
              !isWhite && { borderColor: "rgba(255,255,255,0.2)" },
            ]}
          >
            {row.map((field) => (
              <View key={field.key} style={styles.detailItem}>
                <Text
                  style={[
                    styles.detailLabel,
                    !isWhite && { color: "rgba(255,255,255,0.7)" },
                  ]}
                >
                  {field.label}
                </Text>
                <TextInput
                  style={[styles.detailValue, !isWhite && { color: "#fff" }]}
                  value={data[field.key]}
                  onChangeText={(value) => handleChange(id, field.key, value)}
                  placeholder="-"
                  placeholderTextColor={
                    isWhite ? "#ccc" : "rgba(255,255,255,0.4)"
                  }
                />
              </View>
            ))}
            {row.length === 1 && <View style={styles.detailItem} />}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.pageTitle}>청약 이력</Text>

        {/* 과거 투자 이력 */}
        {PAST_HISTORY.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.pastItem, openId === item.id && styles.pastItemOpen]}
            onPress={() => setOpenId(openId === item.id ? null : item.id)}
            activeOpacity={0.8}
          >
            <View style={styles.itemHeader}>
              <View style={styles.itemLeft}>
                <View style={styles.dot} />
                <Text style={styles.itemName}>{item.name}</Text>
                {item.favorite && <StarIcon width={16} height={16} />}
              </View>
              <Ionicons
                name={openId === item.id ? "chevron-up" : "chevron-down"}
                size={20}
                color="#999"
              />
            </View>
            {openId === item.id && renderDetailBox(item.id, true)}
          </TouchableOpacity>
        ))}

        {/* 현재 청약 중 */}
        {CURRENT_HISTORY.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.currentItem}
            onPress={() => setOpenId(openId === item.id ? null : item.id)}
            activeOpacity={0.8}
          >
            <View style={styles.itemHeader}>
              <View style={styles.itemLeft}>
                <View style={[styles.dot, { backgroundColor: "#fff" }]} />
                <Text style={[styles.itemName, { color: "#fff" }]}>
                  {item.name}
                </Text>
              </View>
              <Ionicons
                name={openId === item.id ? "chevron-up" : "chevron-down"}
                size={20}
                color="#fff"
              />
            </View>
            {openId === item.id && renderDetailBox(item.id, false)}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 20,
  },
  pastItem: {
    marginHorizontal: 24,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: "#fff",
  },
  pastItemOpen: {
    borderColor: "#ccc",
  },
  currentItem: {
    marginHorizontal: 24,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: "#b0b0b0",
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#b0b0b0",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  detailContainer: {
    marginTop: 16,
    gap: 0,
  },
  detailRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
    paddingVertical: 12,
  },
  detailItem: {
    flex: 1,
    paddingHorizontal: 12,
    gap: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: "#999",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    padding: 0,
    minHeight: 24,
  },
});
