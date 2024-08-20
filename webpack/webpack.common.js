const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const TerserPlugin = require('terser-webpack-plugin');
const packageJson = require('../package.json');

module.exports = {
    entry: path.resolve(__dirname, '..', './src/index.tsx'),
    resolve: {
        alias: {
            Assets: path.resolve(__dirname, '..', './src/assets/'),
            Components: path.resolve(__dirname, '..', './src/components/'),
            Pages: path.resolve(__dirname, '..', './src/pages/'),
            Utils: path.resolve(__dirname, '..', './src/utils/'),
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
                type: 'asset/resource',
                use: ['file-loader'],
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf)$/,
                type: 'asset/resource',
            }
        ],
    },
    output: {
        path: path.resolve(__dirname, '..', './build'),
        filename: `${packageJson.name}.bundle.js`,
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, '..', './src/index.html'),
            filename: 'index.html',
            clean: true,
        }),
        new Dotenv(),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        ascii_only: true,
                    },
                    keep_classnames: true, // important for AL to call functions by name
                    keep_fnames: true, // important for AL to call functions by name
                },
            }),
        ],
    }
}