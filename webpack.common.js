import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import pkg from './package.json' with { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
    entry: './src/index.tsx',

    output: {
        path: resolve(__dirname, 'dist'),
        filename: `${pkg.name}.bundle.js`,
        clean: true,
    },

    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                // use: { loader: 'ts-loader', options: { transpileOnly: true } },
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "@babel/preset-env",
                                "@babel/preset-react",
                                "@babel/preset-typescript",
                            ],
                        },
                    },
                ],
            },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.svg$/, type: 'asset/inline' },
            { test: /\.(png|jpe?g|gif)$/i, type: 'asset/inline' },
            { test: /\.(woff2?|eot|ttf|otf)$/i, type: 'asset/inline' },
            { test: /\.html$/, use: ['html-loader'] },
        ],
    },

    resolve: { extensions: ['.tsx', '.ts', '.js', '.jsx'] },
};
