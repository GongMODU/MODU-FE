import { sendEmailCode, verifyEmailCode } from "@/lib/api/auth";
import { colors, spacing, typography } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
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

type Step = "email" | "verify" | "verified";

export default function SignupEmailScreen() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const isVerified = code.every((c) => c !== "");

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSendCode = async () => {
    if (!email || isLoading) return;
    setIsLoading(true);
    setEmailError(null);
    try {
      await sendEmailCode(email);
      setStep("verify");
    } catch (error: unknown) {
      const data = (error as { response?: { data?: unknown } })?.response?.data;
      const serverMsg =
        typeof data === "string"
          ? data
          : (data as { message?: string })?.message ?? null;
      setEmailError(serverMsg ?? "인증코드 발송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (step === "verify" && isVerified) {
      if (isLoading) return;
      setIsLoading(true);
      try {
        await verifyEmailCode(email, code.join(""));
        setStep("verified");
      } catch {
        Alert.alert("오류", "인증번호가 올바르지 않습니다. 다시 확인해주세요.");
      } finally {
        setIsLoading(false);
      }
    } else if (step === "verified") {
      router.push({ pathname: "/(auth)/signup-info", params: { email } });
    }
  };

  const isNextEnabled =
    (step === "verify" && isVerified) || step === "verified";

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
            <TouchableOpacity onPress={() => {
                if (step === "email") {
                  router.replace("/onboarding");
                } else {
                  setStep("email");
                  setCode(["", "", "", "", "", ""]);
                }
              }}>
              <Ionicons name="chevron-back" size={24} color={colors.gray800} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>회원가입</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.content}>
            {/* 이메일 */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>이메일</Text>
              <View style={[styles.inputRow, emailError ? styles.inputRowError : null]}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (emailError) setEmailError(null);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={colors.gray400}
                />
                <TouchableOpacity
                  style={styles.verifyButton}
                  onPress={handleSendCode}
                  disabled={isLoading}
                >
                  <Text style={styles.verifyButtonText}>인증</Text>
                </TouchableOpacity>
              </View>
              {emailError && (
                <Text style={styles.errorText}>* {emailError}</Text>
              )}
            </View>

            {/* 인증번호 */}
            {(step === "verify" || step === "verified") && (
              <>
                <Text style={styles.sentMessage}>
                  * 인증번호가 이메일로 발송되었어요.
                </Text>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>인증번호</Text>
                  <View style={styles.codeRow}>
                    {code.map((digit, i) => (
                      <TextInput
                        key={i}
                        ref={(el) => {
                          inputRefs.current[i] = el;
                        }}
                        style={[
                          styles.codeBox,
                          digit !== "" && styles.codeBoxFilled,
                        ]}
                        value={digit}
                        onChangeText={(t) =>
                          handleCodeChange(
                            t.replace(/[^0-9]/g, "").slice(-1),
                            i,
                          )
                        }
                        keyboardType="number-pad"
                        maxLength={1}
                        textAlign="center"
                      />
                    ))}
                  </View>
                </View>
              </>
            )}
          </View>

          {/* 다음으로 버튼 */}
          <TouchableOpacity
            style={[
              styles.nextButton,
              isNextEnabled && styles.nextButtonActive,
            ]}
            onPress={handleNext}
            disabled={!isNextEnabled}
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
    gap: spacing.xs,
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
  errorText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.primary600,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray600,
  },
  verifyButton: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  verifyButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.gray700,
  },
  sentMessage: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.primary600,
    marginBottom: spacing.sm,
  },
  codeRow: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  codeBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.white,
    ...typography.subtitleMedium14,
    color: colors.gray800,
    textAlign: "center",
  },
  codeBoxFilled: {
    borderColor: colors.primary600,
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
