const path = require("path");

module.exports = (env, argv) => {
  return {
    entry: "./src/server.ts",
    target: "node",
    mode: argv.mode,
    devtool: "inline-source-map",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "main.js"
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
      rules: [
        { test: /\.tsx?$/, loader: "ts-loader" }
      ]
    }
  };
};
