export default function ( statSize ) {
	const fileSizeKB = statSize / 1024; // file size in KB
	const fileSizeMB = statSize / ( 1024 * 1024 ); // file size in MB
	const fileSize = fileSizeKB < 1024 ? fileSizeKB : fileSizeMB;
	const fileFormat = fileSizeKB < 1024 ? 'KB' : 'MB';
	return `${ fileSize.toFixed( 2 ) }${ fileFormat }`;
}
