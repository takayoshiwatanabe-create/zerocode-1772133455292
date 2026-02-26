import ar from "./locales/ar.json";
import de from "./locales/de.json";
import en from "./locales/en.json";
// Import other language files as needed
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import hi from "./locales/hi.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";
import pt from "./locales/pt.json";
import zh from "./locales/zh.json";

export type Language = "ja" | "en" | "zh" | "ko" | "es" | "fr" | "de" | "pt" | "ar" | "hi";

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
  job_farmer_title: string;
  job_farmer_description: string;
  job_baker_title: string;
  job_baker_description: string;
  // Chat phrases (RULE-SAFETY-001: predefined only)
  chat_phrase_hello: string;
  chat_phrase_how_are_you: string;
  chat_phrase_lets_play: string;
  chat_phrase_thank_you: string;
  chat_phrase_goodbye: string;
  chat_phrase_great_job: string;
  chat_phrase_need_help: string;
  chat_phrase_im_here: string;
  chat_phrase_what_are_you_doing: string;
  chat_phrase_nice_to_meet_you: string;
  chat_phrase_see_you_later: string;
  chat_phrase_yes: string;
  chat_phrase_no: string;
  chat_phrase_ok: string;
  chat_phrase_sorry: string;
  chat_phrase_good_morning: string;
  chat_phrase_good_night: string;
  chat_phrase_happy: string;
  chat_phrase_sad: string;
  chat_phrase_excited: string;
  chat_screen_title: string;
  chat_no_friends_message: string;
  chat_select_friend: string;
  chat_error_no_user: string;
  chat_no_messages: string;
}

export type TranslationKeys = keyof TranslationContent;

