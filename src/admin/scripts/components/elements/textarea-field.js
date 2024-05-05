export default ( { attr } ) => (
	<div className={ `form-field ${ attr.className || '' }` } style={ attr.style || {} }>
		<div className="field-label">
			<label className={ `label ${ attr.name }__label` } htmlFor={ `textarea_${ attr.name }` }>
				{ attr.label }
			</label>
		</div>
		<div className="validation-input">
			<textarea
				id={ `textarea_${ attr.name }` }
				name={ attr.name }
				cols={ attr.cols }
				rows={ attr.rows }
				onChange={ attr.onChange }
			/>
		</div>
	</div>
);
