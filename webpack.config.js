/* tslint:disable:object-literal-sort-keys */
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");

module.exports = (env, argv) => {
  return {
    entry: {
      app: "./server.ts",
      tools: "./util/tools"
    },
    target: "node",
    mode: argv.mode,
    context: path.resolve(__dirname, "src"),
    node: {
      __dirname: false,
      __filename: false
    },
    devtool: "source-map",
    externals: [nodeExternals()],
    output: {
      path: path.resolve(__dirname, "src", "public", "dist"),
      filename: "[name].bundle.js"
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader"
        },
        {
          test: /\.s?css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: "css-loader",
              options: {
                importLoaders: 2
              }
            },
            {
              loader: "postcss-loader",
              options: {
                ident: "postcss",
                sourceMap: true,
                plugins() {
                  return [autoprefixer()];
                }
              }
            },
            {
              loader: "sass-loader",
              options: {
                outputStyle: "expanded",
                sourceMap: true
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({ filename: "style.css" })
    ]
  };
};
