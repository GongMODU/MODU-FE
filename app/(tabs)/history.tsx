import { StyleSheet, Text, View } from "react-native";

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text>청약 이력 화면</Text>
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
