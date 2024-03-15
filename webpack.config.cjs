const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	target: 'node',
	entry: './dist/cli.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'cli.bundle.js',
	},
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin()],
	},
	resolve: {
		fullySpecified: false, // to correctly handle 'import React from 'react';'
	},
};
