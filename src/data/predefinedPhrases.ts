import { TranslationKeys } from "@/i18n/translations";

interface PredefinedPhrase {
  key: TranslationKeys;
}

// RULE-SAFETY-001: Free text chat is completely prohibited.
// All communication must be selected from a list of fixed phrases.
export const predefinedPhrases: PredefinedPhrase[] = [
  { key: "chat_phrase_hello" },
  { key: "chat_phrase_how_are_you" },
  { key: "chat_phrase_good_game" },
  { key: "chat_phrase_thank_you" },
  { key: "chat_phrase_lets_play" },
  { key: "chat_phrase_nice_to_meet_you" },
  { key: "chat_phrase_see_you_later" },
  { key: "chat_phrase_i_like_this_job" },
  { key: "chat_phrase_what_is_your_favorite_job" },
  { key: "chat_phrase_i_need_help" },
  { key: "chat_phrase_great_job" },
  { key: "chat_phrase_goodbye" },
  { key: "chat_phrase_yes" },
  { key: "chat_phrase_no" },
];
