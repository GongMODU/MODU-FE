import { colors, spacing, typography } from "@/styles";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InvestmentCard from "./_components/InvestmentCard";
import MenuList from "./_components/MenuList";
import ProfileCard from "./_components/ProfileCard";

export default function MypageScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>내 프로필</Text>
        <ProfileCard />

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
});
