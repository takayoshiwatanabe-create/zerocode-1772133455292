import { predefinedPhrases } from './predefinedPhrases';
import { describe, it, expect } from '@jest/globals';

describe('predefinedPhrases', () => {
  it('should contain an array of phrases', () => {
    expect(Array.isArray(predefinedPhrases)).toBe(true);
    expect(predefinedPhrases.length).toBeGreaterThan(0);
  });

  it('should contain objects with "key" and "category" properties', () => {
    predefinedPhrases.forEach(phrase => {
      expect(phrase).toHaveProperty('key');
      expect(typeof phrase.key).toBe('string');
      expect(phrase).toHaveProperty('category');
      expect(typeof phrase.category).toBe('string');
    });
  });

  it('should have unique keys', () => {
    const keys = predefinedPhrases.map(phrase => phrase.key);
    const uniqueKeys = new Set(keys);
    expect(keys.length).toBe(uniqueKeys.size);
  });

  it('should have valid categories', () => {
    const validCategories = ['greeting', 'question', 'response', 'action', 'emotion', 'farewell'];
    predefinedPhrases.forEach(phrase => {
      expect(validCategories).toContain(phrase.category);
    });
  });
});
