/**
 * External dependencies
 */
const process = require( 'node:process' );
const { resolve } = require( 'node:path' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const RemoveEmptyScriptsPlugin = require( 'webpack-remove-empty-scripts' );

/**
 * WordPress Dependencies
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config.js' );

module.exports = {
	// Default wordpress config
	...defaultConfig,
	entry: {
		// admin features
		'admin/js/panel': './src/admin/scripts/panel.js',
		'admin/css/components': './src/admin/styles/components.scss',
		'admin/css/panel': './src/admin/styles/panel.scss',

		// Frontend widgets
		/* eslint-disable */
		'frontend/js/reading-progress-bar': './src/widgets/reading-progress-bar/scripts.js',
		'frontend/css/reading-progress-bar': './src/widgets/reading-progress-bar/styles.scss',
		// 'frontend/js/reading-time': './src/widgets/reading-time/scripts.js',
		// 'frontend/css/reading-time': './src/widgets/reading-time/styles.scss',
		/* eslint-enable */
	},
	output: {
		...defaultConfig.output,
		path: resolve( process.cwd(), 'build' ),
		chunkFilename: 'static/chunks/[chunkhash].js',
		iife: false,
	},
	watchOptions: {
		ignored: [ '**/node_modules' ],
		aggregateTimeout: 500,
	},
	resolve: {
		...defaultConfig.resolve,
		alias: {
			...defaultConfig.resolve.alias,
			'@codecanel/admin': resolve( __dirname, 'src/admin/scripts/' ),
			'@codecanel/widget': resolve( __dirname, 'src/widgets/' ),
		},
	},
	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				type: 'asset',
			},
		],
	},
	plugins: [
		...defaultConfig.plugins.filter( function ( plugin ) {
			return ! [ 'CopyWebpackPlugin' ].includes(
				plugin.constructor.name
			);
		} ),
		new RemoveEmptyScriptsPlugin( { enabled: true } ),
		new CopyWebpackPlugin( {
			patterns: [
				{
					from: './src/static/scripts',
					noErrorOnMissing: true,
					to: resolve( process.cwd(), './build/static/js' ),
				},
				{
					from: './src/static/styles',
					noErrorOnMissing: true,
					to: resolve( process.cwd(), './build/static/css' ),
				},
				{
					from: './src/static/images',
					noErrorOnMissing: true,
					to: resolve( process.cwd(), './build/static/images' ),
				},
			],
		} ),
	],
	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000
	},
	optimization: {
		...defaultConfig.optimization,
		removeAvailableModules: true,
		removeEmptyChunks: true,
		minimize: defaultConfig.mode === 'production',
	},
	stats: {
		...defaultConfig.stats,
		relatedAssets: true,
		cachedAssets: true,
		reasons: true,
		source: true,
		errorDetails: true,
		logging: 'error',
	},
};
