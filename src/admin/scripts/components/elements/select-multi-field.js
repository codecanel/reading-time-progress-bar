// External dependencies
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

export default ( { attr } ) => (
	<div className={ `form-field ${ attr.className || '' }` } style={ attr.style || {} }>
		<div className="field-label">
			<label className={ `label ${ attr.name }__label` } htmlFor={ `select-multi_${ attr.name }` }>
				{ attr.label }
			</label>
		</div>
		<div className="validation-input">
			<Select
				components={ makeAnimated() }
				id={ `select-${ attr.name }` }
				defaultValue={ attr.defaultValue }
				value={ attr.value }
				isMulti
				name={ attr.name }
				options={ attr.options }
				styles={ {
					control: ( defaultStyles ) => ( {
						...defaultStyles,
						backgroundColor: '#fff',
					} ),
					option: ( defaultStyles, state ) => ( {
						...defaultStyles,
						color: state.isFocused ? '#fff' : '#1A3760',
						backgroundColor: state.isFocused ? '#1A3760' : '#fff',
						cursor: state.isFocused ? 'pointer' : 'auto',
					} ),
					valueContainer: ( defaultStyles ) => ( {
						...defaultStyles,
						gap: '5px',
					} ),
					multiValueLabel: ( defaultStyles ) => ( {
						...defaultStyles,
						color: '#fff',
					} ),
					multiValue: ( defaultStyles ) => ( {
						...defaultStyles,
						color: '#fff',
					} ),
					singleValue: ( defaultStyles ) => ( {
						...defaultStyles,
						color: '#fff',
					} ),
				} }
				className="basic-multi-select"
				classNamePrefix="select"
				onChange={ attr.onChange }
				isOptionSelected={ attr.isOptionSelected }
			/>
		</div>
	</div>
);

