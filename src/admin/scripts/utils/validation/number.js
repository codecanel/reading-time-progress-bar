// Check validation for number field.
export default function ( value, event, callback = null ) {
	const state = event.target.validity;
	const inputValue = Number.parseInt( value );

	if ( state.valueMissing ) {
		event.target.setCustomValidity( 'You gotta fill this out, yo!' );
	} else if ( state.rangeUnderflow ) {
		event.target.setCustomValidity( 'We need a higher number!' );
	} else if ( state.rangeOverflow && inputValue > event.target.max ) {
		event.target.setCustomValidity( 'That is too high!' );
	} else {
		event.target.setCustomValidity( '' );

		if ( typeof callback === 'function' ) {
			callback( event );
		}
	}

	event.target.reportValidity();
}
