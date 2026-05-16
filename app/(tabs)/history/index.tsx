import { colors, spacing, typography } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CurrentCard from "./_components/CurrentCard";
import EditModal from "./_components/EditModal";
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
  const [editId, setEditId] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<Record<string, DetailData>>({
    "1": { ...INITIAL_DETAIL },
    "2": { ...INITIAL_DETAIL },
    "3": { ...INITIAL_DETAIL },
    "4": { ...GONGJONKU_DETAIL },
    c1: { ...INITIAL_DETAIL },
    c2: { ...INITIAL_DETAIL },
    c3: { ...INITIAL_DETAIL },
  });
  // 모달 임시 데이터 (수정하기 누르기 전까지 원본 유지)
  const [draftData, setDraftData] = useState<DetailData | null>(null);
  const [draftName, setDraftName] = useState<string>("");

  const handleChange = (id: string, field: keyof DetailData, value: string) => {
    setDetailData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleModalChange = (field: keyof DetailData, value: string) => {
    setDraftData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleEditPress = (id: string) => {
    const item = [...PAST_HISTORY, ...CURRENT_HISTORY].find((i) => i.id === id);
    setDraftName(item?.name ?? "");
    setDraftData({ ...detailData[id] });
    setEditId(id);
  };

  const handleSave = (data: DetailData) => {
    if (editId) {
      setDetailData((prev) => ({ ...prev, [editId]: data }));
    }
    setEditId(null);
    setDraftData(null);
  };

  const handleCloseModal = () => {
    setEditId(null);
    setDraftData(null);
    setDraftName("");
  };

  const handleDeletePress = (id: string) => {
    // TODO: 삭제 확인 다이얼로그 추가 가능
    console.log("delete", id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* 페이지 타이틀 + + 버튼 */}
          <View style={styles.titleRow}>
            <Text style={styles.pageTitle}>청약 이력</Text>
            <TouchableOpacity style={styles.addButton} hitSlop={8}>
              <Ionicons name="add" size={20} color={colors.gray400} />
            </TouchableOpacity>
          </View>

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
              onEditPress={handleEditPress}
              onDeletePress={handleDeletePress}
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
              onEditPress={handleEditPress}
              onDeletePress={handleDeletePress}
            />
          ))}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 수정 모달 */}
      {editId && draftData && (
        <EditModal
          visible={true}
          name={draftName}
          data={draftData}
          onClose={handleCloseModal}
          onSave={handleSave}
          onChange={handleModalChange}
          onNameChange={setDraftName}
        />
      )}
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
  scrollContent: {
    paddingTop: 72,
    paddingBottom: spacing.xl,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.contentArea,
    paddingBottom: spacing.lg,
  },
  pageTitle: {
    ...typography.largeTitleMedium20,
    color: colors.gray800,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray400,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
});
