// Internal dependencies
import Recommendations from '../data/recommendations.js';

export default () => (
	<>
		{ [].map.call( Recommendations || [], ( product, key ) => (
			<div className={ 'product' } key={ key }>

				<div className={ 'product-image' }>
					<img src={ product.thumbnail_url } alt={ product.title } />
				</div>

				<div className={ 'product-content' }>
					<h3> { product.title } </h3>
					<p> { product.description } </p>
				</div>

				<div className={ 'product-permalink' }>
					<a href={ product.permalink } target={ '_blank' } rel="external noreferrer">
						{ product.cta_button_text }
					</a>
				</div>

			</div>
		) ) }
	</>
);
