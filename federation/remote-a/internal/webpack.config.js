const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const WebpackLicensePlugin = require('webpack-license-plugin')
const ReactRefreshPlugin = require('@webhotelier/webpack-fast-refresh')
const { ModuleFederationPlugin } = require('webpack').container
const ModuleFederationDashboardPlugin = require('@module-federation/dashboard-plugin')
const CopyPlugin = require('copy-webpack-plugin')

// TODO:
//    set up with browserlist

const { NODE_ENV } = process.env
const isProductionBuild = NODE_ENV === 'production'
const isProductionBuildWithProfiling =
  isProductionBuild && process.argv.includes('--profile')

// resolve paths relative to where the webpack process is invoked
// (usually, this is the project root)

const resolveApp = (...relativePaths) =>
  path.resolve(fs.realpathSync(process.cwd()), ...relativePaths)

module.exports = (env) => {
  const getRemoteHost = (key) => {
    // if remote host is defined via environment variable, use it
    if (
      typeof env === 'object' &&
      typeof env.WEBPACK_FEDERATION_HOSTS === 'object' &&
      typeof env.WEBPACK_FEDERATION_HOSTS[key] !== 'undefined'
    ) {
      console.log('=========================')
      console.log('=========================')
      console.log('got it!', key)
      console.log('=========================')
      console.log('=========================')
      return `${key}@${env.WEBPACK_FEDERATION_HOSTS[key]}/remoteEntry.js`
    }

    // if not, load remote host from global variable that is injected
    // at runtime via `remoteHosts.js` config file
    return `promise new Promise((resolve, reject) => {
      if (typeof ${key} !== "undefined") return resolve();
      if (typeof window.__webpack_federation_remotes__ === undefined) return reject(new Error("remote not defined"))
      __webpack_require__.l(__webpack_federation_remotes__['${key}'] + "/remoteEntry.js", (event) => {
        if (typeof ${key} !== "undefined") return resolve();
        reject(new Error('Loading remoteEntry failed: "' + __webpack_federation_remotes__['${key}'] + '/remoteEntry.js"'));
      }, "${key}");
    }).then(() => ${key})`
  }

  return {
    mode: NODE_ENV !== undefined ? NODE_ENV : 'development',
    entry: {
      remoteA: resolveApp('src/publicPath.ts'),
      main: [
        !isProductionBuild && '@webhotelier/webpack-fast-refresh/runtime.js',
        resolveApp('src/index.ts'),
      ].filter(Boolean),
    },
    output: {
      path: isProductionBuild ? resolveApp('dist') : undefined,
      publicPath: '/',
      filename: isProductionBuild
        ? 'static/js/[name].[contenthash:8].js'
        : 'static/js/bundle.js',
      chunkFilename: isProductionBuild
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : 'static/js/[name].chunk.js',
      // point sourcemap entries to original disk location
      // (format as URL on windows)
      devtoolModuleFilenameTemplate: isProductionBuild
        ? (info) =>
            resolveApp('src', info.absoluteResourcePath).replace(/\\/g, '/')
        : (info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    },
    bail: isProductionBuild,
    devtool: isProductionBuild ? 'source-map' : 'inline-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 3001,
      hot: true,
      hotOnly: true,
      historyApiFallback: true,
      headers: {
        'X-Custom-Foo': 'bar',
      },
    },
    module: {
      rules: [
        // Disable require.ensure as it's not a standard language feature.
        { parser: { requireContext: false } },
        // First, run the linter.
        // It's important to do this before Babel processes the JS.
        {
          enforce: 'pre',
          test: /\.(ts|tsx)$/,
          include: resolveApp('src'),
          loader: 'eslint-loader',
          options: {
            cache: true,
            ignore: true,
          },
        },
        {
          // "oneOf" will traverse all following loaders until one will
          // match the requirements. When no loader matches it will fall
          // back to the "file" loader at the end of the loader list.
          oneOf: [
            // "url" loader works like "file" loader except that it embeds assets
            // smaller than specified limit in bytes as data URLs to avoid requests.
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
            // Process application JS with Babel.
            // The preset includes JSX, Flow, TypeScript, and some ESnext features.
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: resolveApp('src'),
              use: [
                {
                  loader: 'babel-loader',
                  options: {
                    compact: isProductionBuild,
                    // The following options are options of babel-loader
                    // (not babel itself). They enable caching results in
                    // ./node_modules/.cache/babel-loader/ for faster rebuilds.
                    cacheDirectory: true,
                    cacheCompression: false,
                  },
                },
                !isProductionBuild &&
                  '@webhotelier/webpack-fast-refresh/loader.js',
              ].filter(Boolean),
            },
            // "file" loader makes sure those assets get served by WebpackDevServer.
            // When you `import` an asset, you get its (virtual) filename.
            // In production, they would get copied to the `build` folder.
            // This loader doesn't use a "test" so it will catch all modules
            // that fall through the other loaders.
            {
              loader: require.resolve('file-loader'),
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
          ],
        },
      ],
    },
    resolve: {
      // where webpack will search when resolving modules. node_modules comes
      // first because it should "win" in case of conflict.
      // the second entry matches the `baseUrl` in tsconfig.json.
      modules: ['node_modules', resolveApp('src')],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        // Allows for better profiling with the react developer tools
        // https://gist.github.com/bvaughn/25e6233aeb1b4f0cdb8d8366e54a3977#webpack-4
        ...(isProductionBuildWithProfiling && {
          'react-dom$': 'react-dom/profiling',
          'scheduler/tracing': 'scheduler/tracing-profiling',
        }),
        // webpack module alias
        src: resolveApp('src'),
      },
      plugins: [
        new ModuleScopePlugin(resolveApp('src'), [resolveApp('package.json')]),
      ],
    },
    optimization: {
      minimize: isProductionBuild,
      minimizer: [
        new TerserPlugin({
          sourceMap: true,
          extractComments: false,
          terserOptions: {
            comments: false,
            toplevel: false,
            parse: { ecma: 2020 },
            keep_classnames: isProductionBuildWithProfiling,
            keep_fnames: isProductionBuildWithProfiling,
          },
        }),
      ],
      // TODO:
      //    test after module federation works! might also use name: false
      // splitChunks: {
      //   chunks: 'all',
      //   name: false,
      // },
      // runtimeChunk: {
      //   name: (entrypoint) => `runtime-${entrypoint.name}`,
      // },
    },
    plugins: [
      // module federation
      new ModuleFederationPlugin({
        name: 'remoteA',
        filename: 'remoteEntry.js',
        exposes: {
          './navigationConfig': './src/navigationConfig',
        },
        remotes: {
          host: getRemoteHost('host'),
        },
        shared: {
          react: { singleton: true },
          'react-router-dom': { singleton: true },
          'styled-components': { singleton: true },
          '@material-ui/styles': { singleton: true },
        },
      }),
      // new ModuleFederationDashboardPlugin({
      //   filename: 'dashboard.json',
      //   dashboardURL: 'http://localhost:3005/api/update',
      //   remote: 'http://localhost:3001/remoteEntry.js',
      // }),
      // cleans output folder for production builds (which are written to disk)
      isProductionBuild && new CleanWebpackPlugin(),
      // copy static files
      new CopyPlugin({
        patterns: [
          {
            from: 'public',
            globOptions: {
              dot: true,
              ignore: ['**/index.html'],
            },
          },
        ],
      }),
      // generates an `index.html` file with <script> tags injected
      new HtmlWebpackPlugin({
        template: './public/index.html',
        minify: isProductionBuild
          ? {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            }
          : {},
      }),
      // performs typescript type checking in a separate process
      new ForkTsCheckerWebpackPlugin(),
      // perform open source license analysis in production
      isProductionBuild && new WebpackLicensePlugin(),
      // perform hot module replacement and react refresh in development
      !isProductionBuild && new webpack.HotModuleReplacementPlugin(),
      !isProductionBuild && new ReactRefreshPlugin(),
    ].filter(Boolean),
    // define chunk size limits
    performance: {
      hints: isProductionBuild ? 'error' : false,
      maxAssetSize: 250 * 1024,
    },
  }
}
