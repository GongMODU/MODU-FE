import LogoSvg from "@/assets/images/logo.svg";
import KakaoIconSvg from "@/assets/images/kakao_login.svg";
import GoogleIconSvg from "@/assets/images/google_login.svg";
import { googleLogin, kakaoLogin } from "@/lib/api/auth";
import { tokenStore } from "@/lib/tokenStore";
import { colors, spacing, typography } from "@/styles";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const [loadingProvider, setLoadingProvider] = useState<
    "kakao" | "google" | null
  >(null);

  const handleSocialLogin = async (provider: "kakao" | "google") => {
    if (loadingProvider) return;
    setLoadingProvider(provider);
    try {
      const result =
        provider === "kakao" ? await kakaoLogin() : await googleLogin();
      if (result) {
        tokenStore.setTokens(result.accessToken, result.refreshToken);
        if (result.nickname) tokenStore.setNickname(result.nickname);
        router.replace("/(tabs)/home");
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        {/* 로고 영역 */}
        <View style={styles.logoSection}>
          <LogoSvg width={100} height={100} />
          <Text style={styles.logoText}>모두를 위한 공모주</Text>
        </View>

        {/* 버튼 영역 */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.emailButton}
            onPress={() => router.push("/(auth)/email-login")}
          >
            <Text style={styles.emailButtonText}>이메일로 로그인</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.kakaoButton}
            onPress={() => handleSocialLogin("kakao")}
            disabled={!!loadingProvider}
          >
            {loadingProvider === "kakao" ? (
              <ActivityIndicator size="small" color={colors.gray700} />
            ) : (
              <>
                <KakaoIconSvg width={18} height={18} />
                <Text style={styles.kakaoButtonText}>카카오 로그인</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => handleSocialLogin("google")}
            disabled={!!loadingProvider}
          >
            {loadingProvider === "google" ? (
              <ActivityIndicator size="small" color={colors.gray700} />
            ) : (
              <>
                <GoogleIconSvg width={18} height={18} />
                <Text style={styles.googleButtonText}>Google로 로그인</Text>
              </>
            )}
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
  emailButton: {
    width: "100%",
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.primary50,
    justifyContent: "center",
    alignItems: "center",
  },
  emailButtonText: {
    ...typography.subtitleMedium14,
    color: colors.gray700,
  },
  kakaoButton: {
    width: "100%",
    height: 46,
    borderRadius: 12,
    backgroundColor: "#FEE500",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  kakaoButtonText: {
    ...typography.subtitleMedium14,
    color: "rgba(0,0,0,0.85)",
  },
  googleButton: {
    width: "100%",
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#747775",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  googleButtonText: {
    ...typography.subtitleMedium14,
    color: "#1F1F1F",
  },
  signupTextWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
    paddingBottom: 4,
  },
  signupBrand: {
    ...typography.labelMedium10,
    color: colors.primary600,
  },
  signupGray: {
    ...typography.bodyRegular10,
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
