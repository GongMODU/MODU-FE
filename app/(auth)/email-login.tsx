import { login } from "@/lib/api/auth";
import { tokenStore } from "@/lib/tokenStore";
import { colors, spacing } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
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

export default function EmailLoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isEnabled = email.length > 0 && password.length > 0;

  const handleLogin = async () => {
    if (!isEnabled || isLoading) return;
    setIsLoading(true);
    try {
      const res = await login(email, password);
      tokenStore.setTokens(res.data.accessToken, res.data.refreshToken);
      tokenStore.setNickname(res.data.nickname);
      router.replace("/(tabs)/home");
    } catch {
      setPasswordError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.inner}
          keyboardShouldPersistTaps="handled"
        >
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.replace("/onboarding")}>
              <Ionicons name="chevron-back" size={24} color={colors.gray800} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>로그인</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.content}>
            {/* 이메일 */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={styles.inputBox}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.gray400}
              />
            </View>

            {/* 비밀번호 */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>비밀번호</Text>
              <View
                style={[styles.inputRow, passwordError && styles.inputRowError]}
              >
                <TextInput
                  key={String(passwordVisible)}
                  style={[
                    styles.input,
                    !passwordVisible && Platform.OS === "android" && { fontFamily: "Roboto", fontWeight: "400" },
                  ]}
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    if (passwordError) setPasswordError(false);
                  }}
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
              {passwordError && (
                <Text style={styles.errorText}>
                  * 비밀번호가 일치하지 않습니다.
                </Text>
              )}
            </View>
          </View>

          {/* 로그인 버튼 */}
          <TouchableOpacity
            style={[styles.loginButton, isEnabled && styles.loginButtonActive]}
            onPress={handleLogin}
            disabled={!isEnabled || isLoading}
          >
            <Text
              style={[
                styles.loginButtonText,
                isEnabled && styles.loginButtonTextActive,
              ]}
            >
              로그인
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  inner: {
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
    fontSize: 18,
    fontWeight: "600",
    color: colors.gray800,
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
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray700,
  },
  inputBox: {
    width: "100%",
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray600,
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
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray600,
  },
  errorText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.primary600,
  },
  loginButton: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xl,
    alignSelf: "center",
  },
  loginButtonActive: {
    backgroundColor: colors.primary600,
    borderColor: colors.primary600,
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary100,
  },
  loginButtonTextActive: {
    color: colors.white,
  },
});
