// External dependencies
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { EditorView } from '@codemirror/view';
import { json } from '@codemirror/lang-json';
import { css } from '@codemirror/lang-css';

export default function( { attr } ) {
	// Collect languages.
	const languageExtensions = [ EditorView.lineWrapping ];

	// Add JSON support when it is enabled by user.
	if ( 'json' === attr.language ) {
		languageExtensions.push( json() );
	}

	// Add CSS support when it is enabled by user.
	if ( 'css' === attr.language ) {
		languageExtensions.push( css() );
	}

	return (
		<div className={ `form-field ${ attr.className || '' }` } style={ attr.style || {} }>
			<div className='field-label'>
				<label className={ `label ${ attr.name }__label` } htmlFor={ `code-editor_${ attr.name }` }>
					{ attr.label }
				</label>
			</div>
			<div className='validation-input'>
				<div className={ `code-editor editor-${ attr.language }` }>
					<CodeMirror
						value={ ''.toString.call( attr.value || '' ) }
						height={ attr.height || '200px' }
						maxWidth={ attr.maxWidth || '976px' }
						theme={ vscodeDark }
						editable={ true }
						extensions={ languageExtensions }
						onChange={ attr.onChange }
					/>
				</div>
			</div>
		</div>
	);
}
