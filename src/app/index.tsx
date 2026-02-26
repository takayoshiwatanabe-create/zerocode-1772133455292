import { Text, View } from "react-native";
import { t } from "@/i18n";
import { getIsRTL, getLang } from "@/i18n";
import { AuthForm } from "@/components/auth/AuthForm"; // Import AuthForm

export default function HomePage() {
  const currentLang = getLang();
  const isRTL = getIsRTL(currentLang); // Corrected variable name from isRRTL to isRTL

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24, // p-6 is 24px
      }}
    >
      <Text
        style={{
          fontSize: 40, // text-5xl
          fontWeight: "bold",
          color: "#1d4ed8", // text-blue-700
          marginBottom: 16, // mb-4
          textAlign: isRTL ? "right" : "left", // Apply text alignment here
        }}
      >
        {t("app_name")}
      </Text>
      <Text
        style={{
          fontSize: 20, // text-xl
          color: "#374151", // text-gray-700
          textAlign: isRTL ? "right" : "left", // Apply text alignment here
          marginBottom: 32, // Added mb-8 for spacing as per web version
        }}
      >
        {t("welcome_message")}
      </Text>
      <AuthForm /> {/* Integrate AuthForm here */}
    </View>
  );
}
