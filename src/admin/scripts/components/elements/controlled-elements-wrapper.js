// External dependencies
import { useContext } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Internal dependencies
import ApplicationContext from '../ApplicationContext';

export default function( { attributes, checkInit, showNotice, noticeMessage, children } ) {
	const AppData = useContext( ApplicationContext );

	// 'All features are currently disabled. To use it, you need to save all settings.'
	// 'This feature is currently disabled. If you want to use it, you need to enable it from the General tab.'

	if ( attributes && attributes.length && AppData.isConfigured ) {
		const validations = [].map.call( attributes, ( attribute ) => AppData.state[ attribute ].toString() );

		if ( validations.every( ( value ) => value === 'true' ) ) {
			return (
				<>
					{ showNotice && (
						<div className={ 'disable-notice' }>
							{ noticeMessage || __( 'This feature is currently disabled. If you want to use it, you need to enable it from the General tab.', 'reading-time-progress-bar' ) }
						</div>
					) }
					<div className={ 'disable-container' }>{ children }</div>
				</>
			);
		}
	}

	if ( checkInit && ! AppData.isConfigured && ! Object.keys( AppData.savedState ).length ) {
		return (
			<>
				{ showNotice && (
					<div className={ 'disable-notice' }>
						{ noticeMessage || __( 'This plugin is ready to shine, just waiting for your configuration touch!', 'reading-time-progress-bar' ) }
					</div>
				) }
				<div className={ 'noticed-container' }>{ children }</div>
			</>
		);
	}

	return children;
}
