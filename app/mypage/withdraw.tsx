import { withdraw } from "@/lib/api/mypage";
import queryClient from "@/lib/queryClient";
import { tokenStore } from "@/lib/tokenStore";
import { colors, spacing, typography } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WithdrawScreen() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const isMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;
  const isEnabled =
    password.length > 0 && passwordConfirm.length > 0 && !isMismatch;

  const handleWithdraw = () => {
    if (!isEnabled || isPending) return;
    Alert.alert(
      "회원탈퇴",
      "탈퇴 시 데이터는 복구할 수 없습니다.\n정말 탈퇴하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "탈퇴하기",
          style: "destructive",
          onPress: async () => {
            setIsPending(true);
            try {
              await withdraw(password);
              tokenStore.clear();
              queryClient.clear();
              router.replace("/onboarding");
            } catch {
              Alert.alert(
                "오류",
                "입력된 비밀번호가 다르거나, 회원정보와 일치하지 않습니다.",
              );
            } finally {
              setIsPending(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={colors.gray800} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>회원탈퇴</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          <View style={styles.content}>
            {/* 비밀번호 확인 */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>비밀번호 확인</Text>
              <View style={styles.inputRow}>
                <TextInput
                  key={String(passwordVisible)}
                  style={[
                    styles.input,
                    !passwordVisible &&
                      Platform.OS === "android" && {
                        fontFamily: "Roboto",
                        fontWeight: "400",
                      },
                  ]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                  placeholderTextColor={colors.gray400}
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                >
                  <Ionicons
                    name={passwordVisible ? "eye" : "eye-off"}
                    size={18}
                    color={colors.gray600}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* 비밀번호 재확인 */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>비밀번호 재확인</Text>
              <View
                style={[styles.inputRow, isMismatch && styles.inputRowError]}
              >
                <TextInput
                  key={String(passwordConfirmVisible)}
                  style={[
                    styles.input,
                    !passwordConfirmVisible &&
                      Platform.OS === "android" && {
                        fontFamily: "Roboto",
                        fontWeight: "400",
                      },
                  ]}
                  value={passwordConfirm}
                  onChangeText={setPasswordConfirm}
                  secureTextEntry={!passwordConfirmVisible}
                  autoCapitalize="none"
                  placeholderTextColor={colors.gray400}
                />
                <TouchableOpacity
                  onPress={() =>
                    setPasswordConfirmVisible(!passwordConfirmVisible)
                  }
                >
                  <Ionicons
                    name={passwordConfirmVisible ? "eye" : "eye-off"}
                    size={18}
                    color={colors.gray600}
                  />
                </TouchableOpacity>
              </View>
              {isMismatch && (
                <Text style={styles.errorText}>
                  * 입력된 비밀번호가 다르거나, 회원정보와 일치하지 않습니다.
                </Text>
              )}
            </View>
          </View>
        </ScrollView>

        {/* 탈퇴하기 버튼 */}
        <TouchableOpacity
          style={[styles.submitButton, isEnabled && styles.submitButtonActive]}
          onPress={handleWithdraw}
          disabled={!isEnabled || isPending}
        >
          <Text
            style={[
              styles.submitButtonText,
              isEnabled && styles.submitButtonTextActive,
            ]}
          >
            {isPending ? "처리 중..." : "탈퇴하기"}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.contentArea,
    paddingBottom: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 72,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.subtitleMedium14,
    color: colors.gray800,
  },
  headerPlaceholder: {
    width: 24,
  },
  content: {
    flex: 1,
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  label: {
    ...typography.subtitleMedium14,
    color: colors.gray700,
  },
  inputRow: {
    width: "100%",
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
  },
  inputRowError: {
    borderColor: colors.primary600,
  },
  input: {
    flex: 1,
    ...typography.subtitleMedium14,
    color: colors.gray600,
  },
  errorText: {
    ...typography.bodyMedium11,
    color: colors.primary600,
  },
  submitButton: {
    marginHorizontal: spacing.contentArea,
    marginBottom: spacing.lg,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary100,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonActive: {
    backgroundColor: colors.primary600,
    borderColor: colors.primary600,
  },
  submitButtonText: {
    ...typography.footerBold12,
    color: colors.primary100,
  },
  submitButtonTextActive: {
    color: colors.white,
  },
});
