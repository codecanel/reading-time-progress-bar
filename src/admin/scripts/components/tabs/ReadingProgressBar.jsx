// External dependencies
import { useContext } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { toast } from 'react-toastify';

// Internal dependencies
import { getBool } from '../../utils/helpers';
import ApplicationContext from '../ApplicationContext';
import rangeField from '../elements/range-field';
import selectField from '../elements/select-field';
import checkboxField from '../elements/checkbox-field';
import formSubmission from '../elements/form-submission';
import LoadingSpinner from '../elements/loading-spinner';
import colorPickerField from '../elements/color-picker-field';
import ProgressBarStyleTemplate from '../data/progress-bar-style-template';
import ControlledElementsWrapper from '../elements/controlled-elements-wrapper';
import codeEditorCodemirrorField from '../elements/code-editor-codemirror-field';

export default function() {
	const AppData = useContext( ApplicationContext );

	const isCurrentTabDisabled = getBool( AppData.state.is_reading_progress_bar_disable );
	const controlSaveState = getBool( AppData.state.is_progress_bar_control_save_request_sending );
	const styleSaveState = getBool( AppData.state.is_progress_bar_styles_save_request_sending );
	const controlChangesState = getBool( AppData.state.is_progress_bar_control_changes );
	const styleChangesState = getBool( AppData.state.is_progress_bar_styles_changes );

	// Texts
	const saveStateText = __( 'Save Changes', 'reading-time-progress-bar' );
	const savingStateText = __( 'Saving Changes', 'reading-time-progress-bar' );

	// State collections.
	const ControlStateCollections = [
		'progress_bar_position',
		'progress_bar_height',
		'progress_bar_content_offset',
		'progress_bar_fg_offset',
		'progress_bar_bg_offset',
	];
	const StylesStateCollections = [
		'progress_bar_style',
		'progress_bar_foreground_color',
		'progress_bar_background_color',
		'progress_bar_border_radius',
		'use_progress_bar_custom_css',
		'progress_bar_custom_css_data',
	];

	const saveControlFormData = ( event ) => {
		event.preventDefault();

		// Save all data from state to database.
		if ( ! isCurrentTabDisabled ) {
			AppData.saveState( {
				states: ControlStateCollections,
				preUpdateStates: {
					is_progress_bar_control_save_request_sending: true,
				},
				postUpdateStates: {
					is_progress_bar_control_save_request_sending: false,
					is_progress_bar_control_changes: false,
				},
				handleResponse( response ) {
					if ( response && response.success && 'updated' === response.message ) {
						toast.success( __( 'The update to reading progress bar controls is complete and successful.', 'reading-time-progress-bar' ) );
					}
					if ( response && ! response.success && 'already_updated' === response.message ) {
						toast.error( __( 'Reading progress bar settings are up-to-date', 'reading-time-progress-bar' ) );
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
				states: StylesStateCollections,
				preUpdateStates: {
					is_progress_bar_styles_save_request_sending: true,
				},
				postUpdateStates: {
					is_progress_bar_styles_save_request_sending: false,
					is_progress_bar_styles_changes: false,
					customToggles: {},
				},
				handleResponse( response ) {
					if ( response && response.success && 'updated' === response.message ) {
						toast.success( __( 'The update to reading progress bar styles is complete and successful.', 'reading-time-progress-bar' ) );
					}
					if ( response && ! response.success && 'already_updated' === response.message ) {
						toast.error( __( 'Reading progress bar styles are up-to-date', 'reading-time-progress-bar' ) );
					}
				},
			} );
		}
	};

	const customStyles = {
		opacity: Number( AppData.state.progress_bar_style.value !== 'ios' ),
		height: AppData.state.progress_bar_style.value !== 'ios' ? '' : 0,
		marginBottom: AppData.state.progress_bar_style.value !== 'ios' ? '' : 0,
		transition: '300ms ease-in-out',
	};

	const dataDiscardStyles = {
		cursor: AppData.isFreshInstallation ? 'not-allowed' : 'pointer',
		opacity: AppData.isFreshInstallation ? '0.6' : '1',
		pointerEvents: AppData.isFreshInstallation ? 'none' : 'all'
	};

	return (
		<>
			<div className='container section-reading-progress-bar-control-settings'>
				<ControlledElementsWrapper attributes={ [ 'is_reading_progress_bar_disable' ] } showNotice={ true } checkInit={ true }>
					<header className='container-section'>
						<div className='section-heading'>
							<h2 className='section-heading-title'> Control Settings </h2>
							<p className='section-heading-description'> Configure how progress bars are displayed
								and interact with your readers. Adjust the pace of progress, visibility triggers,
								and positioning. Customize these settings to offer an intuitive and visually
								pleasing reading journey that complements your content and enhances user
								engagement. </p>
						</div>
					</header>
					<form className='section-form' onSubmit={ saveControlFormData }>
						<section className={ controlSaveState ? 'loading' : 'loaded' }>
							<LoadingSpinner />
							<fieldset className='form-contianer'>
								{ selectField( {
									attr: {
										label: 'Display Position',
										name: 'progress-bar-display-positions',
										value: [ AppData.state.progress_bar_position ],
										options: [ { label: 'Top', value: 'top' }, {
											label: 'Bottom',
											value: 'bottom',
										} ],
										onChange( optionValue ) {
											if ( ! isCurrentTabDisabled ) {
												AppData.updateState( {
													progress_bar_position: optionValue,
													is_progress_bar_control_changes: true,
												} );
											}
										},
									},
								} ) }

								{ rangeField( {
									attr: {
										label: 'Bar Height (Pixels)',
										name: 'progress-bar-height',
										min: 1,
										max: 100,
										value: AppData.state.progress_bar_height,
										roundValue: true,
										onChange( value ) {
											if ( ! isCurrentTabDisabled ) {
												AppData.updateState( {
													progress_bar_height: value,
													is_progress_bar_control_changes: true,
												} );
											}
										},
									},
								} ) }

								{ rangeField( {
									attr: {
										label: 'Content Offset (Pixels)',
										name: 'progress-bar-content-offset',
										min: 0,
										max: 1000,
										value: AppData.state.progress_bar_content_offset,
										roundValue: true,
										onChange( value ) {
											if ( ! isCurrentTabDisabled ) {
												AppData.updateState( {
													progress_bar_content_offset: value,
													is_progress_bar_control_changes: true,
												} );
											}
										},
									},
								} ) }

								{ rangeField( {
									attr: {
										label: 'Foreground Opacity',
										name: 'progress-bar-fg-offset',
										min: 0,
										max: 100,
										value: AppData.state.progress_bar_fg_offset,
										roundValue: true,
										onChange( value ) {
											if ( ! isCurrentTabDisabled ) {
												AppData.updateState( {
													progress_bar_fg_offset: value,
													is_progress_bar_control_changes: true,
												} );
											}
										},
									},
								} ) }

								{ rangeField( {
									attr: {
										label: 'Background Opacity',
										name: 'progress-bar-bg-offset',
										min: 0,
										max: 100,
										value: AppData.state.progress_bar_bg_offset,
										roundValue: true,
										onChange( value ) {
											if ( ! isCurrentTabDisabled ) {
												AppData.updateState( {
													progress_bar_bg_offset: value,
													is_progress_bar_control_changes: true,
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
									submit_text: controlSaveState && ! isCurrentTabDisabled ? savingStateText : saveStateText,
									reset_text: __( 'Discard Changes', 'reading-time-progress-bar' ),
									show_reset_button: true,
									onDiscarded() {
										AppData.resetSavedState( ControlStateCollections, {
											is_progress_bar_control_save_request_sending: false,
											is_progress_bar_control_changes: false,
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
			<div className='container section-reading-progress-bar-styles-settings'>
				<ControlledElementsWrapper attributes={ [ 'is_reading_progress_bar_disable' ] } showNotice={ true } checkInit={ true }>
					<header className='container-section'>
						<div className='section-heading'>
							<h2 className='section-heading-title'> Styles </h2>
							<p className='section-heading-description'>
								Tailor the appearance and behavior of the
								progress bar to suit your preferences. Customize its color, size, and position to
								seamlessly integrate it with design. Adjust the animation and interaction to create
								a captivating reading experience that resonates with your audience.
							</p>
						</div>
					</header>
					<form className='section-form' onSubmit={ saveStylesFormData }>
						<section className={ styleSaveState ? 'loading' : 'loaded' }>
							<LoadingSpinner />
							<fieldset className='form-contianer'>
								{ selectField( {
									attr: {
										label: 'Bar Style',
										name: 'progress-progress-bar-style',
										value: [ AppData.state.progress_bar_style ],
										options: ProgressBarStyleTemplate,
										onChange( optionValue ) {
											if ( ! isCurrentTabDisabled ) {
												AppData.updateState( {
													progress_bar_style: optionValue,
													is_progress_bar_styles_changes: true,
												} );
											}
										},
									},
								} ) }

								{ colorPickerField( {
									attr: {
										style: { display: 'flex', gap: '2rem', ...customStyles },
										label: AppData.state.progress_bar_style.value === 'gradient' ? 'Gradient Start Color' : 'Foreground Color',
										attribute: 'progress-bar-foreground-color',
										tracker: 'is_progress-bar-foreground-color_open',
										value: AppData.state.progress_bar_foreground_color,
										customToggles: AppData.state.customToggles,
										onChange( color ) {
											if ( ! isCurrentTabDisabled ) {
												AppData.updateState( {
													progress_bar_foreground_color: color,
													is_progress_bar_styles_changes: true,
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
										style: { display: 'flex', gap: '2rem', ...customStyles },
										label: AppData.state.progress_bar_style.value === 'gradient' ? 'Gradient End Color' : 'Background Color',
										attribute: 'progress-bar-background-color',
										tracker: 'is_progress-bar-background-color_open',
										value: AppData.state.progress_bar_background_color,
										customToggles: AppData.state.customToggles,
										onChange( color ) {
											if ( ! isCurrentTabDisabled ) {
												AppData.updateState( {
													progress_bar_background_color: color,
													is_progress_bar_styles_changes: true,
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

								{ rangeField( {
									attr: {
										label: 'Border Radius (Pixels)',
										name: 'border-radius',
										min: 0,
										max: 100,
										value: AppData.state.progress_bar_border_radius,
										roundValue: true,
										onChange( value ) {
											if ( ! isCurrentTabDisabled ) {
												AppData.updateState( {
													progress_bar_border_radius: value,
													is_progress_bar_styles_changes: true,
												} );
											}
										},
									},
								} ) }

								{ checkboxField( {
									attr: {
										label: 'Use Custom CSS',
										name: 'use-progress-bar-custom-css',
										value: getBool( AppData.state.use_progress_bar_custom_css ),
										onChange( isChecked ) {
											if ( ! isCurrentTabDisabled ) {
												AppData.updateState( {
													use_progress_bar_custom_css: isChecked,
													is_progress_bar_styles_changes: true,
												} );
											}
										},
									},
								} ) }

								{ getBool( AppData.state.use_progress_bar_custom_css ) && codeEditorCodemirrorField( {
									attr: {
										label: 'Custom CSS',
										language: 'css',
										value: AppData.state.progress_bar_custom_css_data,
										onChange( value ) {
											AppData.updateState( {
												progress_bar_custom_css_data: value,
												is_progress_bar_styles_changes: true,
											} );
										}
									},
								} ) }
							</fieldset>
						</section>
						<footer>
							{ formSubmission( {
								attr: {
									submit_text: styleSaveState && ! isCurrentTabDisabled ? savingStateText : saveStateText,
									reset_text: __( 'Discard Changes', 'reading-time-progress-bar' ),
									show_reset_button: true,
									onDiscarded() {
										AppData.resetSavedState( StylesStateCollections, {
											is_progress_bar_styles_save_request_sending: false,
											is_progress_bar_styles_changes: false,
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
