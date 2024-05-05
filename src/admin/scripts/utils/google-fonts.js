import { isJson } from '@codecanel/admin/utils/helpers.js';

export const encodeString = ( content ) => {
	return content.toString().replaceAll( ' ', '+' );
};

export const getSelectedFontData = ( currentFont ) => {
	if ( currentFont ) {
		if ( isJson( currentFont.value ) ) {
			return JSON.parse( currentFont.value );
		}
		return currentFont;
	}
	return '';
};

export const getFontVariantData = ( variant ) => {
	const variantData = variant.toString();
	let modifiedVariant;

	if ( variantData === 'regular' ) {
		modifiedVariant = '400';
	} else if ( variantData === 'italic' ) {
		modifiedVariant = '400 Italic';
	} else if ( variantData.endsWith( 'italic' ) ) {
		modifiedVariant = variantData.replace( 'italic', ' Italic' );
	} else {
		modifiedVariant = variantData;
	}

	return modifiedVariant.toString();
};

// eslint-disable-next-line
export const getFontVariants = ( variants ) => [].map.call( variants || [], getFontVariantData );

export const getFontItalicVariants = ( variants ) => [].filter.call(
	variants || [],
	( variant ) => {
		return variant.toString().toLowerCase().endsWith( 'italic' );
	} );

export const getFontRegularVariants = ( variants ) => [].filter.call(
	variants || [],
	( variant ) => {
		return ! variant.toString().toLowerCase().endsWith( 'italic' );
	} );

export const encodeFontVariants = ( variants ) => {
	const regularVariants = getFontRegularVariants( variants );
	const italicVariants = getFontItalicVariants( variants );

	let joinedVariants = regularVariants.join( ';' );
	const suffix = italicVariants.length ? 'ital,' : '';

	if ( italicVariants.length ) {
		const regularVariantJoined = regularVariants.join( ';0,' );
		const italicVariantJoins = regularVariants.join( ';1,' );
		joinedVariants = `0,${ regularVariantJoined };1,${ italicVariantJoins }`;
	}

	return `${ suffix }wght@${ joinedVariants }`;
};
