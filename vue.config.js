const env = process.env.NODE_ENV;
const production = env === "production";
const target = process.env.VUE_APP_API_HOST;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsImportPluginFactory = require("ts-import-plugin");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const compressionWebpackPlugin = require("compression-webpack-plugin");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const TerserPlugin = require("terser-webpack-plugin");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const merge = require("webpack-merge");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require("webpack");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const autoprefixer = require("autoprefixer");

module.exports = {
  outputDir: "dist",
  publicPath: "/",
  lintOnSave: true,
  runtimeCompiler: false,
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.module
      .rule("ts")
      .use("ts-loader")
      .loader("ts-loader")
      .tap((options) => {
        options.getCustomTransformers = () => ({
          before: [
            tsImportPluginFactory({
              libraryName: "ant-design-vue",
              libraryDirectory: "es",
              style: true,
            }),
          ],
        });
        return options;
      })
      .end()
      .end()
      .rule("images")
      .use("url-loader")
      .tap((options) =>
        merge(options, {
          limit: 20480,
        })
      )
      .end()
      .end()
      .rule("svg")
      .uses.clear()
      .end()
      .use("vue-svg-loader")
      .loader("vue-svg-loader");
  },
  configureWebpack: (config) => {
    if (production) {
      config.devtool = "cheap-module-source-map";
      const plugins = [
        new compressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: new RegExp("\\.(" + ["js", "css"].join("|") + ")$"),
          threshold: 10240,
          minRatio: 0.8,
        }),
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            output: {
              comments: false, // 去掉注释
            },
            extractComments: false,
            warnings: false,
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          },
        }),
      ];
      config.plugins = [...config.plugins, ...plugins];
    } else {
      config.devtool = "source-map";
    }
    config.plugins = [new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), ...config.plugins];
  },
  // CSS 相关选项
  css: {
    extract: true,
    sourceMap: false,
    loaderOptions: {
      less: {
        modifyVars: {
          "layout-body-background": "#F3F4F7",
        },
        javascriptEnabled: true,
      },
      postcss: {
        plugins: [autoprefixer()],
      },
    },
  },
  parallel: require("os").cpus().length > 1,
  devServer: {
    open: true,
    disableHostCheck: true,
    port: process.env.VUE_APP_PORT || 3000,
    https: false,
    hotOnly: false,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      "/api": {
        target: target,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};
