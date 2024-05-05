// External dependencies
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ToastContainer, toast } from 'react-toastify';

// Internal dependencies
import { isJson } from '../utils/helpers';
import { sendRequest } from '../utils/request';
import Window from './Window';
import ApplicationState from './data/state';
import ApplicationContext from './ApplicationContext';
import LoadingSpinner from './elements/loading-spinner';

const userOptionProp = {
	importedStateData: false,
	states: {},
	preUpdateState: {},
	postUpdateState: {},
	handleResponse: null
};

class Application extends Component {
	settings_key = 'rtpb_plugin_cache_data';

	constructor( props ) {
		super( props );

		const savedState = window.COCA_WP_READING_METER_DATA || {};
		const savedStateDefaults = window.COCA_WP_READING_METER_DEFAULTS || {};
		const isConfiguredState = window.COCA_WP_READING_METER_VARIABLES || { is_configured: '0' };
		this.state = {
			...isConfiguredState,
			is_component_mounted: false,
			current: {
				tab_lists: [],
				customToggles: {},
				dynamic_data: {},
				uploaded_json_file: [],
				uploaded_json_data: '',
				import_clipboard_settings: '',
				import_settings_file: '',
				export_clipboard_settings: '',
				...ApplicationState,
				...savedState,
				...savedStateDefaults,
				active_tab: { ...this.collectLocalState() },
				is_export_import_changes: false,
			},
			saved: {
				...savedState
			}
		};

		this.handleUpdateState = this.handleUpdateState.bind( this );
		this.handleUpdateSavedState = this.handleUpdateSavedState.bind( this );
		this.handleResetSavedState = this.handleResetSavedState.bind( this );
		this.handleSaveState = this.handleSaveState.bind( this );
		this.handleResetState = this.handleResetState.bind( this );
		this.sendRequest = this.sendRequest.bind( this );
		this.updateBulkState = this.updateBulkState.bind( this );
	}

	componentDidMount() {
		Promise.all( [
			import( './../../../static/data/standard-fonts.json' ).then( ( response ) => response.default ),
			import( './../../../static/data/google-fonts.json' ).then( ( response ) => response.default ),
			sendRequest( { action: 'coca_rtpb_plugin_get_panel_data', } ),
		] ).then( ( response ) => {
			// Collect data from response.
			const [ standardFonts, googleFonts, bulkResponse ] = response || {
				standardFonts: [],
				googleFonts: {
					kind: 'webfonts#webfontList',
					items: []
				},
				bulkResponse: {
					all_post_types: [],
					estimated_positions: [],
					time_text_positions: [],
				}
			};

			// Update app state.
			this.setState( ( prevState ) => ( {
				...prevState,
				is_component_mounted: true,
				current: {
					...prevState.current,
					dynamic_data: {
						standardFonts,
						googleFonts,
						allPostTypes: bulkResponse.all_post_types || [],
						estimatedPosition: bulkResponse.estimated_positions || [],
						textPositions: bulkResponse.time_text_positions || []
					} }
			} ) );
		} );
	}

	updateBulkState( state, type ) {
		[].forEach.call( Object.entries( state ), ( [ key, value ] ) => {
			this.setState( ( prevState ) => ( {
				...prevState,
				[ type ]: { ...prevState[ type ], [ key ]: value }
			} ) );
		} );
	}

	handleUpdateState( state, type = 'current' ) {
		// Update state.
		if ( !! state && !! Object.keys( state ).length ) {
			this.updateBulkState( state, type );
		}

		// Update to local storage.
		if ( !! state.active_tab ) {
			const newLocalStorageData = JSON.stringify( { ...state.active_tab } );
			window.localStorage.setItem( this.settings_key, newLocalStorageData );
		}
	}

	handleUpdateSavedState( state, type = 'saved' ) {
		// Update state.
		if ( !! state && !! Object.keys( state ).length ) {
			this.updateBulkState( state, type );
		}
	}

