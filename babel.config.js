module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxRuntime: 'automatic' }],
      ['@babel/preset-typescript', { allowDeclareFields: true }],
    ],
    plugins: [
      require.resolve("expo-router/babel"),
      "nativewind/babel",
      ["module-resolver", {
        alias: {
          "@": "./src",
        },
      }],
    ],
  };
};
