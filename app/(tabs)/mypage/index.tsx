import { colors, spacing, typography } from "@/styles";
import { useQuery } from "@tanstack/react-query";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InvestmentCard from "./_components/InvestmentCard";
import MenuList from "./_components/MenuList";
import ProfileCard from "./_components/ProfileCard";
import { mypageHomeOptions } from "./_components/queries";

export default function MypageScreen() {
  const { data, isLoading, isError } = useQuery(mypageHomeOptions());

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
        <ProfileCard nickname={data.nickname} email={data.email} />

        <Text style={styles.investmentTitle}>나의 투자 성향</Text>
        <InvestmentCard />

        <MenuList />
      </ScrollView>
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
    marginBottom: 8,
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
});
