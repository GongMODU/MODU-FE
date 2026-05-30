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

export function getPersonaImage(
  personaCode: string,
): ReturnType<typeof require> | null {
  return personaImageMap[personaCode] ?? null;
}
