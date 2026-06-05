import { withdraw } from "@/lib/api/mypage";
import { tokenStore } from "@/lib/tokenStore";
import { colors, spacing, typography } from "@/styles";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InvestmentCard from "./_components/InvestmentCard";
import MenuList from "./_components/MenuList";
import ProfileCard from "./_components/ProfileCard";
import { mypageHomeOptions } from "./_components/queries";

export default function MypageScreen() {
  const { data, isLoading, isError } = useQuery(mypageHomeOptions());
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [withdrawPassword, setWithdrawPassword] = useState("");

  const handleWithdraw = () => {
    if (!data) return;
    if (data.provider === "LOCAL") {
      setWithdrawPassword("");
      setWithdrawModalVisible(true);
    } else {
      Alert.alert("회원탈퇴", "정말 탈퇴하시겠어요?", [
        { text: "취소", style: "cancel" },
        {
          text: "탈퇴",
          style: "destructive",
          onPress: async () => {
            try {
              await withdraw("");
            } catch {
              Alert.alert("오류", "탈퇴 처리 중 문제가 발생했습니다.");
              return;
            }
            tokenStore.clear();
            router.replace("/onboarding");
          },
        },
      ]);
    }
  };

  const handleWithdrawConfirm = async () => {
    try {
      await withdraw(withdrawPassword);
    } catch {
      Alert.alert("오류", "비밀번호가 올바르지 않습니다.");
      return;
    }
    setWithdrawModalVisible(false);
    tokenStore.clear();
    router.replace("/onboarding");
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ActivityIndicator style={styles.loader} color={colors.primary600} />
      </SafeAreaView>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            정보를 불러오지 못했습니다. 다시 시도해주세요.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>내 프로필</Text>
        <ProfileCard
          nickname={data.nickname}
          email={data.email}
          provider={data.provider}
          personaCode={data.investmentProfile.personaCode}
        />

        <Text style={styles.investmentTitle}>나의 투자 성향</Text>
        <InvestmentCard personaCode={data.investmentProfile.personaCode} />

        <MenuList />
        <TouchableOpacity
          onPress={handleWithdraw}
          style={styles.withdrawButton}
        >
          <Text style={styles.withdrawText}>회원탈퇴</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        visible={withdrawModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setWithdrawModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setWithdrawModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalCard}
            activeOpacity={1}
            onPress={() => {}}
          >
            <Text style={styles.modalTitle}>회원탈퇴</Text>
            <Text style={styles.modalDesc}>
              탈퇴하시려면 비밀번호를 입력해주세요.
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="비밀번호"
              placeholderTextColor={colors.gray400}
              secureTextEntry
              value={withdrawPassword}
              onChangeText={(text: string) => setWithdrawPassword(text)}
              autoCapitalize="none"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setWithdrawModalVisible(false)}
              >
                <Text style={styles.modalButtonCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleWithdrawConfirm}
              >
                <Text style={styles.modalButtonConfirmText}>탈퇴</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.contentArea,
    paddingTop: 72,
    paddingBottom: 60,
    gap: 12,
  },
  sectionTitle: {
    ...typography.largeTitleMedium20,
    color: colors.gray900,
    marginBottom: 4,
  },
  investmentTitle: {
    ...typography.subtitleMedium14,
    color: colors.gray900,
    marginBottom: 8,
  },
  loader: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.contentArea,
  },
  errorText: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: "center",
  },
  withdrawButton: {
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  withdrawText: {
    ...typography.bodyMedium11,
    color: colors.gray400,
    textDecorationLine: "underline",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "85%",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    gap: spacing.md,
  },
  modalTitle: {
    ...typography.largeTitleMedium20,
    color: colors.gray900,
  },
  modalDesc: {
    ...typography.bodyMedium11,
    color: colors.gray600,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.bodyMedium11,
    color: colors.gray900,
  },
  modalButtons: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  modalButton: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonCancel: {
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  modalButtonConfirm: {
    backgroundColor: colors.primary600,
  },
  modalButtonCancelText: {
    ...typography.bodyMedium11,
    color: colors.gray600,
  },
  modalButtonConfirmText: {
    ...typography.bodyMedium11,
    color: colors.white,
  },
});
