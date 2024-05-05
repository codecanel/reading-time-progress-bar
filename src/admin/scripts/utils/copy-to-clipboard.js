export const copyToClipboard = ( text ) => {
	const textArea = document.createElement( 'textarea' );
	textArea.value = JSON.stringify( text );

	document.body.appendChild( textArea );

	textArea.focus();
	textArea.select();

	document.execCommand( 'copy' );

	document.body.removeChild( textArea );
};
