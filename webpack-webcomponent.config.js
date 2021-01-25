'use strict';

/**
 * I was thinking this would be a way to build the components: a second webpack call that uses a different
 * config file.
 * but I dont think this is needed now
 * instead, have the main webpack add a file to the dist folder that is js to include on the foreign website
 * that, webpack knowing the hash key in each of those files, manually includes them
 * because of the old reusable project, NGINX is already setup with cors to allow these sites to include
 * our components
 *
 * but maybe we do.
 * if we include the main bundles on the dummy page, we get a console error of 'Target container is not a DOM element'
 * this is because is cant find `<div id="react-root"`
 * (and if we paste it in experimentally we get a homepage notfound page included on our dummy page. Duh.)
 * Really, we dont want to include App, we just want to include all the Shared Components
 * (including UQHeader and UQSiteHeader, under a reuse plan they are now Shared)
 *
 * so:
 * - create wrapper components that insert Shared Components into a page (do we actually need this?
 *   can we do it directly, or is the shadow dom aspects of this wrapping process at
 *   https://medium.com/@gilfink/wrapping-react-components-inside-custom-elements-97431d1155bd
 *   needed?)
 * - second webpack file that generates different built components (from the same react components)
 * - applications folder where (same as old reusable) we have a set of load.js files that insert the correct items
 *   into the DOM for that site
 */

const { resolve } = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const InjectPreloader = require('preloader-html-webpack-plugin');
const chalk = require('chalk');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const WebpackStrip = require('strip-loader');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyPlugin = require('copy-webpack-plugin');

// get branch name for current build, if running build locally CI_BRANCH is not set (it's set in codeship)
const branch = process && process.env && process.env.CI_BRANCH ? process.env.CI_BRANCH : 'development';

// get configuration for the branch
const config = require('./config').default[branch] || require('./config').default.development;

// local port to serve production build
const port = 9000;

// use mock data if required
const useMock = (process && process.env && !!process.env.USE_MOCK) || false;

// config for development deployment
if (config.environment === 'development') {
    config.basePath += branch + '/';
}

