export type Language = "ja" | "en" | "zh" | "ko" | "es" | "fr" | "de" | "pt" | "ar" | "hi";

export const translations: Record<Language, Record<string, string>> = {
  ja: {
    app_name: "ミステリーアドベンチャー～セカイを旅するお仕事図鑑～",
    welcome_message: "ようこそ！世界を旅するお仕事図鑑へ！",
  },
  en: {
    app_name: "Mystery Adventure ~World Job Encyclopedia~",
    welcome_message: "Welcome! To the World Job Encyclopedia!",
  },
  zh: {
    app_name: "神秘冒险～环游世界职业图鉴～",
    welcome_message: "欢迎！来到环游世界职业图鉴！",
  },
  ko: {
    app_name: "미스터리 어드벤처 ~세계를 여행하는 직업 도감~",
    welcome_message: "환영합니다! 세계를 여행하는 직업 도감에!",
  },
  es: {
    app_name: "Aventura Misteriosa ~Enciclopedia de Trabajos del Mundo~",
    welcome_message: "¡Bienvenido! ¡A la Enciclopedia de Trabajos del Mundo!",
  },
  fr: {
    app_name: "Aventure Mystère ~Encyclopédie des Métiers du Monde~",
    welcome_message: "Bienvenue ! À l'Encyclopédie des Métiers du Monde !",
  },
  de: {
    app_name: "Mysterienabenteuer ~Weltberufe-Enzyklopädie~",
    welcome_message: "Willkommen! Zur Weltberufe-Enzyklopädie!",
  },
  pt: {
    app_name: "Aventura Misteriosa ~Enciclopédia de Profissões do Mundo~",
    welcome_message: "Bem-vindo! À Enciclopédia de Profissões do Mundo!",
  },
  ar: {
    app_name: "مغامرة الغموض ~موسوعة وظائف العالم~",
    welcome_message: "أهلاً بك! في موسوعة وظائف العالم!",
  },
  hi: {
    app_name: "रहस्य साहसिक ~विश्व नौकरी विश्वकोश~",
    welcome_message: "स्वागत है! विश्व नौकरी विश्वकोश में!",
  },
};

