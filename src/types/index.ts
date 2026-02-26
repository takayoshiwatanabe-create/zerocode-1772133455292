// src/types/index.ts

import { TranslationKeys } from "@/i18n/translations";

export type Id = string;

export interface User {
  id: Id;
  email: string;
  nickname: string;
  role: "child" | "parent" | "admin";
}

export interface ChatMessage {
  id: Id;
  senderId: Id;
  recipientId: Id;
  phraseKey: TranslationKeys; // Use TranslationKeys for predefined phrases
  timestamp: number; // Unix timestamp
}

export interface WorldLocation {
  id: Id;
  nameKey: TranslationKeys;
  descriptionKey: TranslationKeys;
  coordinates: { x: number; y: number }; // Percentage coordinates
  jobsAvailable: Id[]; // Array of job IDs
}

// Add other global types here as needed
