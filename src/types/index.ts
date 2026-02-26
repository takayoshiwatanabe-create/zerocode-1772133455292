// src/types/index.ts

export type Id = string; // Generic ID type

export interface UserProfile {
  id: Id;
  nickname: string;
  language: string;
  // Add other common user profile fields here
}

export interface WorldLocation {
  id: Id;
  nameKey: string; // Key for i18n translation
  descriptionKey: string; // Key for i18n translation
  coordinates: {
    x: number; // Percentage from left
    y: number; // Percentage from top
  };
  jobsAvailable: Id[]; // List of job IDs available at this location
}

export interface Job {
  id: Id;
  nameKey: string; // Key for i18n translation
  descriptionKey: string; // Key for i18n translation
  requiredLevel: number;
  // Add other job-specific fields
}

// Add more types as needed for game economy, social features, etc.

