import { t } from "@/i18n";
import { getIsRTL, getLang } from "@/i18n"; // Import getIsRTL for server-side

export default function HomePage() {
  const currentLang = getLang();
  const isRTL = getIsRTL(currentLang);

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center p-6 ${isRTL ? "text-right" : "text-left"}`}>
      <h1 className="text-5xl font-bold text-blue-700 mb-4">{t("app_name")}</h1>
      <p className="text-xl text-gray-700">{t("welcome_message")}</p>
    </main>
  );
}

