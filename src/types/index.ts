// Define common types used across the application

export type Id = string; // Generic ID type

export interface UserProfile {
  id: Id;
  nickname: string;
  language: string; // e.g., "en", "ja"
  // Add other common user profile fields here
}

export interface WorldLocation {
  id: Id;
  nameKey: string; // Key for i18n translation
  descriptionKey: string; // Key for i18n translation
  coordinates: { x: number; y: number }; // Percentage coordinates for map placement
  jobsAvailable: Id[]; // List of job IDs available at this location
}

export interface ChatMessage {
  id: Id;
  senderId: Id;
  recipientId: Id;
  phraseKey: string; // Key for i18n translation of predefined phrases
  timestamp: number; // Unix timestamp
}
