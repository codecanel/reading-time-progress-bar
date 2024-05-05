export default ( { attr } ) => (
	<section className={ `message ${ attr.type }-message` }>
		<p className={ `message-text ${ attr.type }-message-text` }>
			{ attr.message }
		</p>
	</section>
);
