// External
import { useEffect, useCallback } from '@wordpress/element';
import { RgbaColorPicker } from 'react-colorful';
import { colord } from 'colord';

// Internal
import { getBool } from '../../utils/helpers';

export default function( { attr: { customToggles, tracker, attribute, onChange, onToggleChange, className, style, name, value, label } } ) {
	const presetColors = [
		{ hex: '#FF6900', rgba: { r: 255, g: 105, b: 0, a: 1 } },
		{ hex: '#FCB900', rgba: { r: 255, g: 185, b: 0, a: 1 } },
		{ hex: '#7BDCB5', rgba: { r: 123, g: 220, b: 181, a: 1 } },
		{ hex: '#00D084', rgba: { r: 0, g: 208, b: 132, a: 1 } },
		{ hex: '#8ED1FC', rgba: { r: 142, g: 209, b: 252, a: 1 } },
		{ hex: '#0693E3', rgba: { r: 6, g: 147, b: 227, a: 1 } },
		{ hex: '#ABB8C3', rgba: { r: 171, g: 184, b: 195, a: 1 } },
		{ hex: '#EB144C', rgba: { r: 235, g: 20, b: 76, a: 1 } },
		{ hex: '#F78DA7', rgba: { r: 247, g: 141, b: 167, a: 1 } },
		{ hex: '#9900EF', rgba: { r: 153, g: 0, b: 239, a: 1 } },
	];

	const selectorPrefix = 'coca-rtpb-plugin';
	const rootSelector = 'reading-time-progress-bar';
	const rgbaColor = `rgba(${ value.r }, ${ value.g }, ${ value.b }, ${ value.a })`;
	const customStyles = {
		previewField: {
			width: '36px',
			height: '14px',
			borderRadius: '2px',
			backgroundColor: rgbaColor,
		},
	};

	const onInputChange = ( event ) => onChange( colord( event.target.value ).rgba );

	const closeColorPicker = useCallback( ( event ) => {
		if ( getBool( customToggles[ tracker ] ) && document.querySelector( `.${ selectorPrefix }__field_color-picker` ) ) {
			if ( event.target.closest( `#${ rootSelector }__edit_panel_root` ) && ! event.target.closest( `.${ selectorPrefix }__field_color-picker` ) ) {
				onToggleChange( tracker );
			}
		}
	}, [ customToggles, onToggleChange, tracker ] );

	useEffect( function() {
		window.document.addEventListener( 'click', closeColorPicker );

		return () => {
			window.document.removeEventListener( 'click', closeColorPicker );
		};
	}, [ closeColorPicker, attribute, customToggles ] );

	return (
		<div className={ `form-field ${ className || '' }` } style={ style || {} }>
			<div className='field-label'>
				<label className={ `label ${ name }__label` } htmlFor={ `color_${ name }` }>
					{ label }
				</label>
			</div>
			<div className='validation-input'>
				<div className={ 'coca-rtpb-plugin__field_color-picker' }>

					<button type={ 'button' } className={ 'trigger-button' } onClick={ () => onToggleChange( tracker ) }>
						<div className={ 'color-preview' } style={ customStyles.previewField } />
					</button>

					{ getBool( customToggles[ tracker ] ) && (
						<div className='color-picker' style={ { position: 'absolute', zIndex: '2' } }>
							<RgbaColorPicker color={ value } onChange={ onChange } />
							<div className={ 'color-input' }>
								{ /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
								<label> <input type={ 'text' } value={ rgbaColor } onChange={ onInputChange } /> </label>
							</div>
							<div className='picker__swatches'>
								{ presetColors.map( ( presetColor ) => (
									<button
										type={ 'button' }
										className='picker__swatch'
										key={ presetColor.hex }
										style={ { backgroundColor: presetColor.hex } }
										onClick={ () => onChange( presetColor.rgba ) }
									/>
								) ) }
							</div>
						</div>
					) }

				</div>
			</div>
		</div>
	);
}
