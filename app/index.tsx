import { StyleSheet, Text, View } from "react-native";
import { t } from "@/i18n";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getIsRTL, getLang } from "@/i18n"; // Import getIsRTL and getLang
import { AuthForm } from "@/components/auth/AuthForm"; // Import AuthForm

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const currentLang = getLang();
  const isRTL = getIsRTL(currentLang);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          // Apply RTL styling conditionally
          // flexDirection: isRTL ? "row-reverse" : "row", // This would reverse the entire row, not just text
          // textAlign is for Text components, not View
        },
      ]}
    >
      <Text style={[styles.title, { textAlign: isRTL ? "right" : "left" }]}>{t("app_name")}</Text>
      <Text style={[styles.subtitle, { textAlign: isRTL ? "right" : "left", marginBottom: 32 }]}>{t("welcome_message")}</Text> {/* Added marginBottom */}
      <AuthForm /> {/* Integrate AuthForm here */}
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
