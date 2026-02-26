import { TranslationKeys } from "./i18n/translations";

export type Id = string;

export interface UserProfile {
  id: Id;
  nickname: string;
  language: string;
  // Add other user profile fields as needed
}

export interface ChatMessage {
  id: Id;
  senderId: Id;
  recipientId: Id;
  phraseKey: TranslationKeys; // Use TranslationKeys for predefined phrases
  timestamp: number;
}

export interface WorldLocation {
  id: Id;
  nameKey: TranslationKeys;
  descriptionKey: TranslationKeys;
  coordinates: { x: number; y: number }; // Percentage coordinates for positioning
  jobsAvailable: Id[]; // Array of job IDs available at this location
}
