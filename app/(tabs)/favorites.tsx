import { StyleSheet, Text, View } from "react-native";

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <Text>관심 공모주 화면</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
