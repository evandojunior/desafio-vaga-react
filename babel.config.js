module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      'react-native-worklets/plugin',
      // Fix MirageJS/Pretender no web: converte import.meta para process.env
      ['babel-plugin-transform-import-meta', {}],
    ],
  };
};
