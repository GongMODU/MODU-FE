import { Stack } from "expo-router";

export default function MypageLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="withdraw" options={{ headerShown: false }} />
    </Stack>
  );
}
