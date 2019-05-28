/* tslint:disable:object-literal-sort-keys */
import autoprefixer from "autoprefixer";
import CleanWebpackPlugin from "clean-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import webpack = require("webpack");
import { Stats } from "webpack";
import WebpackDevServer from "webpack-dev-server";
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
    new CleanWebpackPlugin().removeFiles(["dist"]);
}

function webpackDev() {
    return new Promise(resolve => {
        const server = new WebpackDevServer(
            webpack([
                generateWebpackConfigNode("development"),
                generateWebpackConfigBrowser("development")
            ]),
            // todo: what does all this config mean? do I have to point to /app.bundle.js etc?
            {
                contentBase: "/",
                hot: true,
                historyApiFallback: true,
                proxy: {
                    "**": `http://localhost:${parseInt(
                        `${process.env.PORT || 8000}`,
                        10
                    ) + 1}/`
                },
                disableHostCheck: true,
                staticOptions: {},
                quiet: false,
                noInfo: false,
                lazy: false,
                watchOptions: {
                    aggregateTimeout: 300,
                    poll: true
                },
                https: false,
                publicPath: "/static/",
                stats: {
                    colors: true,
                    chunkModules: false
                } as any
            }
        );

        server.listen(
            parseInt(`${process.env.PORT || 8000}`, 10),
            "0.0.0.0",
            error => {
                if (error) {
                    throw error;
                }
                console.log(
                    "[webpack-dev-server]",
                    "Webpack Dev Server is now up"
                );
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
        devtool: "source-map",
        output: {
            path: path.resolve(__dirname, "build", "public", "dist"),
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
            new MiniCssExtractPlugin({ filename: "style.css" }),
            new CopyPlugin([
                {
                    from: path.resolve("src", "assets"),
                    to: path.resolve(__dirname, "build", "public")
                },
                {
                    from: path.resolve("src", "views"),
                    to: path.resolve(__dirname, "build", "views")
                }
            ])
        ]
    };
};

const generateWebpackConfigNode = (
    env: "development" | "production"
): webpack.Configuration => {
    return {
        ...baseConfig(env),
        entry: {
            app: "./server",
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
            await Promise.all([webpackDev()]);
        }
    })
    .command({
        command: "package",
        describe: "Builds the project in prod mode and zips up the dist folder",
        handler: async () => {
            await clean();
            await webpackProd();
        }
    });
