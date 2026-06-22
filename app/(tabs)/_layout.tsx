import { TabBarIcon, TabBarLabel } from "@/app/_components/TabBarIcon";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { justifyContent: "space-around" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="home" focused={focused} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabBarLabel label="홈" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="history" focused={focused} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabBarLabel label="청약 이력" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="favorites" focused={focused} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabBarLabel label="관심 공모주" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="mypage" focused={focused} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabBarLabel label="마이페이지" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
