// External dependencies
import Select from 'react-select';

export default function( { attr } ) {
	return <div className={ `form-field ${ attr.className || '' }` } style={ attr.style || {} }>
		<div className='field-label'>
			<label className={ `label ${ attr.name }__label` } htmlFor={ `select_${ attr.name }` }>
				{ attr.label }
			</label>
		</div>
		<div className='validation-input'>
			<Select
				id={ `select-${ attr.name }` }
				defaultValue={ attr.defaultValue }
				value={ attr.value }
				name={ attr.name }
				options={ attr.options }
				styles={ {
					option: ( defaultStyles, state ) => {
						let backgroundColor;
						if (state.isSelected) {
							backgroundColor = '#1A3760';
						} else {
							backgroundColor = state.isFocused ? '#5d717f' : '#fff';
						}
						return ( {
							...defaultStyles,
							backgroundColor,
							color: state.isSelected || state.isFocused ? '#fff' : '#1A3760',
							cursor: state.isFocused ? 'pointer' : 'auto',
						} );
					},

					control: ( defaultStyles ) => ( {
						...defaultStyles,
						backgroundColor: '#fff',
					} ),
					singleValue: ( defaultStyles ) => ( {
						...defaultStyles,
						color: '#1A3760',
					} ),
				} }
				className='basic-select'
				classNamePrefix='select'
				onChange={ attr.onChange }
				isOptionSelected={ attr.isOptionSelected }
			/>
		</div>
	</div>;
};

