// External dependencies
import { useContext, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { toast } from 'react-toastify';

// Internal dependencies
import { cleanBackSlash, getBool } from '../../utils/helpers';
import { getSelectedFontData } from '../../utils/google-fonts';
import ApplicationContext from '../ApplicationContext';
import fontStyles from '../data/font-styles';
import fontSubsets from '../data/font-subsets';
import textField from '../elements/text-field';
import rangeField from '../elements/range-field';
import selectField from '../elements/select-field';
import textAlignments from '../data/text-alignments';
import checkboxField from '../elements/checkbox-field';
import LoadingSpinner from '../elements/loading-spinner';
import formSubmission from '../elements/form-submission';
import selectMultiField from '../elements/select-multi-field';
import colorPickerField from '../elements/color-picker-field';
import ControlledElementsWrapper from '../elements/controlled-elements-wrapper';
import codeEditorCodemirrorField from '../elements/code-editor-codemirror-field';

export default function() {
	const AppData = useContext( ApplicationContext );

	const TypographyFontOptions = useCallback( ( standardFonts, googleFonts ) => ( [
		{ label: 'Standard Fonts', options: standardFonts },
		{
			label: 'Google Fonts',
			options: [].map.call(
				googleFonts && googleFonts.items ? googleFonts.items : [],
				( font ) => ( {
					label: font.family,
					value: JSON.stringify( font ),
				} ),
			),
		},
	] ), [] );

	// Collect selected font.
	const isCurrentTabDisabled = getBool( AppData.state.is_reading_time_disable );
	const controlSaveState = getBool( AppData.state.is_time_control_save_request_sending );
	const styleSaveState = getBool( AppData.state.is_time_styles_save_request_sending );
	const controlChangesState = getBool( AppData.state.is_time_control_changes );
	const styleChangesState = getBool( AppData.state.is_time_styles_changes );

	// Texts
	const saveStateText = __( 'Save Changes', 'reading-time-progress-bar' );
	const savingStateText = __( 'Saving Changes', 'reading-time-progress-bar' );

	const saveControlFormData = ( event ) => {
		event.preventDefault();

		// Save all data from state to database.
		if ( ! isCurrentTabDisabled ) {
			AppData.saveState( {
				states: [
					'estimated_position',
					'reading_time_text_position',
					'reading_time_text_prefix',
					'reading_time_text_suffix',
					'reading_time_text_suffix_singular',
				],
				preUpdateStates: {
					is_time_control_save_request_sending: true,
				},
				postUpdateStates: {
					is_time_control_save_request_sending: false,
					is_time_control_changes: false,
					customToggles: {},
				},
				handleResponse( response ) {
					if ( response && response.success && 'updated' === response.message ) {
						toast.success( __( 'The update to reading time controls is complete and successful.', 'reading-time-progress-bar' ) );
					}
					if ( response && ! response.success && 'already_updated' === response.message ) {
						toast.error( __( 'Reading time settings are up-to-date', 'reading-time-progress-bar' ) );
					}
				},
			} );
		}
	};

	const saveStylesFormData = ( event ) => {
		event.preventDefault();

		// Save all data from state to database.
		if ( ! isCurrentTabDisabled ) {
			AppData.saveState( {
				states: [
					'reading_time_text_font',
					'reading_time_text_font_style',
					'reading_time_text_font_subset',
					'reading_time_text_font_text_align',
					'reading_time_text_font_size',
					'reading_time_text_font_line_height',
					'reading_time_text_color',
					'reading_time_text_bg_color',
					'use_reading_time_custom_css',
					'reading_time_custom_css_data',
				],
				preUpdateStates: {
					is_time_styles_save_request_sending: true,
				},
				postUpdateStates: {
					is_time_styles_save_request_sending: false,
					is_time_styles_changes: false,
					customToggles: {},
				},
				handleResponse( response ) {
					if ( response && response.success && 'updated' === response.message ) {
						toast.success( __( 'The update to reading time styles is complete and successful.', 'reading-time-progress-bar' ) );
					}
					if ( response && ! response.success && 'already_updated' === response.message ) {
						toast.error( __( 'Reading time styles are up-to-date', 'reading-time-progress-bar' ) );
					}
				},
			} );
		}
	};

	// State collections.
	const ControlStateCollections = [
		'estimated_position',
		'reading_time_text_position',
		'reading_time_text_prefix',
		'reading_time_text_suffix',
		'reading_time_text_suffix_singular',
	];
	const StylesStateCollections = [
		'reading_time_text_font',
		'reading_time_text_font_style',
		'reading_time_text_font_subset',
		'reading_time_text_font_text_align',
		'reading_time_text_font_size',
		'reading_time_text_font_line_height',
		'reading_time_text_color',
		'reading_time_text_bg_color',
		'use_reading_time_custom_css',
		'reading_time_custom_css_data',
	];

	const dataDiscardStyles = {
		cursor: AppData.isFreshInstallation ? 'not-allowed' : 'pointer',
		opacity: AppData.isFreshInstallation ? '0.6' : '1',
		pointerEvents: AppData.isFreshInstallation ? 'none' : 'all'
	};

	return (
		<>
			<div className='container section-reading-time-control-settings'>
				<ControlledElementsWrapper attributes={ [ 'is_reading_time_disable' ] } showNotice={ true } checkInit={ true }>
					<header className='container-section'>
						<div className='section-heading'>
							<h2 className='section-heading-title'>
								{ __( 'Control Settings', 'reading-time-progress-bar' ) }
							</h2>
							<p className='section-heading-description'>
								{ __(
									'Control the core settings of the reading time, e.g. the the average count of words that humans can read in a minute & allow the reading time on particular post types, etc.',
									'reading-time-progress-bar',
								) }
							</p>
						</div>
					</header>
					<form className='section-form' onSubmit={ saveControlFormData }>
						<section className={ controlSaveState ? 'loading' : 'loaded' }>
							<LoadingSpinner />
							<fieldset className='form-contianer'>
								{ selectMultiField( {
									attr: {
										label: __( 'Display On', 'reading-time-progress-bar' ),
										name: 'estimated_positions',
										value: AppData.state.estimated_position,
										options: AppData.state.dynamic_data.estimatedPosition,
										onChange( optionValue ) {
											if ( ! isCurrentTabDisabled ) {
												AppData.updateState( {
													estimated_position: optionValue,
													is_time_control_changes: true,
												} );
											}
										},
									},
								} ) }

								{ selectField( {
									attr: {
										label: __( 'Reading Time Text Placement', 'reading-time-progress-bar' ),
										name: 'reading_time_text_positions',
										value: [ AppData.state.reading_time_text_position ],
										options: AppData.state.dynamic_data.textPositions,
										onChange( optionValue ) {
											if ( ! isCurrentTabDisabled ) {
												AppData.updateState( {
													reading_time_text_position: optionValue,
													is_time_control_changes: true,
												} );
											}
										},
									},
								} ) }

								{ textField( {
									attr: {
										label: __( 'Reading Time Text Prefix', 'reading-time-progress-bar' ),
										name: 'time-text-prefix',
										value: AppData.state.reading_time_text_prefix,
										onChange( event ) {
											if ( ! isCurrentTabDisabled ) {
												AppData.updateState( {
													reading_time_text_prefix: event.target.value,
													is_time_control_changes: true,
												} );
											}
										},
									},
								} ) }

								{ textField( {
									attr: {
										label: __( 'Reading Time Text Suffix', 'reading-time-progress-bar' ),
										name: 'time-text-suffix',
										value: AppData.state.reading_time_text_suffix,
										onChange( event ) {
											if ( ! isCurrentTabDisabled ) {
												AppData.updateState( {
													reading_time_text_suffix: event.target.value,
													is_time_control_changes: true,
												} );
											}
										},
									},
								} ) }

								{ textField( {
									attr: {
										label: __( 'Reading Time Text Suffix (Singular)', 'reading-time-progress-bar' ),
										name: 'time-text-suffix-singular',
										value: AppData.state.reading_time_text_suffix_singular,
										onChange( event ) {
											if ( ! isCurrentTabDisabled ) {
												AppData.updateState( {
													reading_time_text_suffix_singular: event.target.value,
													is_time_control_changes: true,
												} );
											}
										},
									},
								} ) }
							</fieldset>
						</section>
						<footer>
							{ formSubmission( {
								attr: {
									submit_text: ( controlSaveState && ! isCurrentTabDisabled ) ? savingStateText : saveStateText,
									reset_text: __( 'Discard Changes', 'reading-time-progress-bar' ),
									show_reset_button: true,
									onDiscarded() {
										AppData.resetSavedState( ControlStateCollections, {
											is_time_control_save_request_sending: false,
											is_time_control_changes: false,
											customToggles: {},
										} );
									},
									wrapperStyle: {
										transition: 'opacity 300ms ease-in-out 0ms, height 300ms ease-in-out 0ms',
										opacity: Number( ! isCurrentTabDisabled && ( controlChangesState || AppData.isFreshInstallation ) ),
										height: ! isCurrentTabDisabled && ( controlChangesState || AppData.isFreshInstallation ) ? '' : '0',
										padding: ! isCurrentTabDisabled && ( controlChangesState || AppData.isFreshInstallation ) ? '' : '0',
									},
									discardStyle: dataDiscardStyles,
								},
							} ) }
						</footer>
					</form>
				</ControlledElementsWrapper>
			</div>
			<div className='container section-reading-time-styles-settings'>
				<ControlledElementsWrapper attributes={ [ 'is_reading_time_disable' ] } showNotice={ true } checkInit={ true }>
					<header className='container-section'>
						<div className='section-heading'>
							<h2 className='section-heading-title'>
								{ __( 'Styles', 'reading-time-progress-bar' ) }
							</h2>
							<p className='section-heading-description'>
								{ __( 'Set typography, text color and others styles.', 'reading-time-progress-bar' ) }
							</p>
						</div>
					</header>
					<form className='section-form' onSubmit={ saveStylesFormData }>
						<section className={ styleSaveState ? 'loading' : 'loaded' }>
							<LoadingSpinner />
							<fieldset className='form-contianer'>
								<div className={ 'form-field-inline' }>
									{ selectField( {
										attr: {
											label: __( 'Font Family', 'reading-time-progress-bar' ),
											name: 'reading_time_text_font',
											value: [ {
												label: cleanBackSlash( AppData.state.reading_time_text_font.label ),
												value: cleanBackSlash( AppData.state.reading_time_text_font.value ),
											} ],
											options: TypographyFontOptions(
												AppData.state.dynamic_data.standardFonts,
												AppData.state.dynamic_data.googleFonts,
											),
											onChange( optionValue ) {
												if ( ! isCurrentTabDisabled ) {
													AppData.updateState( {
														reading_time_text_font: optionValue,
														is_time_styles_changes: true,
													} );
												}
											},
										},
									} ) }

									{ selectField( {
										attr: {
											label: __( 'Font Style', 'reading-time-progress-bar' ),
											name: 'reading_time_text_font_style',
											value: [ AppData.state.reading_time_text_font_style ],
											options: fontStyles( getSelectedFontData( AppData.state.reading_time_text_font ) ),
											onChange( optionValue ) {
												if ( ! isCurrentTabDisabled ) {
													AppData.updateState( {
														reading_time_text_font_style: optionValue,
														is_time_styles_changes: true,
													} );
												}
											},
										},
									} ) }
								</div>

								<div className={ 'form-field-inline' }>
									{ selectField( {
										attr: {
											label: __( 'Font Subsets', 'reading-time-progress-bar' ),
											name: 'reading_time_text_font_subsets',
											value: [ AppData.state.reading_time_text_font_subset ],
											options: fontSubsets( getSelectedFontData( AppData.state.reading_time_text_font ) ),
											onChange( optionValue ) {
												if ( ! isCurrentTabDisabled ) {
													AppData.updateState( {
														reading_time_text_font_subset: optionValue,
														is_time_styles_changes: true,
													} );
												}
											},
										},
									} ) }
									{ selectField( {
										attr: {
											label: __( 'Text Alignment', 'reading-time-progress-bar' ),
											name: 'reading_time_text_font_text_align',
											value: [ AppData.state.reading_time_text_font_text_align ],
											options: textAlignments,
											onChange( optionValue ) {
												if ( ! isCurrentTabDisabled ) {
													AppData.updateState( {
														reading_time_text_font_text_align: optionValue,
														is_time_styles_changes: true,
													} );
												}
											},
										},
									} ) }
								</div>

								<div className={ 'form-field-inline' }>
									{ rangeField( {
										attr: {
											label: __( 'Font Size', 'reading-time-progress-bar' ),
											name: 'font_size',
											min: 0,
											max: 40,
											step: 1,
											value: AppData.state.reading_time_text_font_size,
											onChange( value ) {
												if ( ! isCurrentTabDisabled ) {
													AppData.updateState( {
														reading_time_text_font_size: value,
														is_time_styles_changes: true,
													} );
												}
											},
										},
									} ) }

									{ rangeField( {
										attr: {
											label: __( 'Line Height', 'reading-time-progress-bar' ),
											name: 'font_line_height',
											min: 0,
											max: 5,
											step: 0.1,
											value: AppData.state.reading_time_text_font_line_height,
											onChange( value ) {
												if ( ! isCurrentTabDisabled ) {
													AppData.updateState( {
														reading_time_text_font_line_height: value,
														is_time_styles_changes: true,
													} );
												}
											},
										},
									} ) }
								</div>

								{ colorPickerField( {
									attr: {
										style: { display: 'flex', gap: '2rem' },
										label: __( 'Text Color', 'reading-time-progress-bar' ),
										attribute: 'time_text_color',
										tracker: 'is_time_text_color_open',
										value: AppData.state.reading_time_text_color,
										customToggles: AppData.state.customToggles,
										onChange( color ) {
											if ( ! isCurrentTabDisabled ) {
												AppData.updateState( {
													reading_time_text_color: color,
													is_time_styles_changes: true,
												} );
											}
										},
										onToggleChange( tracker ) {
											AppData.updateState( {
												customToggles: {
													[ tracker ]: ! getBool( AppData.state.customToggles[ tracker ] ),
												},
											} );
										},
									},
								} ) }

								{ colorPickerField( {
									attr: {
										style: { display: 'flex', gap: '2rem' },
										label: __( 'Background Color', 'reading-time-progress-bar' ),
										attribute: 'time_text_bg_color',
										tracker: 'is_time_text_bg_color_open',
										value: AppData.state.reading_time_text_bg_color,
										customToggles: AppData.state.customToggles,
										onChange( color ) {
											if ( ! isCurrentTabDisabled ) {
												AppData.updateState( {
													reading_time_text_bg_color: color,
													is_time_styles_changes: true,
												} );
											}
										},
										onToggleChange( tracker ) {
											AppData.updateState( {
												customToggles: {
													[ tracker ]: ! getBool( AppData.state.customToggles[ tracker ] ),
												},
											} );
										},
									},
								} ) }

								{ checkboxField( {
									attr: {
										label: __( 'Use Custom CSS', 'reading-time-progress-bar' ),
										name: 'use-reading-time-custom-css',
										value: getBool( AppData.state.use_reading_time_custom_css ),
										onChange( isChecked ) {
											if ( ! isCurrentTabDisabled ) {
												AppData.updateState( {
													use_reading_time_custom_css: isChecked,
													is_time_styles_changes: true,
												} );
											}
										},
									},
								} ) }

								{ getBool( AppData.state.use_reading_time_custom_css ) && codeEditorCodemirrorField( {
									attr: {
										label: __( 'Custom CSS', 'reading-time-progress-bar' ),
										language: 'css',
										value: AppData.state.reading_time_custom_css_data,
										onChange( value ) {
											AppData.updateState( {
												reading_time_custom_css_data: value,
												is_time_styles_changes: true,
											} );
										}
									},
								} ) }
							</fieldset>
						</section>
						<footer>
							{ formSubmission( {
								attr: {
									submit_text: ( styleSaveState && ! isCurrentTabDisabled ) ? savingStateText : saveStateText,
									reset_text: __( 'Discard Changes', 'reading-time-progress-bar' ),
									show_reset_button: true,
									onDiscarded() {
										AppData.resetSavedState( StylesStateCollections, {
											is_time_styles_save_request_sending: false,
											is_time_styles_changes: false,
											customToggles: {},
										} );
									},
									wrapperStyle: {
										transition: 'opacity 300ms ease-in-out 0ms, height 300ms ease-in-out 0ms',
										opacity: Number( ! isCurrentTabDisabled && ( styleChangesState || AppData.isFreshInstallation ) ),
										height: ! isCurrentTabDisabled && ( styleChangesState || AppData.isFreshInstallation ) ? '' : '0',
										padding: ! isCurrentTabDisabled && ( styleChangesState || AppData.isFreshInstallation ) ? '' : '0',
									},
									discardStyle: dataDiscardStyles,
								},
							} ) }
						</footer>
					</form>
				</ControlledElementsWrapper>
			</div>
		</>
	);
}
