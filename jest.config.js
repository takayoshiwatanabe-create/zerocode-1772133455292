module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-expo|expo-router|react-native-reanimated|@react-native|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-safe-area-context|react-i18next|i18next|expo-localization|phaser)/.*))',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/*.test.{ts,tsx}'], // Only run .test.ts/tsx files
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'], // Exclude e2e tests
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/_layout.tsx', // Exclude root layout from coverage if it's mostly boilerplate
    '!src/app/layout.tsx', // Exclude web root layout
    '!src/app/globals.css', // Exclude css
    '!src/i18n/translations.ts', // Exclude translations file itself
    '!src/types.ts', // Exclude types file
    '!src/data/predefinedPhrases.ts', // Exclude data file
    '!src/components/game/PhaserGameContainer.tsx', // Exclude Phaser integration for now
    '!src/phaser/**', // Exclude Phaser game files
  ],
};
