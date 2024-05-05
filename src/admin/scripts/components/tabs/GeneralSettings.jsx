// External dependencies
import { useContext } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { toast } from 'react-toastify';

// Internal dependencies
import { getBool } from '../../utils/helpers';
import ApplicationContext from '../ApplicationContext';
import numberField from '../elements/number-field';
import checkboxField from '../elements/checkbox-field';
import formSubmission from '../elements/form-submission';
import LoadingSpinner from '../elements/loading-spinner';
import selectMultiField from '../elements/select-multi-field';
import ControlledElementsWrapper from '../elements/controlled-elements-wrapper';

export default function() {
	const AppData = useContext( ApplicationContext );
	const savingState = getBool( AppData.state.is_general_control_save_request_sending );
	const changesState = getBool( AppData.state.is_general_control_changes );
	const isReadingTimeDisabled = getBool( AppData.state.is_reading_time_disable );
	const isProgressBarDisabled = getBool( AppData.state.is_reading_progress_bar_disable );

	// Texts
	const saveStateText = __( 'Save Changes', 'reading-time-progress-bar' );
	const savingStateText = __( 'Saving Changes', 'reading-time-progress-bar' );
	const SaveButtonText = savingState && ( ! isReadingTimeDisabled || ! isProgressBarDisabled ) ? savingStateText : saveStateText;

	const handleSaveGeneralSettings = ( event ) => {
		event.preventDefault();

		// Save all data from state to database.
		AppData.saveState( {
			states: [
				'is_reading_time_disable',
				'is_reading_progress_bar_disable',
				'post_type',
				'words_per_minute',
				'include_comments',
				'include_images',
				'images_per_minute',
			],
			preUpdateStates: {
				is_general_control_save_request_sending: true,
			},
			postUpdateStates: {
				is_general_control_save_request_sending: false,
				is_general_control_changes: false,
			},
			handleResponse( response ) {
				if ( response && response.success && 'updated' === response.message ) {
					toast.success( __( 'The update to general settings is complete and successful.', 'reading-time-progress-bar' ) );
				}
				if ( response && ! response.success && 'already_updated' === response.message ) {
					toast.error( __( 'General settings are up-to-date.', 'reading-time-progress-bar' ) );
				}
			}
		} );
	};

	// State collections.
	const ControlStateCollections = [
		'is_reading_time_disable',
		'is_reading_progress_bar_disable',
		'post_type',
		'words_per_minute',
		'include_comments',
		'include_images',
		'images_per_minute',
	];

	const dataDiscardStyles = {
		cursor: AppData.isFreshInstallation ? 'not-allowed' : 'pointer',
		opacity: AppData.isFreshInstallation ? '0.6' : '1',
		pointerEvents: AppData.isFreshInstallation ? 'none' : 'all'
	};

	return (
		<>
			<div className="container section-general-control-settings">
				<ControlledElementsWrapper showNotice={ true } checkInit={ true }>
					<header className="container-section">
						<div className="section-heading">
							<h2 className="section-heading-title">
								{ __( 'General Control Settings', 'reading-time-progress-bar' ) }
							</h2>
							<p className="section-heading-description">
								{ __( 'Control the core settings, e.g. the average count of words that humans can read in a minute & allow the reading time and reading progress bar on particular post types, etc.', 'reading-time-progress-bar' ) }
							</p>
						</div>
					</header>
					<form className="section-form" onSubmit={ handleSaveGeneralSettings }>
						<section className={ savingState ? 'loading' : 'loaded' }>
							<LoadingSpinner />
							<fieldset className="form-contianer">
								{ checkboxField( {
									attr: {
										label: __( 'Disable Reading Time', 'reading-time-progress-bar' ),
										name: 'show-reading-time',
										value: getBool( AppData.state.is_reading_time_disable ),
										onChange( isChecked ) {
											AppData.updateState( {
												is_reading_time_disable: isChecked,
												is_general_control_changes: true,
											} );
										},
									},
								} ) }

								{ checkboxField( {
									attr: {
										label: __( 'Disable Reading Progress Bar', 'reading-time-progress-bar' ),
										name: 'show-reading-progress-bar',
										value: getBool( AppData.state.is_reading_progress_bar_disable ),
										onChange( isChecked ) {
											AppData.updateState( {
												is_reading_progress_bar_disable: isChecked,
												is_general_control_changes: true,
											} );
										},
									},
								} ) }
								<ControlledElementsWrapper attributes={ [ 'is_reading_time_disable', 'is_reading_progress_bar_disable' ] }>
									{ selectMultiField( {
										attr: {
											label: __( 'Post Type(s)', 'reading-time-progress-bar' ),
											name: 'post_types',
											value: AppData.state.post_type,
											options: AppData.state.dynamic_data.allPostTypes,
											onChange( optionValue ) {
												if ( ! isReadingTimeDisabled || ! isProgressBarDisabled ) {
													AppData.updateState( {
														post_type: optionValue,
														is_general_control_changes: true,
													} );
												}
											},
										},
									} ) }
								</ControlledElementsWrapper>

								<ControlledElementsWrapper attributes={ [ 'is_reading_time_disable' ] }>
									{ numberField( {
										attr: {
											label: 'Words Per Minute',
											name: 'images-per-minute',
											min: 0,
											max: 1000,
											value: AppData.state.words_per_minute,
											onChange( event ) {
												if ( ! isReadingTimeDisabled ) {
													const value = event.target.valueAsNumber;
													AppData.updateState( {
														words_per_minute: value,
														is_general_control_changes: true,
													} );
												}
											},
										},
									} ) }

									{ checkboxField( {
										attr: {
											label: 'Include Comments',
											name: 'include-comments',
											value: getBool( AppData.state.include_comments ),
											onChange( isChecked ) {
												if ( ! isReadingTimeDisabled ) {
													AppData.updateState( {
														include_comments: isChecked,
														is_general_control_changes: true,
													} );
												}
											},
										},
									} ) }

									{ checkboxField( {
										attr: {
											label: 'Include Images',
											name: 'include-images',
											value: getBool( AppData.state.include_images ),
											onChange( isChecked ) {
												if ( ! isReadingTimeDisabled ) {
													AppData.updateState( {
														include_images: isChecked,
														is_general_control_changes: true,
													} );
												}
											},
										},
									} ) }

									{ getBool( AppData.state.include_images ) && numberField( {
										attr: {
											label: 'Images Per Minute',
											name: 'images-per-minute',
											min: 0,
											max: 1000,
											value: AppData.state.images_per_minute,
											onChange( event ) {
												if ( ! isReadingTimeDisabled ) {
													const value = event.target.valueAsNumber;
													AppData.updateState( {
														images_per_minute: value,
														is_general_control_changes: true,
													} );
												}
											},
										},
									} ) }
								</ControlledElementsWrapper>
							</fieldset>
						</section>
						<footer>
							{ formSubmission( { attr: {
								submit_text: SaveButtonText,
								reset_text: __( 'Discard Changes', 'reading-time-progress-bar' ),
								show_reset_button: true,
								onDiscarded() {
									AppData.resetSavedState( ControlStateCollections, {
										is_general_control_save_request_sending: false,
										is_general_control_changes: false,
									} );
								},
								wrapperStyle: {
									transition: 'opacity 300ms ease-in-out 0ms, height 300ms ease-in-out 0ms',
									opacity: Number( changesState || AppData.isFreshInstallation ),
									height: changesState || AppData.isFreshInstallation ? '' : '0',
									padding: changesState || AppData.isFreshInstallation ? '' : '0',
								},
								discardStyle: dataDiscardStyles,
							}, } ) }
						</footer>
					</form>
				</ControlledElementsWrapper>
			</div>
		</>
	);
}
