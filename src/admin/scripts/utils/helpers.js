export const ucFirst = ( str ) => {
	str = str.replace( /(\-|\_)/g, ' ' );
	return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
};

export const getNumberFromString = ( string ) => {
	if ( !! string.toString() && string.toString().match( /\d+/ ) ) {
		return Number( string.toString().match( /\d+/ ).join() );
	}

	return 0;
};

export const getBool = ( variable = '' ) => {
	return variable.toString().toLowerCase() === 'true';
};

export const cleanBackSlash = ( content ) => {
	return content.toString().replaceAll( '\\', '' );
};

export const isJson = ( content ) => {
	try {
		JSON.parse( String.prototype.toString.call( content ) );
		return true;
	} catch ( e ) {
		return false;
	}
};
