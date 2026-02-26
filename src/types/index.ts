export type Id = string;

export enum UserRole {
  Child = "child",
  Parent = "parent",
}

export interface User {
  id: Id;
  nickname: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface ChatMessage {
  id: Id;
  senderId: Id;
  recipientId: Id;
  phraseKey: string; // Key for predefined phrase
  timestamp: number;
}

export interface WorldLocation {
  id: Id;
  nameKey: string; // i18n key for location name
  descriptionKey: string; // i18n key for description
  coordinates: { x: number; y: number }; // Percentage for flexible positioning
  jobsAvailable: Id[]; // List of job IDs available at this location
}
