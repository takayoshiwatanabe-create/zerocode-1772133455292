import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}', // For Expo Router root app directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;

