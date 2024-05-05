import { getFontVariantData } from '../../utils/google-fonts';

export default options => [].concat(
    [ { label: 'Default', value: '' } ],
    [].map.call(
        ( options && options.variants ) || [],
        ( variant ) => ( {
            label: getFontVariantData( variant ),
            value: getFontVariantData( variant ),
        } ),
    ),
)
