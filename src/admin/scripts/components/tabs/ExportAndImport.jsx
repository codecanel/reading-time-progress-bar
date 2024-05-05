// External dependencies
import { useContext } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { toast } from 'react-toastify';

//Internal dependencies
import { getBool, isJson } from '../../utils/helpers';
import { copyToClipboard } from '../../utils/copy-to-clipboard';
import ApplicationContext from '../ApplicationContext';
import checkboxField from '../elements/checkbox-field';
import formSubmission from '../elements/form-submission';
import LoadingSpinner from '../elements/loading-spinner';
import fileUploadField from '../elements/file-upload-field';
import ControlledElementsWrapper from '../elements/controlled-elements-wrapper';
import codeEditorCodemirrorField from '../elements/code-editor-codemirror-field';

export default function() {
	const AppData = useContext( ApplicationContext );
	const optionsVariable = window.COCA_WP_READING_METER_VARIABLES || {};

	const importingState = getBool( AppData.state.is_settings_import_request_sending );
	const importChangesState = getBool( AppData.state.is_export_import_changes );

	// Texts
	const importedStateText = __( 'Import', 'reading-time-progress-bar' );
	const importingStateText = __( 'Importing', 'reading-time-progress-bar' );

	const importSettingsData = ( event ) => {
		event.preventDefault();

		let importedJSON = {};

		// upload_from_clipboard > import_clipboard_settings
		// !upload_from_clipboard > input_upload-from-file
		if ( importChangesState && ! getBool( AppData.state.upload_from_clipboard ) && !! AppData.state.uploaded_json_file.length ) {
			if ( !! AppData.state.uploaded_json_data && isJson( AppData.state.uploaded_json_data ) ) {
				importedJSON = window.JSON.parse( AppData.state.uploaded_json_data );
			} else {
				toast.error( __( 'Please ensure the settings file is in valid JSON format before importing.', 'reading-time-progress-bar' ) );
			}
		} else if ( importChangesState && getBool( AppData.state.upload_from_clipboard ) && !! AppData.state.import_clipboard_settings.length ) {
			if ( !! AppData.state.import_clipboard_settings && isJson( AppData.state.import_clipboard_settings ) ) {
				importedJSON = window.JSON.parse( AppData.state.import_clipboard_settings );
			} else {
				toast.error( __( 'Please ensure the settings file is in valid JSON format before importing.', 'reading-time-progress-bar' ) );
			}
		} else {
			AppData.updateState( {
				is_settings_import_request_sending: false,
				is_export_import_changes: false,
				is_settings_import_error: true,
				is_settings_import_success: false,
			} );
			toast.error( __( 'We\'re ready when you are! Just adjust the imported data and hit the upload button again.', 'reading-time-progress-bar' ) );
		}

		// send request to save data and update current state.
		if ( !! Object.keys( importedJSON ).length ) {
			AppData.saveState( {
				action: 'coca_rtpb_plugin_import_settings',
				isImportStateData: true,
				importedStateData: { ...importedJSON },
				preUpdateStates: { is_settings_import_request_sending: true },
				postUpdateStates: {
					...importedJSON,
					uploaded_json_data: '',
					import_clipboard_settings: '',
					tab_lists: AppData.state.tab_lists,
					active_tab: AppData.state.active_tab,
					dynamic_data: AppData.state.dynamic_data,
					is_settings_imported: true,
					is_settings_import_request_sending: false,
					is_export_import_changes: false,
				},
				handleResponse( response ) {
					if ( response && response.success && 'imported' === response.message ) {
						AppData.updateState( {
							is_settings_import_error: false,
							is_settings_import_success: true,
						} );
						toast.success( 'Feeling familiar? All your settings are back!' );
					}

					if ( response && ! response.success && 'invalid_data' === response.message ) {
						AppData.updateState( {
							is_settings_import_error: true,
							is_settings_import_success: false,
						} );
						toast.error( __( 'Please ensure the settings file is in valid JSON format before importing.', 'reading-time-progress-bar' ) );
					}

					if ( response && ! response.success && 'already_imported' === response.message ) {
						AppData.updateState( {
							is_settings_import_error: true,
							is_settings_import_success: false,
						} );
						toast.error( __( 'Welcome back, your data is already here!', 'reading-time-progress-bar' ) );
					}
				},
			} );
		}
	};

	const copySettingsData = ( event ) => {
		event.preventDefault();

		copyToClipboard( AppData.savedState );

		AppData.updateState( {
			settings_copied: true,
		} );

		toast.success( 'Ready to import? Settings on your clipboard.' );
	};

	const restSettingsData = ( event ) => {
		event.preventDefault();

		// Save all data from state to database.
		AppData.resetState( {
			handleResponse( response ) {
				if ( response && response.success && 'updated' === response.message ) {
					toast.success( 'Settings have been successfully restored to defaults.' );
				}
				if ( response && ! response.success && 'already_updated' === response.message ) {
					toast.error( 'Everything\'s ready, no need to worry about resetting further.' );
				}
			},
		} );
	};

	return (
		<>
			<div className='container section-import-control-settings'>
				<ControlledElementsWrapper showNotice={ true } checkInit={ true }>
					<header className='container-section'>
						<div className='section-heading'>
							<h2 className='section-heading-title'>
								{ __( 'Import Settings', 'reading-time-progress-bar' ) }
							</h2>
							<p className='section-heading-description'>
								{ __( 'Easily bring in predefined configurations. Upload a settings file to quickly apply preferred setups. Keep things hassle-free by importing settings that match your needs. Be aware that importing settings will replace current configurations, so use this feature thoughtfully', 'reading-time-progress-bar' ) }

							</p>
						</div>
					</header>
					<form className='section-form' onSubmit={ importSettingsData }>
						<section className={ importingState ? 'loading' : 'loaded' }>
							<LoadingSpinner />
							<fieldset className='form-contianer'>
								{ ! getBool( AppData.state.upload_from_clipboard ) && fileUploadField( {
									attr: {
										label: 'Upload a settings file',
										id: 'input_upload-from-file',
										accept: 'application/json',
										attribute: 'uploaded_json_file',
										collection: 'uploaded_json_data',
										tracker: 'is_export_import_changes',
									},
								} ) }

								{ checkboxField( {
									attr: {
										label: 'Import from clipboard',
										name: 'upload-from-clipboard',
										value: getBool( AppData.state.upload_from_clipboard ),
										onChange( isChecked ) {
											AppData.updateState( {
												upload_from_clipboard: isChecked,
												uploaded_json_file: [],
												uploaded_json_data: '',
												is_export_import_changes: true,
											} );
										},
									},
								} ) }

								{ getBool( AppData.state.upload_from_clipboard ) && codeEditorCodemirrorField( {
									attr: {
										label: 'Paste your clipboard data here',
										language: 'json',
										height: '200px',
										maxWidth: '835px',
										onChange( value ) {
											AppData.updateState( {
												import_clipboard_settings: value,
												is_export_import_changes: true,
											} );
										}
									},
								} ) }
							</fieldset>
						</section>
						<footer>
							{ formSubmission( {
								attr: {
									submit_text: importingState ? importingStateText : importedStateText,
									show_reset_button: false,
									wrapperStyle: {
										transition: 'opacity 300ms ease-in-out 0ms, height 300ms ease-in-out 0ms',
										opacity: Number( importChangesState || AppData.isFreshInstallation ),
										height: importChangesState || AppData.isFreshInstallation ? '' : '0',
										padding: importChangesState || AppData.isFreshInstallation ? '' : '0',
									},
								},
							} ) }
						</footer>
					</form>
				</ControlledElementsWrapper>
			</div>
			<div className='container section-export-control-settings'>
				<ControlledElementsWrapper showNotice={ false } checkInit={ true }>
					<header className='container-section'>
						<div className='section-heading'>
							<h2 className='section-heading-title'>
								{ __( 'Export Settings', 'reading-time-progress-bar' ) }
							</h2>
							<p className='section-heading-description'>
								{ __(
									'Securely copy or download your current option settings. Safeguard this file as a backup in case of any issues, or use it to restore your settings on this site or another. Your preferences, wherever you need them.',
									'reading-time-progress-bar',
								) }
							</p>
						</div>
					</header>
					<form className='section-form' action={ optionsVariable.ajax_url } method={ 'post' }
						target={ '_blank' }>
						<section className=''>
							<fieldset className='form-contianer'>
								<section className={ 'form-elements' }>
									<input type={ 'hidden' } name={ 'action' }
										value={ 'coca_rtpb_plugin_export_settings' } />
									<input type={ 'hidden' } name={ '_wpnonce' }
										value={ optionsVariable.ajax_nonce } />
								</section>
								<div className='form-submit-buttons'>
									<div className='button-group-container'>
										<button type='submit' className='button button-primary'
											onClick={ copySettingsData }>
											{ __( 'Copy Settings', 'reading-time-progress-bar' ) }
										</button>
										<button type='submit' className='button button-primary'>
											{ __( 'Export file', 'reading-time-progress-bar' ) }
										</button>
									</div>
								</div>
							</fieldset>
						</section>
					</form>
				</ControlledElementsWrapper>
			</div>
			<div className='container section-export-control-settings'>
				<ControlledElementsWrapper showNotice={ false } checkInit={ true }>
					<header className='container-section'>
						<div className='section-heading'>
							<h2 className='section-heading-title'>
								Reset Settings
							</h2>
							<p className='section-heading-description'>
								Securely reset your current option settings.
							</p>
						</div>
					</header>
					<form className='section-form' action={ '' } method={ 'post' } target={ '_blank' }>
						<section className=''>
							<fieldset className='form-contianer'>
								<div className='form-submit-buttons'>
									<div className='button-group-container'>
										<button type='submit'
											className='button button-primary'
											onClick={ restSettingsData }
											style={ { backgroundColor: 'red' } }
											onFocus={ ( event ) => {
												event.currentTarget.style.boxShadow = 'rgb(255, 255, 255) 0 0 0 2px, red 0 0 0 4px, rgba(0, 0, 0, 0.05) 0 1px 2px 0';
											} }
											onBlur={ ( event ) => {
												event.currentTarget.style.boxShadow = '';
											} }>
											{ __( 'Reset Now', 'reading-time-progress-bar' ) }
										</button>
									</div>
								</div>
							</fieldset>
						</section>
					</form>
				</ControlledElementsWrapper>
			</div>
		</>
	);
}
