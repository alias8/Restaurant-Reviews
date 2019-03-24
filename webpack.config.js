const path = require("path");
const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  return {
    entry: "./server.ts",
    target: "node",
    mode: argv.mode,
    context: path.resolve(__dirname, 'src'),
    node: {
      __dirname: false,
      __filename: false,
    },
    devtool: "inline-source-map",
    externals: [nodeExternals()],
    output: {
      path: path.resolve(__dirname, "src", "public", "dist"),
      filename: "bundle.js"
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
      rules: [
        { test: /\.tsx?$/, loader: "ts-loader" }
      ]
    },
    plugins: [
      new CleanWebpackPlugin()
    ]
  };
};
