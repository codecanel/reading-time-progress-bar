// External dependencies
import { __ } from '@wordpress/i18n';

// Internal dependencies
import { cleanBackSlash, isJson } from '../../utils/helpers';
import { encodeFontVariants, encodeString, getFontVariants } from '../../utils/google-fonts';

export default function( { stateData } ) {
	const selectedFont = stateData.reading_time_text_font;
	const textColor = stateData.reading_time_text_color;
	const bgColor = stateData.reading_time_text_bg_color;
	const textSize = stateData.reading_time_text_font_size;
	let modifiedValue = cleanBackSlash( selectedFont.value );
	let fontUrl = '';
	let textFontWeight = 400;
	let textFontStyle = 'normal';

	if ( isJson( modifiedValue ) && !! Object.keys( JSON.parse( modifiedValue ) ).length ) {
		const fontData = JSON.parse( modifiedValue );
		const fontFamilyName = encodeString( fontData.family );
		const fontVariants = getFontVariants( fontData.variants );
		const variantsURL = encodeFontVariants( fontVariants );
		const textSubset = stateData.reading_time_text_font_subset.value;

		const fontSubset = !! textSubset ? `&subset=${ textSubset }` : '';
		fontUrl = `\n/* Load google font when needed */\n@import url('https://fonts.googleapis.com/css2?family=${ fontFamilyName }:${ variantsURL }&display=swap${ fontSubset }');`;
		modifiedValue = `'${ fontData.family }', ${ fontData.category }`;
	}

	const textWeight = stateData.reading_time_text_font_style.value;
	if ( textWeight.toLowerCase().endsWith( 'italic' ) ) {
		textFontStyle = 'italic';
		textFontWeight = textWeight.split( ' ' ).shift();
	} else {
		textFontWeight = textWeight;
	}

	const textColorValue = `rgba(${ textColor.r }, ${ textColor.g }, ${ textColor.b }, ${ textColor.a })`;
	const bgColorValue = `rgba(${ bgColor.r }, ${ bgColor.g }, ${ bgColor.b }, ${ bgColor.a })`;
	const fontFamily = !! selectedFont.value ? `font-family: ${ modifiedValue };` : '';
	const fontSize = ! isNaN( textSize ) ? `${ textSize }px` : textSize;

	const stylesheet = `
	${ fontUrl }


	/* Generate stylesheet for preview */
	.reading-time-preview .reading-time-container {
		${ fontFamily }
		font-weight: ${ textFontWeight || 400 };
		font-style: ${ textFontStyle };
		color: ${ textColorValue };
		font-size: ${ fontSize || '16px' };
		text-align: ${ stateData.reading_time_text_font_text_align.value || 'left' };
		line-height: ${ stateData.reading_time_text_font_line_height || '1.5' };
		background-color: ${ bgColorValue };
		padding: 0.2em 0.4em;
	}
	`;

	return (
		<div className={ 'reading-time-preview' }>
			<style>{ stylesheet }</style>
			<p className={ 'preview-title' }>{ __( 'Preview', 'reading-time-progress-bar' ) }</p>
			<div className={ 'reading-time-container' }>
				{ __( 'Discover a World of Limitless WordPress Possibilities.', 'reading-time-progress-bar' ) }
			</div>
		</div>
	);
}
