const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DotenvWebpackPlugin = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './templates/index.html',
			favicon: './favicon.ico',
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'favicon.ico', to: 'favicon.ico' },
				{ from: 'assets', to: 'assets' },
			],
		}),
		new DotenvWebpackPlugin(),
	],
};
