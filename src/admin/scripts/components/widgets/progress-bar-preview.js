// External dependencies
import { __ } from '@wordpress/i18n';

export default function( { stateData } ) {
	let barHeight;
	let barStartOffset;
	let barBorderRadius;
	let barForegroundOpacity;
	let barBackgroundOpacity;

	const foregroundColor = stateData.progress_bar_foreground_color;
	const backgroundColor = stateData.progress_bar_background_color;

	const generatedBackgroundColor = `rgba(${ backgroundColor.r }, ${ backgroundColor.g }, ${ backgroundColor.b }, ${ backgroundColor.a })`;
	const generatedForegroundColor = `rgba(${ foregroundColor.r }, ${ foregroundColor.g }, ${ foregroundColor.b }, ${ foregroundColor.a })`;

	if ( !! stateData.progress_bar_height ) {
		barHeight = stateData.progress_bar_height < 100 ? Number.parseInt( stateData.progress_bar_height ) : 100;
	} else {
		barHeight = 10;
	}
	if ( !! stateData.progress_bar_offset ) {
		barStartOffset = stateData.progress_bar_offset < 1000 ? Number.parseInt( stateData.progress_bar_offset ) : 1000;
	} else {
		barStartOffset = 0;
	}
	if ( !! stateData.progress_bar_border_radius ) {
		barBorderRadius = stateData.progress_bar_border_radius < 100 ? Number.parseInt( stateData.progress_bar_border_radius ) : 100;
	} else {
		barBorderRadius = 0;
	}
	if ( 1 <= stateData.progress_bar_fg_offset <= 100 ) {
		barForegroundOpacity = `calc( ${ stateData.progress_bar_fg_offset } / 100 )`;
	} else {
		barForegroundOpacity = Number( stateData.progress_bar_fg_offset !== 0 ) || 1;
	}

	if ( 1 <= stateData.progress_bar_bg_offset <= 100 ) {
		barBackgroundOpacity = `calc( ${ stateData.progress_bar_bg_offset } / 100 )`;
	} else {
		barBackgroundOpacity = Number( stateData.progress_bar_bg_offset !== 0 ) || 1;
	}

	const Styles = {
		previewContainer: {
			left: `${ barStartOffset }px`,
			width: `calc(100% - ${ barStartOffset }px)`,
			height: `${ barHeight }px`,
			borderRadius: `${ barBorderRadius }px`,
			backgroundColor: generatedBackgroundColor,
			opacity: barBackgroundOpacity,
			position: 'relative',
			transition: '300ms ease-in-out',
		},
		previewProgressBar: {
			height: `${ barHeight }px`,
			backgroundColor: generatedForegroundColor,
			opacity: barForegroundOpacity,
		},
	};

	// Working with progress bar different style.
	const barStyle = stateData.progress_bar_style;
	const isRTL = document.body.classList.contains( 'rtl' );
	if ( barStyle.value === 'gradient' || barStyle.value === 'rounded-gradient' ) {
		delete Styles.previewContainer.backgroundColor;
		delete Styles.previewProgressBar.backgroundColor;
		const gradientPosition = isRTL ? 'to left' : 'to right';
		Styles.previewProgressBar.backgroundImage = `linear-gradient(${ gradientPosition }, ${ generatedBackgroundColor } 0%, ${ generatedForegroundColor } 100%)`;
	}

	if ( !! barBorderRadius && barBorderRadius !== 0 ) {
		Styles.previewContainer.overflow = 'hidden';
	}

	return (
		<div className={ 'progress-bar-preview' }>
			<p className={ 'preview-title' }>{ __( 'Preview', 'reading-time-progress-bar' ) }</p>
			<div className={ 'progress-bar-container ' + barStyle.value } style={ { ...Styles.previewContainer } }>
				<div className={ 'progress-bar' } style={ { ...Styles.previewProgressBar } } />
			</div>

			{ stateData.use_progress_bar_custom_css && (
				<style>{ stateData.progress_bar_custom_css_data }</style>
			) }
		</div>
	);
}
