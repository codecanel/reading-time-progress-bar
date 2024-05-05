// External dependencies
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';

export default function( { attr } ) {
	return (
		<div className={ `form-field ${ attr.className || '' }` } style={ attr.style || {} }>
			<div className='field-label'>
				<label className={ `label ${ attr.name }__label` } htmlFor={ `select-multi-async_${ attr.name }` }>
					{ attr.label }
				</label>
			</div>
			<div className='validation-input'>
				<AsyncSelect
					components={ makeAnimated() }
					id={ `select-${ attr.name }` }
					defaultValue={ attr.defaultValue }
					value={ attr.value }
					isMulti
					name={ attr.name }
					styles={ {
						control: ( defaultStyles ) => ( {
							...defaultStyles,
							backgroundColor: '#fff',
						} ),
						option: ( defaultStyles, state ) => ( {
							...defaultStyles,
							color: state.isFocused ? '#fff' : '#1A3760',
							backgroundColor: state.isFocused ? '#1A3760' : '#fff',
						} ),
						valueContainer: ( defaultStyles ) => ( {
							...defaultStyles,
							gap: '5px',
						} ),
						multiValue: ( defaultStyles ) => ( {
							...defaultStyles,
							color: '#fff',
						} ),
						multiValueLabel: ( defaultStyles ) => ( {
							...defaultStyles,
							color: '#fff',
						} ),
						singleValue: ( defaultStyles ) => ( {
							...defaultStyles,
							color: '#fff',
						} ),
					} }
					className='basic-multi-select'
					classNamePrefix='select'
					onChange={ attr.onChange }
					loadOptions={ attr.loadOptions }
					isOptionSelected={ attr.isOptionSelected }
					cacheOptions
					defaultOptions
				/>
			</div>
		</div>
	);
};
