/* global FileReader */

// External dependencies
import { useContext } from '@wordpress/element';

// Internal dependencies
import ApplicationContext from '../ApplicationContext';
import { isJson } from '../../utils/helpers';

export default function( { attr } ) {
	const AppData = useContext( ApplicationContext );
	const isFileSelected = ( !! AppData.state[ attr.attribute ] && !! AppData.state[ attr.attribute ].length );

	// Collect the upload file's data.
	const handleUploadedData = ( uploadEvent ) => {
		if ( !! uploadEvent.target.files.length && typeof window.FileReader === 'function' ) {
			const [ uploadedFile ] = [ ...uploadEvent.target.files ];
			const reader = new FileReader();

			// Read the file data.
			reader.readAsText( uploadedFile );
			reader.addEventListener( 'load', ( event ) => {
				const jsonString = event.target.result;
				const isValidData = ( isJson( event.target.result ) && typeof jsonString === 'string' );

				AppData.updateState( {
					[ attr.collection ]: isValidData ? jsonString : '',
					[ attr.attribute ]: [ uploadedFile ],
					[ attr.tracker ]: true,
				} );
			} );
		}
	};

	return (
		<div className={ `form-field ${ attr.className || '' }` } style={ attr.style || {} }>
			<div className='field-label'>
				<label className={ `label ${ attr.name }__label` } htmlFor={ `upload_${ attr.name }` }>
					{ attr.label }
				</label>
			</div>
			<div className='validation-input'>
				<div className={ 'upload-field-container' }>
					{ /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
					<label>
						{ isFileSelected && (
							<div className={ 'selected-file-names' }>
								Selected: { AppData.state[ attr.attribute ].map( ( f ) => f.name ).join( ', ' ) }
							</div>
						) }

						{ ! isFileSelected && 'Click to upload plugin settings file...' }

						<input
							style={ { display: 'none' } }
							name={ 'upload-from-file' }
							type={ 'file' }
							id={ attr.id }
							accept={ attr.accept }
							onChange={ handleUploadedData }
						/>
					</label>
				</div>
			</div>
		</div>
	);
}
