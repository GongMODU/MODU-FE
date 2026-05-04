import { colors, spacing, typography } from "@/styles";
import { useState } from "react";
import { StyleSheet, Text, View, type ViewProps } from "react-native";
import CompanyTab from "./CompanyTab";
import PredictionTab from "./PredictionTab";
import SegmentControl, { type SegmentTab } from "./SegmentControl";
import SubscriptionTab from "./SubscriptionTab";
import {
    type CompanyTabInfo,
    type PredictionInfo,
    type SubscriptionInfo,
} from "./types";

type Props = ViewProps & {
  /** 청약 탭 데이터 */
  subscription: SubscriptionInfo;
  /** 예측 탭 데이터 */
  prediction: PredictionInfo;
  /** 기업 탭 데이터 */
  companyTab: CompanyTabInfo;
};

export default function DetailInfoSection({
  subscription,
  prediction,
  companyTab,
  style,
  ...props
}: Props) {
  const [selectedTab, setSelectedTab] = useState<SegmentTab>("청약");

  return (
    <View style={[styles.container, style]} {...props}>
      <Text style={styles.title}>세부 정보</Text>
      <SegmentControl selectedTab={selectedTab} onTabChange={setSelectedTab} />
      {selectedTab === "청약" && <SubscriptionTab data={subscription} />}
      {selectedTab === "예측" && <PredictionTab data={prediction} />}
      {selectedTab === "기업" && <CompanyTab data={companyTab} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.contentArea,
    gap: 12,
  },
  title: {
    ...typography.subtitleMedium14,
    color: colors.gray800,
  },
});
