// External dependencies
import path from 'node:path';
import * as fs from 'node:fs';
import process from 'node:process';
import AdmZip from 'adm-zip';
import fastGlob from 'fast-glob';
import npmPackList from 'npm-packlist';

// Internal dependencies
import fileSize from './file-size.mjs';

// Initiate local variables.
let files = [];
const { sync: glob } = fastGlob;
const { sync: packList } = npmPackList;

// Initiate dynamic variables.
const isProVersion = process.argv.includes( '--target=pro' );
const isWpOrgVersion = process.argv.includes( '--target=wporg' );
const pkgJsonPath = path.resolve( process.cwd(), './package.json' );
const pkgJson = JSON.parse( fs.readFileSync( pkgJsonPath, { encoding: 'utf-8' } ), );
const ProductType = pkgJson.packaging.type;
const ProductSlugs = pkgJson.packaging.slugs;
let ProductFile = isProVersion ? ProductSlugs.archive.premium : ProductSlugs.archive.freemium;
const ProductName = isProVersion ? ProductSlugs[ ProductType ].premium : ProductSlugs[ ProductType ].freemium;

const zip = new AdmZip( undefined, {} );

if (pkgJson.hasOwnProperty( 'files' )) {
	process.stdout.write( 'Using the `files` field from `package.json` to detect files:\n\n', );
	files = packList();
} else {
	let defaultFiles;
	const ignoredFiles = [];
	const defaultCommonFiles =
	pkgJson.packaging && pkgJson.packaging.common ? pkgJson.packaging.common : [];

	if (process.argv.includes( '--target=src' )) {
		ProductFile += '-src';
		const SourceZipFiles = [ '*.*', '*/**/*.*', '!@archives/*', '!.yarn/*', '!.git/**/*', '!bin/**/*', '!node_modules/**/*', '!vendor/**/*', '!*.phar', '!*.zip' ];
		defaultFiles = Array.prototype.concat( defaultCommonFiles, SourceZipFiles );
	} else if (isProVersion) {
		const proPackagingFiles = pkgJson.packaging && pkgJson.packaging.premium ? pkgJson.packaging.premium : [];
		defaultFiles = Array.prototype.concat( defaultCommonFiles, proPackagingFiles, );
	} else {
		const assetFiles = isWpOrgVersion ? 'wporg' : 'freemium';
		const freemiumPackagingFiles = pkgJson.packaging && pkgJson.packaging[ assetFiles ] ? pkgJson.packaging[ assetFiles ] : [];
		defaultFiles = Array.prototype.concat( defaultCommonFiles, freemiumPackagingFiles, );
	}

	files = glob( Array.prototype.concat( ignoredFiles, defaultFiles ), {
		caseSensitiveMatch: false,
	} );
}

process.stdout.write( `\nCreating archive for \`${ ProductFile }\` plugin... 🎁\n\n`, );

let actualSize = 0;
const collectedFiles = files.sort();
const allDirectories = collectedFiles.filter( ( file ) =>
	file.includes( '/' ),
);
const allFiles = collectedFiles.filter( ( file ) => !file.includes( '/' ) );

[ ...allDirectories, ...allFiles ].forEach( ( file ) => {
	const zipDirectory = path.dirname( file );
	const virtualPath = zipDirectory !== '.' ? zipDirectory : '';
	const zipPath = `${ ProductName }/${ virtualPath }`;

	// calculate file size from the current file.
	const fileStats = fs.statSync( file ).size;
	actualSize += fileStats;

	const DevFileNames = [ 'plugin-premium.php', 'plugin-freemium.php' ];
	if ( ProductType === 'plugin' && !process.argv.includes( '--target=src' ) && DevFileNames.includes( file ) ) {
		process.stdout.write( `  Adding \`${ ProductName }.php\` (size: ${ fileSize( fileStats, ) }).\n`, );
		zip.addLocalFile( file, zipPath, `${ ProductName }.php` );
	} else {
		process.stdout.write( `  Adding \`${ file }\` (size: ${ fileSize( fileStats ) }).\n`, );
		zip.addLocalFile( file, zipPath );
	}
} );

if (!fs.existsSync( path.dirname( `./${ ProductFile }.zip` ) )) {
	fs.mkdirSync( path.dirname( `./${ ProductFile }.zip` ) );
}

// Write the archive file in the disk.
zip.writeZip( `./${ ProductFile }.zip`, null );

if (fs.existsSync( `./${ ProductFile }.zip` )) {
	// Calculate archive file size.
	const stats = fs.statSync( `./${ ProductFile }.zip` );
	process.stdout.write( '\nBuild Status: Done. Ready for use! 🎉.' );
	process.stdout.write( `\nProduct File: ${ ProductFile }.zip` );
	process.stdout.write( `\nProduct Size: ${ fileSize( stats.size ) } (COMPRESSED), ${ fileSize( actualSize, ) } (ACTUAL)\n`, );
}
