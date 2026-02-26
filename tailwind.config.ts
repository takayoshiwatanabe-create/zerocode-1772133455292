import type { Config } from 'tailwindcss';
import withExpo from 'tailwindcss-react-native/dist/withExpo';

const config: Config = {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default withExpo(config);
