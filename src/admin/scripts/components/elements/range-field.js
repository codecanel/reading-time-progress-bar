// Internal dependencies
import NumberValidation from './../../utils/validation/number.js';

export default function( { attr } ) {
	const isRoundValue = attr.roundValue || false;
	const valueMinimum = attr.min || 0;
	const valueCurrent = attr.value || 0;

	const Styles = {
		container: {
			display: 'flex',
			gap: '1em',
			alignItems: 'center',
		},
		number: {
			width: '100px',
		},
		input: {
			width: '100%',
			// color: -internal-light-dark(rgb(26, 55, 96), rgb(241, 245, 249)),
		},
	};

	const handleOnChange = function( event, callback, validInput = false ) {
		let inputValue;

		// Validate the input number.
		if (isRoundValue) {
			inputValue = Math.round( event.target.valueAsNumber );
		} else {
			inputValue = event.target.value;
		}

		// Verify with minimum value.
		if (valueMinimum >= inputValue) {
			inputValue = valueMinimum;
		}

		// validate the input number.
		if (validInput) {
			NumberValidation( inputValue, event );
		}

		// Send the value to the callback.
		callback( inputValue );
	};

	return (
		<div className={ `form-field ${ attr.className || '' }` } style={ attr.style || {} }>
			<div className='field-label'>
				<label className={ `label ${ attr.name }__label` } htmlFor={ `range_${ attr.name }` }>
					{ attr.label }
				</label>
			</div>
			<div className='validation-input'>
				<div className={ 'field-container' } style={ Styles.container }>
					<input
						style={ Styles.number }
						id={ `range-number_${ attr.name }` }
						type='number'
						inputMode='numeric'
						min={ attr.min }
						max={ attr.max }
						step={ attr.step || 'any' }
						value={ valueCurrent }
						onChange={ ( event ) => handleOnChange( event, attr.onChange ) }
					/>
					<input
						style={ Styles.input }
						id={ `range-input_${ attr.name }` }
						type='range'
						step={ attr.step || 'any' }
						min={ attr.min }
						max={ attr.max }
						value={ valueCurrent }
						onChange={ ( event ) => handleOnChange( event, attr.onChange ) }
					/>
				</div>
			</div>
		</div>
	);
};
