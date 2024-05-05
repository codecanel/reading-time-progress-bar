export default ( { attr } ) => (
	<div aria-hidden='true' className='form-footer' style={ attr.wrapperStyle }>
		<div>
			<div className='form-submit-buttons'>
				<div className='button-group-container'>

					<button type='submit' className='button button-primary'>
						{ attr.submit_text }
					</button>

					{ attr.show_reset_button && (
						<button type='reset' className='button button-secondary' onClick={ attr.onDiscarded } style={ attr.discardStyle }>
							{ attr.reset_text || 'Discard Changes' }
						</button>
					) }
				</div>
			</div>
		</div>
	</div>
);
