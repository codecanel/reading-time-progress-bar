// Internal dependencies
import NumberValidation from './../../utils/validation/number.js';

export default function( { attr } ) {
	return <div className={ `form-field ${ attr.className || '' }` } style={ attr.style || {} }>
		<div className='field-label'>
			<label className={ `label ${ attr.name }__label` } htmlFor={ `input-numeric_${ attr.name }` }>
				{ attr.label }
			</label>
		</div>
		<div className='validation-input'>
			<input
				id={ `input-numeric_${ attr.name }` }
				name={ attr.name }
				value={ attr.value }
				min={ attr.min }
				minLength={ attr.min }
				max={ attr.max }
				maxLength={ attr.max }
				step={ attr.step ?? 1 }
				type={ 'number' }
				inputMode={ 'numeric' }
				onChange={ function( event ) {
					NumberValidation( attr.value, event, attr.onChange );
				} }
			/>
		</div>
	</div>;
};
