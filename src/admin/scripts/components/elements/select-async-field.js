// External dependencies
import AsyncSelect from 'react-select/async';

export default function( { attr } ) {
	return <div className={ `form-field ${ attr.className || '' }` } style={ attr.style || {} }>
		<div className='field-label'>
			<label className={ `label ${ attr.name }__label` } htmlFor={ `select-async_${ attr.name }` }>
				{ attr.label }
			</label>
		</div>
		<div className='validation-input'>
			<AsyncSelect
				id={ `select-${ attr.name }` }
				defaultValue={ attr.defaultValue }
				value={ attr.value }
				name={ attr.name }
				styles={ {
					option: ( defaultStyles, state ) => ( {
						...defaultStyles,
						color: state.isFocused ? '#fff' : '#1A3760',
						backgroundColor: state.isFocused ? '#1A3760' : '#fff',
					} ),
					control: ( defaultStyles ) => ( {
						...defaultStyles,
						backgroundColor: '#fff',
					} ),
				} }
				className='basic-select'
				classNamePrefix='select'
				onChange={ attr.onChange }
				loadOptions={ attr.loadOptions }
				isOptionSelected={ attr.isOptionSelected }
				cacheOptions
				defaultOptions
			/>
		</div>
	</div>;
};
