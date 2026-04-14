import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Colors = {
  background: "#FFFFFF",
  border: "#DDDDDD",
  textPrimary: "#333333",
  textSecondary: "#777777",
  textDisabled: "#BBBBBB",
  placeholder: "#D9D9D9",
};

export default function MypageScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 내 프로필 섹션 */}
        <Text style={styles.sectionTitle}>내 프로필</Text>

        <View style={styles.profileCard}>
          {/* 아바타 */}
          <View style={styles.avatar} />

          {/* 닉네임 + 소개 */}
          <View style={styles.profileInfo}>
            <Text style={styles.nickname}>사용자 닉네임</Text>
            <Text style={styles.bio} numberOfLines={1}>
              소셜 로그인 상태 등 추가로 표시할 내용
            </Text>
          </View>

          {/* 프로필 편집 버튼 */}
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.editButton}>프로필 편집</Text>
          </TouchableOpacity>
        </View>

        {/* 내 투자 성향 섹션 */}
        <Text style={styles.sectionTitle}>내 투자 성향</Text>

        <View style={styles.investmentCard}>
          {/* 차트 placeholder */}
          <View style={styles.chartPlaceholder} />

          {/* 다시 검사하기 버튼 */}
          <TouchableOpacity style={styles.retestButton} onPress={() => {}}>
            <Text style={styles.retestButtonText}>다시 검사하기</Text>
          </TouchableOpacity>
        </View>

        {/* 메뉴 리스트 */}
        <View style={styles.menuList}>
          {[
            { label: "도움말 및 FAQ" },
            { label: "서비스 이용약관" },
            { label: "개인정보 처리방침" },
            { label: "로그아웃" },
          ].map((item, index, arr) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                index === arr.length - 1 && styles.menuItemLast,
              ]}
              onPress={() => {}}
            >
              <Text style={styles.menuItemText}>{item.label}</Text>
              <Text style={styles.menuItemChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 32,
    gap: 12,
  },

  // 섹션 타이틀
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 8,
  },

  // 프로필 카드
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.placeholder,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  nickname: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  bio: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  editButton: {
    fontSize: 12,
    color: Colors.textDisabled,
  },

  // 투자 성향 카드
  investmentCard: {
    padding: 16,
    paddingBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 7,
    marginBottom: 20,
  },
  chartPlaceholder: {
    height: 92,
    backgroundColor: Colors.placeholder,
    borderRadius: 4,
  },
  retestButton: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 2,
    backgroundColor: Colors.placeholder,
  },
  retestButtonText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  // 메뉴 리스트
  menuList: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  menuItemChevron: {
    fontSize: 18,
    color: Colors.textDisabled,
  },
});
