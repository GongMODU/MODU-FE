import StarIcon from "@/assets/images/Star.svg";
import { colors, spacing, typography } from "@/styles";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FavoriteCard from "./_components/FavoriteCard";
import FavoriteInfoCard from "./_components/FavoriteInfoCard";
import { favoritesOptions } from "./_components/queries";

export default function FavoritesScreen() {
  const [infoVisible, setInfoVisible] = useState(false);
  const [infoCardTop, setInfoCardTop] = useState(0);
  const infoButtonRef = useRef<View>(null);

  const { data: favorites, isPending, isError } = useQuery(favoritesOptions);

  const handleInfoPress = () => {
    infoButtonRef.current?.measure((_x, _y, _width, height, _pageX, pageY) => {
      setInfoCardTop(pageY + height - 13);
      setInfoVisible((v) => !v);
    });
  };

  const renderContent = () => {
    if (isPending) {
      return (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary600} />
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>데이터를 불러오지 못했어요.</Text>
        </View>
      );
    }

    if (favorites.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <StarIcon width={56} height={54} />
          <View style={styles.emptyTextGroup}>
            <Text style={styles.emptyTitle}>아직 관심 공모주가 없어요.</Text>
            <Text style={styles.emptyDesc}>
              이번주 청약 일정을 확인하고 추가해보세요.
            </Text>
          </View>
        </View>
      );
    }

    return favorites.map((item) => (
      <FavoriteCard key={item.interestId} item={item} />
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* 헤더 - white 배경, ScrollView 밖 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>관심 공모주</Text>
        <TouchableOpacity ref={infoButtonRef} onPress={handleInfoPress}>
          <Text style={styles.infoIcon}>ⓘ</Text>
        </TouchableOpacity>
      </View>

      {/* 리스트 영역 - gray50 배경 */}
      <ScrollView
        style={styles.listArea}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardList}>{renderContent()}</View>
      </ScrollView>

      {/* 안내 카드 */}
      {infoVisible && (
        <Modal
          transparent
          animationType="none"
          onRequestClose={() => setInfoVisible(false)}
        >
          <Pressable
            style={styles.overlay}
            onPress={() => setInfoVisible(false)}
          >
            <FavoriteInfoCard top={infoCardTop} />
          </Pressable>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingTop: 72,
    paddingHorizontal: spacing.contentArea,
    paddingBottom: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  listArea: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.contentArea,
    paddingTop: 16,
    paddingBottom: 60,
  },
  cardList: {
    flex: 1,
    gap: 12,
  },
  headerTitle: {
    ...typography.largeTitleMedium20,
    color: colors.gray800,
  },
  infoIcon: {
    fontSize: 19,
    color: colors.gray400,
  },
  overlay: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
  },
  errorText: {
    ...typography.bodyRegular10,
    color: colors.gray400,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 37,
    gap: 8,
  },
  emptyTextGroup: {
    gap: 4,
    alignItems: "center",
  },
  emptyTitle: {
    ...typography.bodyMedium11,
    color: colors.gray400,
    textAlign: "center",
  },
  emptyDesc: {
    ...typography.bodyMedium11,
    color: colors.gray400,
    textAlign: "center",
  },
});
