/* tslint:disable:object-literal-sort-keys */
import autoprefixer from "autoprefixer";
import del from "del";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import nodemon from "nodemon";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import path from "path";
import TerserJSPlugin from "terser-webpack-plugin";
import webpack = require("webpack");
import { Stats } from "webpack";
import nodeExternals from "webpack-node-externals";
import yargs from "yargs";

const getEnvironmentOption = (args: yargs.Argv): yargs.Options => ({
    alias: "e",
    describe: "Sets the environment",
    type: "string",
    default: "local",
    choices: ["local", "stage", "sandbox", "prod"] as Environment[]
});

enum Environment {
    PROD = "prod",
    STAGE = "stage",
    LOCAL = "local",
    SANDBOX = "sandbox"
}

function clean() {
    return del(path.join(__dirname, "src", "public", "dist"));
}

/**
 * Runs the Server
 */
function serve() {
    return new Promise(resolve => {
        const monitor = nodemon({
            script: path.join(
                __dirname,
                "src",
                "public",
                "dist",
                "app.bundle.js"
            )
        }).once("start", () => {
            resolve();
        });

        process.once("SIGINT", () => {
            monitor.once("exit", () => {
                process.exit();
            });
        });
    });
}

function webpackDev() {
    return new Promise(resolve => {
        webpack(
            [
                generateWebpackConfigNode("development"),
                generateWebpackConfigBrowser("development")
            ],
            async (err: Error, stats: Stats) => {
                handleErrors(err, stats);
                console.log(stats.toString());
                resolve();
            }
        );
    });
}

function webpackProd() {
    return new Promise(resolve => {
        webpack(
            [
                generateWebpackConfigNode("production"),
                generateWebpackConfigBrowser("production")
            ],
            async (err: Error, stats: Stats) => {
                handleErrors(err, stats);
                console.log(stats.toString());
                resolve();
            }
        );
    });
}

const baseConfig = (
    env: "development" | "production"
): webpack.Configuration => {
    return {
        mode: env,
        context: path.resolve(__dirname, "src"),
        node: {
            __dirname: false,
            __filename: false
        },
        ...(env === "development" && {
            watch: true
        }),
        optimization: {
            minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
        },
        devtool: env === "development" ? "inline-source-map" : "source-map",
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
        plugins: [new MiniCssExtractPlugin({ filename: "style.css" })]
    };
};

const generateWebpackConfigNode = (
    env: "development" | "production"
): webpack.Configuration => {
    return {
        ...baseConfig(env),
        entry: {
            app: "./index",
            data: "./data/load-sample-data"
        },
        target: "node",
        externals: [nodeExternals()]
    };
};

const generateWebpackConfigBrowser = (
    env: "development" | "production"
): webpack.Configuration => {
    return {
        ...baseConfig(env),
        entry: {
            tools: "./util/tools"
        },
        target: "web"
    };
};

const handleErrors = (err: Error, stats: Stats) => {
    if (err) {
        console.error(err.stack || err);
        if ((err as any).details) {
            console.error((err as any).details);
        }
        return;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
        console.error(info.errors);
    }

    if (stats.hasWarnings()) {
        console.warn(info.warnings);
    }
};

const { argv } = yargs
    .options({})
    .command({
        command: "dev",
        describe: "Runs the server in dev mode",
        builder: args =>
            args.options({
                environment: getEnvironmentOption(args)
            }),
        handler: async () => {
            await clean();
            await webpackDev();
            await serve();
        }
    })
    .command({
        command: "package",
        describe: "Builds the project in prod mode",
        handler: async () => {
            await clean();
            await webpackProd();
            await serve();
        }
    });
