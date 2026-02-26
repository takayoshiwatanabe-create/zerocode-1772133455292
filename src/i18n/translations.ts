import * as Localization from "expo-localization";

// Define the structure for a single language's translations
export interface TranslationContent {
  app_name: string;
  welcome_message: string;
  login_title: string;
  signup_title: string;
  mfa_title: string;
  email_label: string;
  password_label: string;
  mfa_code_label: string;
  login_button: string;
  signup_button: string;
  mfa_verify_button: string;
  loading: string;
  no_account_signup: string;
  have_account_login: string;
  auth_error_generic: string;
  auth_error_invalid_credentials: string;
  auth_error_email_exists: string;
  mfa_error_invalid_code: string;
  mfa_prompt_code: string;
  login_success: string;
  signup_success: string;
  mfa_success: string;
  auth_success_welcome: string;
  parent_dashboard_title_short: string;
  parent_dashboard_title: string;
  parent_dashboard_children_overview: string;
  parent_dashboard_pending_approvals: string;
  parent_dashboard_no_pending_approvals: string;
  parent_dashboard_unauthorized: string;
  child_activity_card_last_active: string;
  child_activity_card_points: string;
  child_activity_card_stock_holdings: string;
  child_activity_card_pending_purchases: string;
  child_activity_card_view_details: string;
  locale_code: string;
  purchase_approval_modal_title: string;
  purchase_approval_modal_child_name: string;
  purchase_approval_modal_item_name: string;
  purchase_approval_modal_item_description: string;
  purchase_approval_modal_cost: string;
  purchase_approval_modal_timestamp: string;
  purchase_approval_modal_approve_button: string;
  purchase_approval_modal_reject_button: string;
  purchase_approval_modal_close_button: string;
  points_unit: string;
  real_money_unit: string;
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
  job_card_required_level: string;
  job_card_locked: string;
  job_card_start_button: string;
  job_card_unlock_more: string;
}

// Define the type for translation keys
export type TranslationKeys = keyof TranslationContent;

// Define the supported languages
export type Language = "ja" | "en" | "zh" | "ko" | "es" | "fr" | "de" | "pt" | "ar" | "hi";

// Import all locale files
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

// Consolidate translations
export const translations: Record<Language, TranslationContent> = {
  ar: ar as TranslationContent,
  de: de as TranslationContent,
  en: en as TranslationContent,
  es: es as TranslationContent,
  fr: fr as TranslationContent,
  hi: hi as TranslationContent,
  ja: ja as TranslationContent,
  ko: ko as TranslationContent,
  pt: pt as TranslationContent,
  zh: zh as TranslationContent,
};

// Type augmentation for i18next
declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: TranslationContent;
    };
  }
}

