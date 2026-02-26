import { TranslationKeys } from "@/i18n/translations";

interface Phrase {
  key: TranslationKeys;
}

// RULE-SAFETY-001: Free text chat is completely prohibited.
// All communication must be selected from a list of fixed phrases.
export const predefinedPhrases: Phrase[] = [
  { key: "chat_phrase_hello" },
  { key: "chat_phrase_how_are_you" },
  { key: "chat_phrase_good_game" },
  { key: "chat_phrase_thank_you" },
  { key: "chat_phrase_lets_play" },
  { key: "chat_phrase_see_you_later" },
  { key: "chat_phrase_nice_to_meet_you" },
  { key: "chat_phrase_im_here" },
  { key: "chat_phrase_im_leaving" },
  { key: "chat_phrase_yes" },
  { key: "chat_phrase_no" },
  { key: "chat_phrase_great" },
  { key: "chat_phrase_sorry" },
  { key: "chat_phrase_help_me" },
  { key: "chat_phrase_follow_me" },
  { key: "chat_phrase_good_job" },
  { key: "chat_phrase_what_are_you_doing" },
  { key: "chat_phrase_i_like_this" },
  { key: "chat_phrase_lets_explore" },
  { key: "chat_phrase_want_to_trade" },
];
