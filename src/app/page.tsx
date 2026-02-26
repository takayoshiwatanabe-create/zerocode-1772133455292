import { t } from "@/i18n";
import { getIsRTL, getLang } from "@/i18n";
import { AuthForm } from "@/components/auth/AuthForm";
import { TranslationKeys } from "@/i18n/translations";
import React from "react"; // Import React

export default function HomePage() {
  const currentLang = getLang();
  const isRTL = getIsRTL(currentLang);

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center p-6 ${isRTL ? "text-right" : "text-left"}`}>
      <h1 className="text-5xl font-bold text-blue-700 mb-4">{t("app_name" as TranslationKeys)}</h1>
      <p className="text-xl text-gray-700 mb-8">{t("welcome_message" as TranslationKeys)}</p>
      <AuthForm />
    </main>
  );
}

