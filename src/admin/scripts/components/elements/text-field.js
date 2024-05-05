export default ( { attr } ) => (
	<div className={ `form-field ${ attr.className || '' }` } style={ attr.style || {} }>
		<div className="field-label">
			<label className={ `label ${ attr.name }__label` } htmlFor={ `input-text_${ attr.name }` }>
				{ attr.label }
			</label>
		</div>
		<div className="validation-input">
			<input
				id={ `input-text_${ attr.name }` }
				name={ attr.name }
				type={ 'text' }
				inputMode={ 'text' }
				value={ attr.value }
				onChange={ attr.onChange }
			/>
		</div>
	</div>
);
