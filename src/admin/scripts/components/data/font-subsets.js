import { ucFirst } from '../../utils/helpers.js';

export default ( options ) => [].concat(
	[ { label: 'Default', value: '' } ],
	[].map.call(
		( options && options.subsets ) || [],
		( subset ) => {
			const modifiedSubset = subset.replace( /-/g, ' ' );

			return {
				label: ucFirst( modifiedSubset ),
				value: subset,
			};
		}
	)
);