export const translations: Record<Language, TranslationContent> = {
  ja: {
    app_name: "ミステリーアドベンチャー～セカイを旅するお仕事図鑑～",
    welcome_message: "ようこそ！セカイを旅するお仕事図鑑へ！",
    login_title: "保護者ログイン",
    signup_title: "保護者登録",
    mfa_title: "多要素認証 (MFA)",
    email_label: "メールアドレス",
    password_label: "パスワード",
    mfa_code_label: "MFAコード",
    login_button: "ログイン",
    signup_button: "登録",
    mfa_verify_button: "コードを検証",
    loading: "読み込み中...",
    no_account_signup: "アカウントをお持ちでないですか？登録する",
    have_account_login: "すでにアカウントをお持ちですか？ログイン",
    auth_error_generic: "認証エラーが発生しました。もう一度お試しください。",
    auth_error_invalid_credentials: "無効なメールアドレスまたはパスワードです。",
    auth_error_email_exists: "このメールアドレスはすでに登録されています。",
    mfa_error_invalid_code: "無効なMFAコードです。",
    mfa_prompt_code: "MFAコードを入力してください。",
    login_success: "ログイン成功！",
    signup_success: "登録成功！ログインしてください。",
    mfa_success: "MFA認証成功！",
    auth_success_welcome: "ようこそ、{{nickname}}さん！",
    parent_dashboard_title_short: "保護者ダッシュボード",
    parent_dashboard_title: "{{nickname}}さんの保護者ダッシュボード",
    parent_dashboard_children_overview: "お子様の活動概要",
    parent_dashboard_pending_approvals: "保留中の承認",
    parent_dashboard_no_pending_approvals: "現在、保留中の承認はありません。",
    parent_dashboard_unauthorized: "保護者ダッシュボードにアクセスするにはログインが必要です。",
    child_activity_card_last_active: "最終アクティブ:",
    child_activity_card_points: "ポイント:",
    child_activity_card_stock_holdings: "株式保有数:",
    child_activity_card_pending_purchases: "保留中の購入:",
    child_activity_card_view_details: "詳細を見る",
    locale_code: "ja-JP",
    purchase_approval_modal_title: "購入承認",
    purchase_approval_modal_child_name: "お子様の名前:",
    purchase_approval_modal_item_name: "アイテム名:",
    purchase_approval_modal_item_description: "アイテム説明:",
    purchase_approval_modal_cost: "費用:",
    purchase_approval_modal_timestamp: "リクエスト日時:",
    purchase_approval_modal_approve_button: "承認",
    purchase_approval_modal_reject_button: "拒否",
    purchase_approval_modal_close_button: "閉じる",
    points_unit: "ポイント",
    real_money_unit: "円",
    game_home_title: "ゲームホーム",
    game_welcome_message: "ようこそ、{{nickname}}！",
    player: "プレイヤー",
    logout_button: "ログアウト",
    game_player_level: "レベル: {{level}}",
    game_player_points: "ポイント: {{points}}",
    game_world_map_title: "ワールドマップ",
    game_world_map_alt_text: "ゲームのワールドマップ",
    game_map_location_pin: "{{locationName}}の場所ピン",
    game_map_legend_title: "凡例",
    game_map_legend_current_location: "現在地",
    game_map_legend_unlocked_location: "アンロックされた場所",
    game_map_legend_locked_location: "ロックされた場所",
    location_home_village: "はじまりの村",
    location_home_village_desc: "あなたの冒険が始まる場所です。",
    location_forest_outpost: "森の拠点",
    location_forest_outpost_desc: "森の奥深くにある小さな拠点。",
    location_mountain_peak: "山の頂",
    location_mountain_peak_desc: "そびえ立つ山の頂上。",
    location_desert_oasis: "砂漠のオアシス",
    location_desert_oasis_desc: "広大な砂漠の中の豊かな場所。",
    game_unlocked_jobs_title: "新しいお仕事がアンロックされました！",
    game_unlocked_jobs_description: "様々なお仕事を体験して、世界について学びましょう。",
    game_view_jobs_button: "お仕事を見る",
    game_unlocked_economy_title: "経済システムがアンロックされました！",
    game_unlocked_economy_description: "ゲーム内経済に参加して、ポイントや株式を管理しましょう。",
    game_view_economy_button: "経済を見る",
    job_card_required_level: "必要レベル: {{level}}",
    job_card_locked: "ロック中",
    job_card_start_button: "お仕事を始める",
    job_card_unlock_more: "もっとアンロックする",
    job_farmer_title: "農家",
    job_farmer_description: "作物を育て、動物の世話をします。",
    job_baker_title: "パン屋",
    job_baker_description: "美味しいパンやお菓子を焼きます。",
    chat_phrase_hello: "こんにちは！",
    chat_phrase_how_are_you: "元気ですか？",
    chat_phrase_lets_play: "一緒に遊ぼう！",
    chat_phrase_thank_you: "ありがとう！",
    chat_phrase_goodbye: "さようなら！",
    chat_phrase_great_job: "よくやったね！",
    chat_phrase_need_help: "助けて！",
    chat_phrase_im_here: "ここにいるよ！",
    chat_phrase_what_are_you_doing: "何してるの？",
    chat_phrase_nice_to_meet_you: "はじめまして！",
    chat_phrase_see_you_later: "またね！",
    chat_phrase_yes: "はい",
    chat_phrase_no: "いいえ",
    chat_phrase_ok: "OK",
    chat_phrase_sorry: "ごめんなさい",
    chat_phrase_good_morning: "おはよう！",
    chat_phrase_good_night: "おやすみ！",
    chat_phrase_happy: "嬉しい！",
    chat_phrase_sad: "悲しい...",
    chat_phrase_excited: "ワクワクする！",
    chat_screen_title: "チャット",
    chat_no_friends_message: "チャットできる友達がいません。",
    chat_select_friend: "友達を選択",
    chat_error_no_user: "ユーザー情報がありません。ログインしてください。",
    chat_no_messages: "まだメッセージはありません。",
  },
  en: en as TranslationContent,
  zh: zh as TranslationContent,
  ko: ko as TranslationContent,
  es: es as TranslationContent,
  fr: fr as TranslationContent,
  de: de as TranslationContent,
  pt: pt as TranslationContent,
  ar: ar as TranslationContent,
  hi: hi as TranslationContent,
};
