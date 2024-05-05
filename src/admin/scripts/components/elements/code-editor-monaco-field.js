// External dependencies
import Editor from '@monaco-editor/react';

export default ( { attr } ) => (
	<div className={ `form-field ${ attr.className || '' }` } style={ attr.style || {} }>
		<div className='field-label'>
			<label className={ `label ${ attr.name }__label` } htmlFor={ `code-editor_${ attr.name }` }>
				{ props.attr.label }
			</label>
		</div>
		<div className='validation-input'>
			<div className={ `code-editor editor-${ attr.language }` }>
				<Editor
					className={ `editor-${ attr.language }` }
					value={ attr.value }
					height={ attr.height || '200px' }
					language={ attr.language || 'css' }
					theme={ attr.theme || 'vs-dark' }
					options={ { minimap: { enabled: false } } }
					onChange={ attr.onChange }
				/>
			</div>
		</div>
	</div>
);
