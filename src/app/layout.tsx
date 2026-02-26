import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getLang, getIsRTL } from "@/i18n";
import type { Metadata } from "next";
import { AuthProvider } from "@/hooks/useAuth";
import { GameEconomyProvider } from "@/hooks/useGameEconomy"; // Import GameEconomyProvider
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mystery Adventure ~World Job Encyclopedia~",
  description: "子どもたちが遊びながら、世界中の様々な「お仕事」を体験し、経済・社会・文化を学ぶことができる教育アドベンチャーゲームです。安全なチャット機能で友達と交流し、ミニゲームでスキルを磨き、仮想通貨でアイテムを売買。保護者ダッシュボードで子どもの活動を透明に管理でき、安心してお使いいただけます。新しい発見と学びの旅に出かけましょう！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = getLang();
  const isRTL = getIsRTL(lang);

  return (
    <html lang={lang} dir={isRTL ? "rtl" : "ltr"}>
      <body className={inter.className}>
        <I18nProvider>
          <AuthProvider>
            <GameEconomyProvider> {/* Wrap with GameEconomyProvider */}
              {children}
            </GameEconomyProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
