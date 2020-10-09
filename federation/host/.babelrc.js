module.exports = (api) => {
  // This caches the Babel config by environment.
  api.cache.using(() => process.env.NODE_ENV)

  const isProductionBuild = api.env('production')

  return {
    presets: [
      '@babel/preset-typescript',
      [
        '@babel/preset-react',
        {
          development: !isProductionBuild,
        },
      ],
    ],
    plugins: [!isProductionBuild && 'react-refresh/babel'].filter(Boolean),
  }
}
