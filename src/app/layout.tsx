import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getLang, getIsRTL } from "@/i18n";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mystery Adventure ~World Job Encyclopedia~",
  description: "子どもたちが遊びながら、経済・社会・文化を学ぶキッズ向けメタバース・アドベンチャー",
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
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}


