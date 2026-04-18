import { colors, spacing, typography } from "@/styles";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CurrentCard from "./_components/CurrentCard";
import HistoryCard, { DetailData } from "./_components/HistoryCard";

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.pageTitle}>청약 이력</Text>

          {PAST_HISTORY.map((item) => (
            <HistoryCard
              key={item.id}
              id={item.id}
              name={item.name}
              favorite={item.favorite}
              isOpen={openId === item.id}
              data={detailData[item.id]}
              onPress={() => setOpenId(openId === item.id ? null : item.id)}
              onChange={handleChange}
            />
          ))}

          {CURRENT_HISTORY.map((item) => (
            <CurrentCard
              key={item.id}
              id={item.id}
              name={item.name}
              isOpen={openId === item.id}
              data={detailData[item.id]}
              onPress={() => setOpenId(openId === item.id ? null : item.id)}
              onChange={handleChange}
            />
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
  },
  pageTitle: {
    ...typography.largeTitleMedium20,
    color: colors.gray800,
    paddingHorizontal: spacing.contentArea,
    paddingTop: 72,
    paddingBottom: spacing.lg,
  },
});
