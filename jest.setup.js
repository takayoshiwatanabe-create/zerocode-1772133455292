import '@testing-library/react-native/extend-expect';
import { jest } from '@jest/globals';

// Mock console.error to suppress specific warnings if needed
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args[0];
  // Suppress specific warnings that are not critical for tests
  if (
    typeof message === 'string' &&
    (message.includes('Warning: `flexWrap: `wrap`` is not supported with the `gap` style property.') ||
     message.includes('Warning: `flexDirection` cannot be `row-reverse` with `gap`') ||
     message.includes('Warning: `flexDirection` cannot be `column-reverse` with `gap`') ||
     message.includes('Warning: `alignItems` cannot be `flex-end` with `gap`') ||
     message.includes('Warning: `alignItems` cannot be `flex-start` with `gap`') ||
     message.includes('Warning: `justifyContent` cannot be `space-between` with `gap`') ||
     message.includes('Warning: `justifyContent` cannot be `space-around` with `gap`') ||
     message.includes('Warning: `justifyContent` cannot be `space-evenly` with `gap`')
    )
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Mock AsyncStorage from @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock expo-localization
jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => ([
    { languageCode: 'en', textDirection: 'ltr', regionCode: 'US' },
  ])),
  getCalendars: jest.fn(() => ([
    { calendar: 'gregorian', uses  : true, identifier: 'gregorian' }
  ])),
  getTimeZone: jest.fn(() => 'America/New_York'),
  getCountry: jest.fn(() => 'US'),
  isRTL: false,
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children, style }) => <div style={style}>{children}</div>, // Simple mock for web/testing
}));

// Mock Platform for consistent testing environment
jest.mock('react-native', () => {
  const ReactNative = jest.requireActual('react-native');
  ReactNative.Platform.OS = 'ios'; // Default to iOS for native tests
  ReactNative.Platform.select = (obj) => obj.ios || obj.default;
  return ReactNative;
});

// Mock expo-router's useRouter for navigation
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Stack: {
    Screen: ({ children }) => children,
    Group: ({ children }) => children,
  },
  Redirect: () => null, // Mock Redirect component
}));

// Mock i18next init
jest.mock('i18next', () => ({
  use: () => jest.fn().mockReturnThis(),
  init: () => jest.fn().mockReturnThis(),
  t: (key) => key, // Simple pass-through for translation keys
  language: 'en',
  dir: 'ltr',
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en',
      dir: 'ltr',
    },
  }),
  I18nextProvider: ({ children }) => children,
}));

// Mock Phaser.Game
jest.mock('phaser', () => ({
  Game: jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  })),
  AUTO: 0, // Mock for Phaser.AUTO
  Scale: {
    FIT: 0,
  },
  WEBGL: 0,
  CANVAS: 0,
}));
