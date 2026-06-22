const personaImageMap: Record<string, ReturnType<typeof require>> = {
  K1R1: require("@/assets/images/personas/k1r1.png"),
  K1R2: require("@/assets/images/personas/k1r2.png"),
  K1R3: require("@/assets/images/personas/k1r3.png"),
  K1R4: require("@/assets/images/personas/k1r4.png"),
  K2R1: require("@/assets/images/personas/k2r1.png"),
  K2R2: require("@/assets/images/personas/k2r2.png"),
  K2R3: require("@/assets/images/personas/k2r3.png"),
  K2R4: require("@/assets/images/personas/k2r4.png"),
  K3R1: require("@/assets/images/personas/k3r1.png"),
  K3R2: require("@/assets/images/personas/k3r2.png"),
  K3R3: require("@/assets/images/personas/k3r3.png"),
  K3R4: require("@/assets/images/personas/k3r4.png"),
  K4R1: require("@/assets/images/personas/k4r1.png"),
  K4R2: require("@/assets/images/personas/k4r2.png"),
  K4R3: require("@/assets/images/personas/k4r3.png"),
  K4R4: require("@/assets/images/personas/k4r4.png"),
};

const personaResultImageMap: Record<string, ReturnType<typeof require>> = {
  K1R1: require("@/assets/images/persona-result/k1r1.png"),
  K1R2: require("@/assets/images/persona-result/k1r2.png"),
  K1R3: require("@/assets/images/persona-result/k1r3.png"),
  K1R4: require("@/assets/images/persona-result/k1r4.png"),
  K2R1: require("@/assets/images/persona-result/k2r1.png"),
  K2R2: require("@/assets/images/persona-result/k2r2.png"),
  K2R3: require("@/assets/images/persona-result/k2r3.png"),
  K2R4: require("@/assets/images/persona-result/k2r4.png"),
  K3R1: require("@/assets/images/persona-result/k3r1.png"),
  K3R2: require("@/assets/images/persona-result/k3r2.png"),
  K3R3: require("@/assets/images/persona-result/k3r3.png"),
  K3R4: require("@/assets/images/persona-result/k3r4.png"),
  K4R1: require("@/assets/images/persona-result/k4r1.png"),
  K4R2: require("@/assets/images/persona-result/k4r2.png"),
  K4R3: require("@/assets/images/persona-result/k4r3.png"),
  K4R4: require("@/assets/images/persona-result/k4r4.png"),
};

const personaMypageImageMap: Record<string, ReturnType<typeof require>> = {
  K1R1: require("@/assets/images/persona-mypage/k1r1.png"),
  K1R2: require("@/assets/images/persona-mypage/k1r2.png"),
  K1R3: require("@/assets/images/persona-mypage/k1r3.png"),
  K1R4: require("@/assets/images/persona-mypage/k1r4.png"),
  K2R1: require("@/assets/images/persona-mypage/k2r1.png"),
  K2R2: require("@/assets/images/persona-mypage/k2r2.png"),
  K2R3: require("@/assets/images/persona-mypage/k2r3.png"),
  K2R4: require("@/assets/images/persona-mypage/k2r4.png"),
  K3R1: require("@/assets/images/persona-mypage/k3r1.png"),
  K3R2: require("@/assets/images/persona-mypage/k3r2.png"),
  K3R3: require("@/assets/images/persona-mypage/k3r3.png"),
  K3R4: require("@/assets/images/persona-mypage/k3r4.png"),
  K4R1: require("@/assets/images/persona-mypage/k4r1.png"),
  K4R2: require("@/assets/images/persona-mypage/k4r2.png"),
  K4R3: require("@/assets/images/persona-mypage/k4r3.png"),
  K4R4: require("@/assets/images/persona-mypage/k4r4.png"),
};

/** 마이페이지 프로필 아바타 이미지 */
export function getPersonaImage(
  personaCode: string,
): ReturnType<typeof require> | null {
  return personaImageMap[personaCode] ?? null;
}

/** 결과 화면 이미지 (온보딩 결과 + 재검사 결과 공용) */
export function getPersonaResultImage(
  personaCode: string,
): ReturnType<typeof require> | null {
  return personaResultImageMap[personaCode] ?? null;
}

/** 마이페이지 투자 성향 영역 이미지 */
export function getPersonaMypageImage(
  personaCode: string,
): ReturnType<typeof require> | null {
  return personaMypageImageMap[personaCode] ?? null;
}
