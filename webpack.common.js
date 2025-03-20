/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const packageJson = require('./package.json');


module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: `${packageJson.name}.bundle.js`,
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.svg$/,
                type: 'asset/inline'
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: 'asset/inline'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/inline'
            },
            {
                test: /\.html$/,
                use: ['html-loader'],
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx']
    },
};
