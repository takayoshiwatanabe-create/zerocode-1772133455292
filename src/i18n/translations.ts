import ar from "./locales/ar.json";
import de from "./locales/de.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import hi from "./locales/hi.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";
import pt from "./locales/pt.json";
import zh from "./locales/zh.json";

export const translations = {
  ar,
  de,
  en,
  es,
  fr,
  hi,
  ja,
  ko,
  pt,
  zh,
};

export type Language = keyof typeof translations;

// Dynamically generate TranslationKeys from the default language (Japanese)
type DeepKeys<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}` | `${Exclude<K, symbol>}.${DeepKeys<T[K]>}`;
    }[keyof T]
  : never;

export type TranslationKeys = DeepKeys<typeof ja>;

// Add new translations for game screens
declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: {
        game_home_title: string;
        game_welcome_message: string;
        player: string;
        logout_button: string;
        game_player_level: string;
        game_player_points: string;
        game_world_map_title: string;
        game_world_map_alt_text: string;
        game_map_location_pin: string;
        game_map_legend_title: string;
        game_map_legend_current_location: string;
        game_map_legend_unlocked_location: string;
        game_map_legend_locked_location: string;
        location_home_village: string;
        location_home_village_desc: string;
        location_forest_outpost: string;
        location_forest_outpost_desc: string;
        location_mountain_peak: string;
        location_mountain_peak_desc: string;
        location_desert_oasis: string;
        location_desert_oasis_desc: string;
        game_unlocked_jobs_title: string;
        game_unlocked_jobs_description: string;
        game_view_jobs_button: string;
        game_unlocked_economy_title: string;
        game_unlocked_economy_description: string;
        game_view_economy_button: string;
      };
    };
  }
}
