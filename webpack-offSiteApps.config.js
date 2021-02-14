'use strict';

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
const fs = require('fs');

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

// TODO see if this can moved to an external file
class CreateOffSiteApp {
    // creates offSiteAppWrapper.js in dist that includes the appropriate files because it can read the hash value here
    // from https://stackoverflow.com/questions/50228128/how-to-inject-webpack-build-hash-to-application-code
    constructor(options = {}) {
        this.options = {
            ...options,
        };
    }
    apply(compiler) {
        let liveLocation;
        if ((this.options.branch || '') === 'staging') {
            liveLocation = 'https://homepage-staging.library.uq.edu.au/';
        } else if ((this.options.branch || '').startsWith('feature-')) {
            liveLocation = 'https://homepage-development.library.uq.edu.au/' + this.options.branch + '/';
        } else {
            // must be prod, or update list above
            liveLocation = 'https://www.library.uq.edu.au/';
        }
        const allData = hash =>
            'async function ready(fn) {\n' +
            "    if (document.readyState !== 'loading'){\n" +
            '        await fn();\n' +
            '    } else {\n' +
            "        document.addEventListener('DOMContentLoaded', fn);\n" +
            '    }\n' +
            '}\n' +
            '\n' +
            'async function insertScript(url) {\n' +
            '    var script = document.querySelector("script[src*=\'" + url + "\']");\n' +
            '    if (!script) {\n' +
            "        var heads = document.getElementsByTagName('head');\n" +
            '        if (heads && heads.length) {\n' +
            '            var head = heads[0];\n' +
            '            if (head) {\n' +
            "                script = document.createElement('script');\n" +
            "                script.setAttribute('src', url);\n" +
            "                script.setAttribute('defer', true);\n" +
            "                script.setAttribute('type', 'text/javascript');\n" +
            '                head.appendChild(script);\n' +
            '            }\n' +
            '        }\n' +
            '    }\n' +
            '}\n' +
            'function insertLink(href) {\n' +
            '    var linkTag = document.querySelector("link[href*=\'" + href + "\']");\n' +
            '    if (!linkTag) {\n' +
            '        var heads = document.getElementsByTagName("head");\n' +
            '        if (heads && heads.length) {\n' +
            '            var head = heads[0];\n' +
            '            if (head) {\n' +
            "                linkTag = document.createElement('link');\n" +
            "                linkTag.setAttribute('href', href);\n" +
            "                linkTag.setAttribute('rel', 'Stylesheet');\n" +
            "                linkTag.setAttribute('type', 'text/css');\n" +
            '                head.appendChild(linkTag);\n' +
            '            }\n' +
            '        }\n' +
            '    }\n' +
            '}\n' +
            '\n' +
            'async function loadReusableComponents() {\n' +
            // TODO: polyfill here
            // eg
            // "    await insertScript('https://unpkg.com/@webcomponents/webcomponentsjs@2.2.10/webcomponents-bundle.js');\n" +
            // "    await insertScript('https://unpkg.com/@webcomponents/webcomponentsjs@2.2.10/custom-elements-es5-adapter.js');\n" +
            '\n' +
            // TODO dev address
            '    const root = ' +
            "location.hostname.startsWith('localhost') ? '/homepage-react/dist/development/' : '" +
            liveLocation +
            "'" +
            ';\n' +
            "    const locator = root + 'offSiteApps-js/';\n" +
            "    await insertScript(locator + 'vendor-" +
            hash +
            ".min.js');\n" +
            "    await insertScript(locator + 'main-" +
            hash +
            ".min.js');\n" +
            "    await insertLink(root + 'main-" +
            hash +
            ".min.css');\n" +
            '\n' +
            '}\n' +
            '\n' +
            'ready(loadReusableComponents);\n';

        compiler.hooks.done.tap(this.constructor.name, stats => {
            return new Promise((resolve, reject) => {
                fs.writeFile(this.options.filename, allData(stats.hash), 'utf8', error => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
            });
        });
    }
}

function recursiveIssuer(m) {
    if (m.issuer) {
        return recursiveIssuer(m.issuer);
    } else if (m.name) {
        return m.name;
    } else {
        return false;
    }
}

// per https://github.com/webpack-contrib/mini-css-extract-plugin/issues/45
// one entry per application
const siteCss = [
    {
        path: 'applications/uqlapp/',
        name: 'uqlapp',
        // primary: true, // unused
    },
    {
        path: 'applications/primo/',
        name: 'primo',
        // primary: true, // unused
    },
    {
        path: 'applications/rightnow/',
        name: 'rightnow',
        // primary: false, // unused
    },
];

const entryPoints = {
    main: resolve(__dirname, './src/offSiteAppWrapper-index.js'),
    vendor: ['react', 'react-dom', 'react-router-dom', 'redux', 'react-redux', 'moment'],
};
siteCss.forEach(entry => {
    const cssFile = resolve(__dirname, './src/' + entry.path + 'custom-styles.scss');
    // from https://stackoverflow.com/questions/40991518/webpack-check-file-exist-and-import-in-condition
    if (fs.existsSync(cssFile)) {
        entryPoints[entry.name] = cssFile;
    }
});
console.log('entryPoints = ', entryPoints);
const cacheGroups = {
    commons: {
        chunks: 'all',
    },
};
siteCss.forEach(entryPoint => {
    cacheGroups[entryPoint.name] = {
        name: entryPoint.name + '/load.js',
        test: (m, c, entry = entryPoint.name) => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
        chunks: 'all',
        enforce: true,
    };
});
console.log('cacheGroups = ', cacheGroups);
const webpackConfig = {
    mode: 'production',
    devtool: 'source-map',
    // The entry file. All your app roots from here.
    entry: entryPoints,
    // Where you want the output to go
    output: {
        path: resolve(__dirname, './dist/', config.basePath),
        filename: 'offSiteApps-js/[name]-[hash].min.js',
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
            // we want a hashed filename for main, but the offsite apps (eg primo) must have an unhashed name
            // or it is too hard to figureout what file to load
            // this works in v0.8 but did not work when I upgraded all the way to 1.3.6
            moduleFilename: ({ name }) => {
                return name === 'main' ? '[name]-[hash].min.css' : '[name].min.css';
            },
        }),
        new CreateOffSiteApp({
            filename: resolve(__dirname, './dist/') + '/' + config.basePath + 'offSiteAppWrapper.js',
            branch: branch,
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
            // from https://github.com/webpack-contrib/mini-css-extract-plugin/issues/45#issuecomment-425645975
            cacheGroups: cacheGroups,
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
                // exclude: [/src\/applications/],
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
