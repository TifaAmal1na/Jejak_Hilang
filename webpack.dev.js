const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'development',
	devServer: {
		static: [{ directory: path.join(__dirname, 'dist') }, { directory: path.join(__dirname, 'assets') }],
		compress: true,
		open: false,
		hot: true,
	},
	devtool: 'inline-source-map',
});
