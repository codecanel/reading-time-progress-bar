// External dependencies
import jquery from 'jquery';

export function sendRequest( userOptions, callback ) {
	const optionsVariable = window.COCA_WP_READING_METER_VARIABLES || {};

	// Verify the Core settings are not empty.
	if ( Object.keys( optionsVariable ).length ) {
		const ajaxNonce = optionsVariable.ajax_nonce;
		const requestUrl = optionsVariable.ajax_url;
		const requestOptions = {
			_ajax_nonce: ajaxNonce,
			...userOptions,
		};

		if ( ! callback ) {
			// Send a request to the server.
			return jquery.post( requestUrl, requestOptions );
		}

		// Send a request to the server.
		return jquery.post( requestUrl, requestOptions, callback );
	}
}

export function uploadRequest( formData, callback ) {
	const optionsVariable = window.COCA_WP_READING_METER_VARIABLES || {};

	// Verify the Core settings are not empty.
	if ( Object.keys( optionsVariable ).length ) {
		const ajaxNonce = optionsVariable.ajax_nonce;
		const requestUrl = optionsVariable.ajax_url;
		formData.append( '_ajax_nonce', ajaxNonce );

		const requestOptions = {
			url: requestUrl,
			type: 'POST',
			contentType: false,
			processData: false,
			data: formData,
		};

		if ( ! callback ) {
			// Send a request to the server.
			return jquery.ajax( requestOptions );
		}

		// Send a request to the server.
		return jquery.ajax( {
			...requestOptions,
			success: callback,
		} );
	}
}

export function getResponse( callback ) {
	const optionsVariable = window.COCA_WP_READING_METER_VARIABLES || {};

	// Verify the Core settings are not empty.
	if ( Object.keys( optionsVariable ).length && callback ) {
		const options = callback( optionsVariable );
		const requestUrl = options.url;
		const complete = options.complete;

		if ( ! options.complete ) {
			// get a request response to the server.
			return jquery.get( requestUrl );
		}

		// get a request response to the server.
		return jquery.get( requestUrl, complete );
	}
}
