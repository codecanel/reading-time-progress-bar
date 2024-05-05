// External dependencies
import * as Icon from 'react-icons/fi';
import Checkbox from 'react-custom-checkbox';

// Internal dependencies
import { getBool } from '../../utils/helpers';

export default function( { attr: { label, onChange, className, name, value, style } } ) {
	const FieldIcon = () => (
		<div style={ { display: 'flex', flex: 1, backgroundColor: 'rgb(26, 55, 96)', alignSelf: 'stretch', } }>
			<Icon.FiCheck color='white' size={ 16 } />
		</div>
	);

	return (
		<Checkbox
			containerClassName={ `form-field ${ className || '' }` }
			label={ label }
			labelClassName={ `label ${ name }__label` }
			labelStyle={ { marginLeft: '10px' } }
			style={ { overflow: 'hidden', ...style } }
			borderColor="rgb(26, 55, 96)"
			borderRadius={ 2 }
			checked={ getBool( value ) }
			icon={ <FieldIcon /> }
			size={ 16 }
			onChange={ onChange }
		/>
	);
}

