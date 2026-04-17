import { colors, spacing, typography } from "@/styles";
import { useRef, useState } from "react";
import {
  Modal,
  Pressable,
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
  const [infoCardTop, setInfoCardTop] = useState(0);
  const infoButtonRef = useRef<View>(null);

  const handleInfoPress = () => {
    infoButtonRef.current?.measure((_x, _y, _width, height, _pageX, pageY) => {
      setInfoCardTop(pageY + height - 13);
      setInfoVisible((v) => !v);
    });
  }; // 인포 버튼 아래 어디에 인포 카드가 보여지는지

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>관심 공모주</Text>
          <TouchableOpacity ref={infoButtonRef} onPress={handleInfoPress}>
            <Text style={styles.infoIcon}>ⓘ</Text>
          </TouchableOpacity>
        </View>

        {MOCK_DATA.map((item) => (
          <FavoriteCard key={item.id} item={item} />
        ))}
      </ScrollView>

      {/* 안내 카드 */}
      {infoVisible && (
        <Modal
          transparent
          animationType="none"
          onRequestClose={() => setInfoVisible(false)}
        >
          <Pressable
            style={styles.overlay}
            onPress={() => setInfoVisible(false)}
          >
            <FavoriteInfoCard top={infoCardTop} />
          </Pressable>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContent: {
    paddingHorizontal: spacing.contentArea,
    paddingTop: 72,
    paddingBottom: 60,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    ...typography.largeTitleMedium20,
    color: colors.gray800,
  },
  infoIcon: {
    fontSize: 17,
    color: colors.gray400,
  },
  overlay: {
    flex: 1,
  },
});
