import { StyleSheet, View, type ViewProps } from "react-native";

type Props = ViewProps;

export default function FinancialChart({ style, ...props }: Props) {
  return <View style={[styles.container, style]} {...props} />;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 153,
    backgroundColor: "#DDDDDD",
  },
});
