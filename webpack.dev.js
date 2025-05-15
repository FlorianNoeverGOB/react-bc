import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { merge } from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import common from './webpack.common.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',

    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
            inject: 'body',
            publicPath: '/',
            favicon: resolve(__dirname, 'public/favicon.ico'),
        }),
    ],

    devServer: {
        static: { directory: join(__dirname, 'public') },
        port: 3000,
        hot: true,
        open: true,
        historyApiFallback: true,
    },
});
