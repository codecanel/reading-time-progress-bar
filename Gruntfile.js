/**
 * Internal dependencies
 */
const pkgJson = require( './package.json' );

module.exports = function ( grunt ) {
	const productType = pkgJson.packaging.type;
	const productSlugs = pkgJson.packaging.slugs[ productType ];

	const makePotExclude = [
		'.git/*',
		'@archives/*',
		'bin/*',
		'build/*',
		'node_modules/*',
		'tests/*',
		'tools/*',
		'vendor/*',
	];

	// Project configuration
	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),

		wp_readme_to_markdown: {
			your_target: {
				files: {
					'README.md': 'readme.txt',
				},
			},
		},

		makepot: {
			target: {
				options: {
					domainPath: '/languages',
					exclude: makePotExclude,
					mainFile: `plugin-freemium.php`,
					potFilename: `${ productSlugs.freemium }.pot`,
					potHeaders: {
						poedit: true,
						'x-poedit-keywordslist': true,
					},
					type: 'wp-plugin',
					updateTimestamp: true,
				},
			},
		},
	} );

	grunt.loadNpmTasks( 'grunt-wp-i18n' );
	grunt.loadNpmTasks( 'grunt-wp-readme-to-markdown' );

	grunt.registerTask( 'default', [ 'i18n', 'readme' ] );
	grunt.registerTask( 'i18n', [ 'makepot' ] );
	grunt.registerTask( 'readme', [ 'wp_readme_to_markdown' ] );

	grunt.util.linefeed = '\n';
};
