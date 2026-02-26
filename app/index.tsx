import { StyleSheet, Text, View } from "react-native";
import { t } from "@/i18n";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isRTL } from "@/i18n";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          flexDirection: isRTL ? "row-reverse" : "row", // Example RTL adjustment
        },
      ]}
    >
      <Text style={styles.title}>{t("app_name")}</Text>
      <Text style={styles.subtitle}>{t("welcome_message")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 16,
    fontSize: 18,
    color: "#666",
  },
});

