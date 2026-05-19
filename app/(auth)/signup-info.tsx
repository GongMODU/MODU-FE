import { signup } from "@/lib/api/auth";
import { colors, spacing } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
const NICKNAME_REGEX = /^[가-힣a-zA-Z]{2,8}$/;

export default function SignupInfoScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isPasswordError =
    passwordFocused && password.length > 0 && !PASSWORD_REGEX.test(password);
  const isNextEnabled =
    PASSWORD_REGEX.test(password) && NICKNAME_REGEX.test(nickname);

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
            <TouchableOpacity onPress={() => router.push("/onboarding")}>
              <Ionicons name="chevron-back" size={24} color={colors.gray800} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>회원가입</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.content}>
            {/* 비밀번호 */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>비밀번호</Text>
              <View
                style={[
                  styles.inputRow,
                  passwordFocused && styles.inputRowFocused,
                ]}
              >
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                  placeholderTextColor={colors.gray400}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
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
              <Text style={styles.hintText}>
                * 8-16자 이내, 영어 대소문자와 특수문자를 포함해주세요.
              </Text>
            </View>

            {/* 닉네임 */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>닉네임</Text>
              <TextInput
                style={styles.inputBox}
                value={nickname}
                onChangeText={setNickname}
                placeholderTextColor={colors.gray400}
              />
            </View>
          </View>

          {/* 다음으로 버튼 */}
          <TouchableOpacity
            style={[
              styles.nextButton,
              isNextEnabled && styles.nextButtonActive,
            ]}
            onPress={async () => {
              if (!isNextEnabled || isLoading) return;
              setIsLoading(true);
              try {
                await signup({ email: email ?? "", password, nickname });
                router.push("/(auth)/investment-survey");
              } catch {
                Alert.alert(
                  "회원가입 실패",
                  "입력 정보를 확인하고 다시 시도해주세요.",
                );
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={!isNextEnabled || isLoading}
          >
            <Text
              style={[
                styles.nextButtonText,
                isNextEnabled && styles.nextButtonTextActive,
              ]}
            >
              다음으로
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
  inputRowFocused: {
    borderColor: colors.primary600,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray600,
  },
  hintText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.primary600,
  },
  nextButton: {
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
  nextButtonActive: {
    backgroundColor: colors.primary600,
    borderColor: colors.primary600,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary100,
  },
  nextButtonTextActive: {
    color: colors.white,
  },
});
