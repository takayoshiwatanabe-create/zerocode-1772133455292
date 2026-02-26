// src/types.ts
import { TranslationKeys } from "@/i18n/translations";

export type Id = string;

export interface UserProfile {
  id: Id;
  nickname: string;
  language: string;
  // Add other common user profile fields here
}

export interface WorldLocation {
  id: Id;
  nameKey: TranslationKeys;
  descriptionKey: TranslationKeys;
  coordinates: { x: number; y: number }; // Percentage coordinates
  jobsAvailable: Id[]; // Array of job IDs available at this location
}

export interface Job {
  id: Id;
  nameKey: TranslationKeys;
  descriptionKey: TranslationKeys;
  requiredLevel: number;
  rewards: {
    points: number;
    items: Id[];
  };
}

export interface Item {
  id: Id;
  nameKey: TranslationKeys;
  descriptionKey: TranslationKeys;
  type: "consumable" | "equipment" | "collectible";
  value: number; // in-game points value
}

export interface Stock {
  id: Id;
  nameKey: TranslationKeys;
  descriptionKey: TranslationKeys;
  currentPrice: number;
  historicalPrices: { timestamp: string; price: number }[];
}
