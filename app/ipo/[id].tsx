import { colors, spacing } from "@/styles";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DetailInfoSection from "./_components/DetailInfoSection";
import DisclosureReportSection from "./_components/DisclosureReportSection";
import IPODetailHeader from "./_components/IPODetailHeader";
import KeyIndicatorSection from "./_components/KeyIndicatorSection";
import { type IPODetail } from "./_components/types";

// ─── Mock 데이터 (API 연동 시 교체) ───────────────────────────
const MOCK_IPO_DETAIL: IPODetail = {
  item: {
    id: "1",
    companyName: "키움히어로제2호기업인수목적",
    isFavorite: false,
  },
  keyIndicator: {
    score: 75,
    grade: "양호",
  },
  subscription: {
    subscriptionDate: "04.15~04.16",
    listingDate: "04.28",
    competitionRate: "342:1",
    proportionalRate: "128:1",
    equalAllocation: "12주",
    generalAllocation: "1.25M주",
  },
  prediction: {
    offeringPrice: 52000,
    demandForecastDate: "04.08~04.09",
    expectedOfferingPrice: "48,000~57,000원",
    lockupPeriod: "68.5%",
    institutionalRate: "1,245:1",
  },
  companyTab: {
    revenue: "1조 2,459억",
    netIncome: "1,240억",
    offeringShares: "5.0M주",
    listedShares: "62.5M주",
    lockupShares: ["85.2%", "85.2%"],
    brokers: ["신한투자증권", "NH투자증권"],
  },
  disclosure: {
    companySummary: {
      companyName: "키움히어로제1호기업인수목적(주)",
      companyType: "SPAC",
      mainPurpose: "다른 기업과 합병하여 성장",
      establishedDate: "2023.09.01",
      listingDate: "2025.12.12",
    },
    financialSummary:
      "스팩은 영업 활동을 하지 않으므로 매출은 0원인 것이 정상이에요. 대신 투자금(자산)이 안전하게 관리되고 있는지 확인해야 해요.",
    financialChart: {
      periods: [
        {
          periodName: "제2기",
          values: [0, 11_0000_0000, 7_2000_0000, 2144_0000],
        },
        {
          periodName: "제3기",
          values: [0, 109_4000_0000, 13_0000_0000, 2946_0000],
        },
      ],
      terms: [
        { label: "매출액", description: "영업을 하지 않는 서류상 회사" },
        { label: "자산총계", description: "공모 자금 유입으로 크게 증가" },
        { label: "부채총계", description: "주로 발행한 전환사채 관련 부채" },
        { label: "당기순손실", description: "운영비 지출로 인한 장부상 손실" },
      ],
    },
    sections: [
      {
        title: "투자자 보호를 위한 안전장치",
        summary:
          "초보 투자자에게 가장 중요한 것은 '내 원금이 안전한가' 예요. 이 회사는 공모로 모은 돈의 100%를 은행에 별도로 보관하고 있어요.",
        items: [
          {
            subTitle: "공모 예치금",
            body: "90억 원 전액을 KB국민은행에 예치하였습니다.",
          },
          {
            subTitle: "예치 목적",
            body: "이 돈은 합병에 성공하거나, 실패하여 회사가 문을 닫을 때 주주들에게 돌려주기 위한 용도로만 사용되며 함부로 인출할 수 없습니다.",
          },
          {
            subTitle: "운영 자금",
            body: "회사를 운영하는 데 드는 비용(급여, 임차료 등)은 공모 자금이 아닌, 설립 당시 발기인들이 낸 별도의 자금(약 20억 원)에서 사용하므로 예치금에는 영향이 없습니다.",
          },
        ],
      },
      {
        title: "합병 목표 및 유효 기간",
        summary:
          "이 회사가 어떤 기업과 합병하려고 하는지, 그리고 시간이 얼마나 남았는지 확인하세요.",
        items: [
          {
            subTitle: "합병 대상 산업",
            body: "전자/통신, 소프트웨어/서비스, 자동차, 소재, 바이오/의료, 에너지 등 미래 성장이 기대되는 우량 기업을 중점적으로 찾고 있습니다.",
          },
          {
            subTitle: "합병 기한",
            body: "2028년 12월 11일까지 합병 등기를 완료해야 합니다. (주금납입일로부터 36개월).",
          },
          {
            subTitle: "기한 초과 시",
            body: "만약 이때까지 합병할 회사를 찾지 못하면 회사는 해산하며, 투자자는 예치된 원금과 이자를 돌려받게 됩니다.",
          },
        ],
      },
      {
        title: "알아두면 좋은 리스크",
        items: [
          {
            subTitle: "합병 실패 위험",
            body: "기한 내에 합병 대상을 찾지 못하면 상장이 폐지되고 회사가 없어집니다.",
          },
          {
            subTitle: "주가 변동",
            body: "공모가는 2,000원이지만 시장에서 거래되는 가격은 그보다 높거나 낮을 수 있습니다. 합병 결정 전 주가가 너무 높으면 합병 비율 산정에 불리할 수 있습니다.",
          },
        ],
      },
    ],
  },
};

export default function IPODetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(MOCK_IPO_DETAIL.item.isFavorite);

  const handleToggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <IPODetailHeader
          item={{ ...MOCK_IPO_DETAIL.item, isFavorite }}
          onToggleFavorite={handleToggleFavorite}
        />
        <KeyIndicatorSection keyIndicator={MOCK_IPO_DETAIL.keyIndicator} />
        <DetailInfoSection
          subscription={MOCK_IPO_DETAIL.subscription}
          prediction={MOCK_IPO_DETAIL.prediction}
          companyTab={MOCK_IPO_DETAIL.companyTab}
        />
        <DisclosureReportSection data={MOCK_IPO_DETAIL.disclosure} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
});