	handleResetSavedState = ( savedStates = [], additionalStates = {} ) => {
		if ( ! this.state.is_configured && ! Object.keys( this.state.saved ).length ) {
			toast.error( __( 'Hey, just waiting for your configuration touch!', 'reading-time-progress-bar' ) );
		} else {
			const savedStatesData = this.collectSatesByKeys( savedStates, this.state.saved );
			this.handleUpdateState( {
				...additionalStates,
				...savedStatesData
			} );
			toast.success( __( 'Unsaved settings are discarded.', 'reading-time-progress-bar' ) );
		}
	};

	handleSaveState = ( userOptions = userOptionProp ) => {
		if ( !! userOptions.isImportStateData ) {
			this.sendRequest( userOptions, userOptions.importedStateData );
		} else {
			this.sendRequest( userOptions, this.collectSatesByKeys( userOptions.states, this.state.current ) );
		}
	};

	handleResetState = ( userOptions = userOptionProp ) => {
		this.sendRequest( userOptions, ApplicationState );
	};

	sendRequest = ( userOptions = userOptionProp, requestState ) => {
		const __this = this;

		// Update state before sending request to server.
		if ( !! userOptions.preUpdateStates && !! Object.keys( userOptions.preUpdateStates ).length ) {
			__this.handleUpdateState( userOptions.preUpdateStates );
		}

		// Request Options.
		const requestOptions = {
			action: 'coca_rtpb_plugin_save_settings',
			requestState
		};

		// Update action on assignment.
		if ( !! userOptions.action ) {
			requestOptions.action = userOptions.action;
		}

		// Send request to server.
		sendRequest( requestOptions, function( response ) {
			if ( response && ( response.success || ! response.success ) ) {
				// Update state after getting response from server.
				if ( !! userOptions.postUpdateStates && !! Object.keys( userOptions.postUpdateStates ).length ) {
					__this.handleUpdateState( userOptions.postUpdateStates );
					__this.handleUpdateSavedState( {
						...__this.state.saved,
						...requestState
					} );
				} else {
					__this.handleUpdateState( requestState || __this.state.saved );
					__this.handleUpdateSavedState( requestState || __this.state.saved );
				}
			}

			if ( typeof userOptions.handleResponse === 'function' ) {
				userOptions.handleResponse( response, requestState );
			}
		} );
	};

	collectSatesByKeys = ( stateKeys = [], store = 'current' ) => {
		// Collect updatable states.
		const currentStates = Object.entries( store || {} );
		const stateFilter = ( [ key ] ) => [].includes.call( stateKeys, key );
		const stateEntries = [].filter.call( currentStates, stateFilter );

		return Object.fromEntries( stateEntries );
	};

	collectLocalState = () => {
		const localState = window.localStorage.getItem( this.settings_key );
		if ( !! localState && isJson( localState ) && !! JSON.parse( localState ).name && !! JSON.parse( localState ).title ) {
			return JSON.parse( localState );
		}

		return {
			name: 'general-settings',
			title: __( 'General Settings ', 'reading-time-progress-bar' ),
			className: 'tab-one-general-settings',
		};
	};

	render() {
		if ( ! this.state.is_component_mounted ) {
			return <LoadingSpinner className={ 'is-data-loading' } />;
		}

		// Load the application window.
		return this.state.is_component_mounted && (
			<ApplicationContext.Provider value={ {
				isConfigured: this.state.is_configured,
				isFreshInstallation: ( ! this.state.is_configured && ! Object.keys( this.state.saved ).length ),
				state: this.state.current,
				savedState: this.state.saved,
				saveState: this.handleSaveState,
				updateState: this.handleUpdateState,
				updateSavedState: this.handleUpdateSavedState,
				resetSavedState: this.handleResetSavedState,
				resetState: this.handleResetState
			} }>
				<Window />
				<ToastContainer
					position={ 'top-right' }
					autoClose={ 1300 }
					className={ 'message-toast' }
				/>
			</ApplicationContext.Provider>
		);
	}
}

export default Application;