const webpackConfig = {
    mode: 'production',
    devtool: 'source-map',
    // The entry file. All your app roots from here.
    entry: {
        main: resolve(__dirname, './src/webcomponentWrapper.js'),
        vendor: ['react', 'react-dom', 'react-router-dom', 'redux', 'react-redux', 'moment'],
    },
    // Where you want the output to go
    output: {
        path: resolve(__dirname, './dist/', config.basePath),
        filename: 'webcomponent-js/[name]-[hash].min.js',
        publicPath: config.publicPath,
    },
    devServer: {
        contentBase: resolve(__dirname, './dist/', config.basePath),
        compress: true,
        port: port,
        host: '0.0.0.0',
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: resolve(__dirname, './public', 'favicon.ico'),
            filename: 'index.html',
            title: config.title,
            gtm: config.gtm,
            inject: true,
            template: resolve(__dirname, './public', 'index.html'),
        }),
        new WebpackPwaManifest({
            name: config.title,
            short_name: 'UQ Library',
            description: 'The University of Queensland Library.',
            background_color: '#49075E',
            theme_color: '#49075E',
            inject: true,
            ios: true,
            icons: [
                {
                    src: resolve(__dirname, './public/images', 'logo.png'),
                    sizes: [96, 128, 192, 256, 384, 512],
                    destination: 'icons',
                    ios: true,
                },
            ],
            fingerprints: false,
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: resolve(__dirname, 'public', '404.js'),
                    to: resolve(__dirname, './dist/', config.basePath),
                },
            ],
        }),
        new ProgressBarPlugin({
            format: `  building webpack... [:bar] ${chalk.green.bold(
                ':percent',
            )} (It took :elapsed seconds to build)\n`,
            clear: false,
        }),
        // new ExtractTextPlugin('[name]-[hash].min.css'),
        new MiniCssExtractPlugin({
            filename: '[name]-[hash].min.css',
        }),

        // plugin for passing in data to the js, like what NODE_ENV we are in.
        new webpack.DefinePlugin({
            __DEVELOPMENT__: !process.env.CI_BRANCH, // always production build on CI
            'process.env.NODE_ENV': JSON.stringify('production'), // always production build on CI
            'process.env.USE_MOCK': JSON.stringify(useMock),
            'process.env.API_URL': JSON.stringify(config.api),
            'process.env.AUTH_LOGIN_URL': JSON.stringify(config.auth_login),
            'process.env.AUTH_LOGOUT_URL': JSON.stringify(config.auth_logout),
            'process.env.APP_URL': JSON.stringify(config.url(process.env.CI_BRANCH)),
            'process.env.FULL_PATH': JSON.stringify(config.fullPath(process.env.CI_BRANCH)),
            'process.env.BRANCH': JSON.stringify(config.environment),
            'process.env.PUBLIC_PATH': JSON.stringify(config.basePath),
            'process.env.GOOGLE_MAPS_URL': JSON.stringify(config.googleMaps),
            'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.GOOGLE_MAPS_API_KEY),
            'process.env.ENABLE_LOG': JSON.stringify(
                !!process.env.CI_BRANCH && process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'cc',
            ),
            'process.env.TITLE_SUFFIX': JSON.stringify(config.titleSuffix),
            'process.env.GIT_SHA': JSON.stringify(process.env.CI_COMMIT_ID),
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        // Put it in the end to capture all the HtmlWebpackPlugin's
        // assets manipulations and do leak its manipulations to HtmlWebpackPlugin
        // new OfflinePlugin({
        //     relativePaths: false,
        //     publicPath: config.basePath,
        //     caches: {
        //       main: [':rest:'],
        //     },
        //     AppCache : {
        //       directory: './'
        //     }
        // }),
        new InjectPreloader(),
        new BundleAnalyzerPlugin({
            analyzerMode: config.environment === 'production' ? 'disabled' : 'static',
            openAnalyzer: !process.env.CI_BRANCH,
        }),
    ],
    optimization: {
        splitChunks: {
            automaticNameDelimiter: '-',
            minChunks: 5,
            cacheGroups: {
                commons: {
                    chunks: 'all',
                },
            },
        },
        minimizer: [
            new TerserPlugin({
                sourceMap: true,
                parallel: true,
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/, /custom_modules/],
                enforce: 'pre',
                use: 'eslint-loader',
            },
            {
                test: /\.js?$/,
                include: [resolve(__dirname, 'src')],
                exclude: [/node_modules/, /custom_modules/, '/src/mocks/'],
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            '@babel/plugin-proposal-export-namespace-from',
                            '@babel/plugin-proposal-export-default-from',
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-syntax-dynamic-import',
                            ['@babel/plugin-transform-spread', { loose: true }],
                        ],
                    },
                },
            },
            {
                test: /\.scss/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'assets/',
                            publicPath: 'assets/',
                        },
                    },
                ],
            },
            {
                test: /\.js$/,
                loader: WebpackStrip.loader('console.log'),
            },
        ],
    },
    resolve: {
        descriptionFiles: ['package.json'],
        enforceExtension: false,
        extensions: ['.jsx', '.js', '.json'],
        modules: ['src', 'node_modules', 'custom_modules'],
        alias: {
            '@material-ui/styles': resolve(__dirname, 'node_modules', '@material-ui/styles'),
        },
    },
    performance: {
        maxAssetSize: 1000000,
        maxEntrypointSize: 1000000,
        hints: 'warning',
    },
};

// this is separated out because it causes local build to fail as the env vars required by Sentry arent available
if (!!process.env.SENTRY_AUTH_TOKEN) {
    /*
     * This plugin requires these ENV vars to be in place:
     * SENTRY_AUTH_TOKEN
     * SENTRY_ORG
     * SENTRY_PROJECT
     * For more info, see https://docs.sentry.io/product/cli/configuration/#environment-variables
     */
    const SentryCliPlugin = require('@sentry/webpack-plugin');

    // if you need to run this locally, create .sentryclirc and add the variables from the codeship env variables
    // per https://docs.sentry.io/learn/cli/configuration/#configuration-file
    // and comment out the if around this section
    webpackConfig.plugins.push(
        new SentryCliPlugin({
            release: process.env.CI_COMMIT_ID,
            include: './dist',
            ignore: ['node_modules', 'webpack-dist.config.js', 'custom_modules'],
        }),
    );
}

module.exports = webpackConfig;
