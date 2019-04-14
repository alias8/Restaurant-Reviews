/* tslint:disable:object-literal-sort-keys */

import autoprefixer from "autoprefixer";
import CleanWebpackPlugin from "clean-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import nodeExternals from "webpack-node-externals";

const config = (
    env: "development" | "production",
    argv: any
): webpack.Configuration => {
    return {
        entry: {
            app: "./server.ts",
            tools: "./util/tools",
            data: "./src/data/load-sample-data"
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
                            loader: MiniCssExtractPlugin.loader as string
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

const server = webpack(config());
