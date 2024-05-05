// External dependencies
import { useContext } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Internal dependencies
import { getBool } from '../utils/helpers.js';
import GeneralSettings from './tabs/GeneralSettings';
import ReadingTime from './tabs/ReadingTime';
import ReadingProgressBar from './tabs/ReadingProgressBar';
import ExportAndImport from './tabs/ExportAndImport';
import Recommendations from './widgets/recommendations';
import ReadingTimePreview from './widgets/reading-time-preview';
import ProgressBarPreview from './widgets/progress-bar-preview';
import ApplicationContext from './ApplicationContext';

export default function() {
	const AppData = useContext( ApplicationContext );

	// Render active tab according to the selection.
	const renderActiveTab = ( tab ) => {
		let ActiveTab = GeneralSettings;

		if ( 'reading-time' === tab.name ) {
			ActiveTab = ReadingTime;
		}

		if ( 'reading-progress-bar' === tab.name ) {
			ActiveTab = ReadingProgressBar;
		}

		if ( 'export-import' === tab.name ) {
			ActiveTab = ExportAndImport;
		}

		return <ActiveTab tabInfo={ tab } />;
	};

	// Render preview widget according to the selection.
	const renderPreviewWidget = ( state ) => {
		if ( ! getBool( state.is_reading_time_disable ) && 'reading-time' === state.active_tab.name ) {
			return <ReadingTimePreview tabInfo={ state.active_tab } stateData={ state } />;
		}

		if ( ! getBool( state.is_reading_progress_bar_disable ) && 'reading-progress-bar' === state.active_tab.name ) {
			return <ProgressBarPreview tabInfo={ state.active_tab } stateData={ state } />;
		}

		return null;
	};

	const TabListField = [].map.call( Object.values( AppData.state.tab_lists ), ( tabItem, index ) => {
		const tabClass = `${ tabItem.name }-${ index } ${ tabItem.className }`;
		const activeClass = AppData.state.active_tab.name === tabItem.name ? 'active' : '';

		return (
			<li key={ index } className={ tabClass }>
				<button className={ activeClass } onClick={ () => AppData.updateState( { active_tab: tabItem } ) }>
					{ tabItem.title }
				</button>
			</li>
		);
	} );

	return (
		<div className={ 'panel-wrapper' }>
			<div className={ 'panel-header' }>
				<h1>
					{ __( 'Reading Time & Progress Bar', 'reading-time-progress-bar' ) }
				</h1>
				<p>
					{ __(
						'Track and display the average reading time and progress of your specific post types.',
						'reading-time-progress-bar',
					) }
				</p>
			</div>
			<div className={ 'panel-body' }>
				<div className={ 'panel-tab-container' }>
					<div className={ 'panel-tab-header' }>
						<ul className={ 'panel-tab-list' }>{ TabListField }</ul>
						<div className={ 'output-preview' }>{ renderPreviewWidget( AppData.state ) }</div>
					</div>
					<div className={ 'panel-tab-body' }>
						<div className={ 'panel-tab-body-containers' }>{ renderActiveTab( AppData.state.active_tab ) }</div>

						<div className={ 'recommendations' }>
							<h2 className={ 'widget-title' }>{ __( 'Recommendations', 'reading-time-progress-bar' ) }</h2>
							<div className='container'><Recommendations /></div>
						</div>
					</div>
				</div>
			</div>
			{ /*<div className={ 'panel-footer' }></div>*/ }
		</div>
	);
}
