import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getLang, getIsRTL } from "@/i18n"; // Import functions for server-side

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mystery Adventure",
  description: "World Job Encyclopedia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = getLang(); // Get language on the server
  const isRTL = getIsRTL(lang); // Determine RTL on the server

  return (
    <html lang={lang} dir={isRTL ? "rtl" : "ltr"}>
      <body className={inter.className}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
