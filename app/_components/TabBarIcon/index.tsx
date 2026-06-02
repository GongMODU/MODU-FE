import FavoritesActive from "@/assets/images/tab-icons/favorites-active.svg";
import FavoritesDefault from "@/assets/images/tab-icons/favorites-default.svg";
import HistoryActive from "@/assets/images/tab-icons/history-active.svg";
import HistoryDefault from "@/assets/images/tab-icons/history-default.svg";
import HomeActive from "@/assets/images/tab-icons/home-active.svg";
import HomeDefault from "@/assets/images/tab-icons/home-default.svg";
import MypageActive from "@/assets/images/tab-icons/mypage-active.svg";
import MypageDefault from "@/assets/images/tab-icons/mypage-default.svg";
import { Text } from "react-native";

const TAB_ICONS = {
  home: { default: HomeDefault, active: HomeActive },
  history: { default: HistoryDefault, active: HistoryActive },
  favorites: { default: FavoritesDefault, active: FavoritesActive },
  mypage: { default: MypageDefault, active: MypageActive },
} as const;

type TabName = keyof typeof TAB_ICONS;

type TabBarIconProps = {
  /** 탭 이름 */
  name: TabName;
  /** 선택 여부 */
  focused: boolean;
  /** 아이콘 크기 (default: 30) */
  size?: number;
};

type TabBarLabelProps = {
  /** 라벨 텍스트 */
  label: string;
  /** 선택 여부 */
  focused: boolean;
};

export function TabBarIcon({ name, focused, size = 30 }: TabBarIconProps) {
  const Icon = focused ? TAB_ICONS[name].active : TAB_ICONS[name].default;
  return <Icon width={size} height={size} />;
}

export function TabBarLabel({ label, focused }: TabBarLabelProps) {
  return (
    <Text
      style={{
        color: "#3F3F46",
        fontSize: focused ? 11 : 10,
        fontWeight: focused ? "600" : "400",
        textAlign: "center",
      }}
    >
      {label}
    </Text>
  );
}
