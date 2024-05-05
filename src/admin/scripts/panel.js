// External dependencies
import { createRoot } from '@wordpress/element';

// Internal dependencies
import Application from './components/Application';

window.addEventListener(
	'load',
	function () {
		const URLSearchParams = new window.URLSearchParams( document.location.search );
		const appPanelPage = 'reading-time-progress-bar';
		const appRootId = `#${ appPanelPage }__edit_panel_root`;
		const appRoot = document.querySelector( appRootId );

		if ( URLSearchParams.get( 'page' ) === appPanelPage && appRoot ) {
			const root = createRoot( appRoot );
			root.render( <Application /> );

			// Added class.
			appRoot.classList.add( 'loaded' );
		}
	},
	false
);
