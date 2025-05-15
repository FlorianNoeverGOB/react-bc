import { merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import { LicenseWebpackPlugin } from 'license-webpack-plugin';
import common from './webpack.common.js';

export default merge(common, {
    mode: 'production',

    plugins: [
        new LicenseWebpackPlugin({
            outputFilename: 'licenses.txt',
        }),
    ],

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: { keep_classnames: true, keep_fnames: true },
                parallel: true,
                extractComments: false,
            }),
        ],
    },
});
