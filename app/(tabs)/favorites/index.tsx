import { colors, spacing, typography } from "@/styles";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FavoriteCard from "./_components/FavoriteCard";
import FavoriteInfoCard from "./_components/FavoriteInfoCard";

// ─── 타입 ────────────────────────────────────────────────────
export type FavoriteItem = {
  id: string;
  name: string;
  subscriptionStartDate: string;
  offeringPrice: string;
  brokers: string[];
};

// ─── Mock 데이터 (나중에 API로 교체) ─────────────────────────
const MOCK_DATA: FavoriteItem[] = [
  {
    id: "1",
    name: "키움히어로제2호기업인수목적",
    subscriptionStartDate: "04/14(화)",
    offeringPrice: "2,000~2,000원",
    brokers: ["신한투자증권"],
  },
  {
    id: "2",
    name: "키움히어로제2호기업인수목적",
    subscriptionStartDate: "04/14(화)",
    offeringPrice: "2,000~2,000원",
    brokers: [
      "신한투자증권",
      "유진투자증권",
      "NH투자증권",
      "미래에셋",
      "KB증권",
    ],
  },
  {
    id: "3",
    name: "키움히어로제2호기업인수목적",
    subscriptionStartDate: "04/14(화)",
    offeringPrice: "2,000~2,000원",
    brokers: ["신한투자증권"],
  },
  {
    id: "4",
    name: "키움히어로제2호기업인수목적",
    subscriptionStartDate: "04/14(화)",
    offeringPrice: "2,000~2,000원",
    brokers: ["신한투자증권", "NH투자증권"],
  },
  {
    id: "5",
    name: "키움히어로제2호기업인수목적",
    subscriptionStartDate: "04/14(화)",
    offeringPrice: "2,000~2,000원",
    brokers: ["신한투자증권"],
  },
];

// ─── 메인 화면 ───────────────────────────────────────────────
export default function FavoritesScreen() {
  const [infoVisible, setInfoVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>관심 공모주</Text>
        <TouchableOpacity onPress={() => setInfoVisible((v) => !v)}>
          <Text style={styles.infoIcon}>ⓘ</Text>
        </TouchableOpacity>
      </View>

      {/* 안내 카드 */}
      {infoVisible && (
        <FavoriteInfoCard onClose={() => setInfoVisible(false)} />
      )}

      {/* 카드 리스트 */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_DATA.map((item) => (
          <FavoriteCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.safeArea,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.largeTitleMedium20,
    color: colors.gray800,
  },
  infoIcon: {
    fontSize: 17,
    color: colors.gray400,
  },
  listContent: {
    paddingHorizontal: spacing.safeArea,
    paddingBottom: spacing.md,
    gap: 12,
  },
});
