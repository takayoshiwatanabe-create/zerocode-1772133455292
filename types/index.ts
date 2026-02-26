// Centralized type definitions for the project

/**
 * Represents a generic identifier type.
 */
export type Id = string | number;

/**
 * Basic user profile information.
 */
export type UserProfile = {
  id: Id;
  nickname: string;
  avatarUrl?: string;
  language: Language;
};

/**
 * Represents a game currency or point system.
 */
export type GamePoints = {
  amount: number;
  currencyType: "coin" | "gem" | "star"; // Example currency types
};

/**
 * Represents a predefined safe chat message.
 */
export type SafeChatMessage = {
  id: Id;
  textKey: string; // Key for i18n translation
  category: string; // e.g., "greeting", "question", "reaction"
};

/**
 * Represents a job or profession in the game.
 */
export type Job = {
  id: Id;
  nameKey: string; // Key for i18n translation
  descriptionKey: string; // Key for i18n translation
  requiredLevel: number;
  rewardPoints: number;
  imageUrl: string;
};

/**
 * Represents a location or world area in the game.
 */
export type WorldLocation = {
  id: Id;
  nameKey: string; // Key for i18n translation
  descriptionKey: string; // Key for i18n translation
  coordinates: { x: number; y: number }; // For map positioning
  jobsAvailable: Id[]; // List of job IDs available at this location
};

/**
 * Represents a game achievement.
 */
export type Achievement = {
  id: Id;
  nameKey: string; // Key for i18n translation
  descriptionKey: string; // Key for i18n translation
  iconUrl: string;
  rewardPoints: number;
  condition: string; // e.g., "complete 5 jobs", "visit 3 locations"
};

/**
 * Type for supported languages, imported from i18n module.
 */
import { Language } from "@/i18n/translations";
export type { Language };
