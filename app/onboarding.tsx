import { colors, spacing } from "@/styles";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        {/* 로고 영역 */}
        <View style={styles.logoSection}>
          <View style={styles.logoPlaceholder} />
          <Text style={styles.logoText}>모두를 위한 공모주</Text>
        </View>

        {/* 버튼 영역 */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/(auth)/email-login")}
          >
            <Text style={styles.loginButtonText}>이메일로 로그인</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>구글 아이디로 로그인</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>카카오 아이디로 로그인</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/(auth)/signup-email")}>
            <View style={styles.signupTextWrapper}>
              <Text style={styles.signupBrand}>MODU</Text>
              <Text style={styles.signupGray}>가 처음이신가요?</Text>
              <View style={styles.signupUnderline} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  inner: {
    flex: 1,
    paddingHorizontal: spacing.contentArea,
    paddingBottom: spacing.xl,
  },
  logoSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: 60,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#D9D9D9",
  },
  logoText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray700,
    width: 107,
    textAlign: "center",
  },
  buttonSection: {
    gap: spacing.sm,
    alignItems: "center",
    marginBottom: 60,
  },
  loginButton: {
    width: "100%",
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray700,
  },
  signupTextWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
    paddingBottom: 4,
  },
  signupBrand: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary600,
  },
  signupGray: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.gray600,
  },
  signupUnderline: {
    position: "absolute",
    bottom: 1,
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: colors.gray400,
  },
});
