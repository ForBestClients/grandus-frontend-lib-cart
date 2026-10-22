import some from 'lodash/some';
import flattenDeep from 'lodash/flattenDeep';
import { CART_SERVICES_CATEGORY } from '@/constants/AppConstants';

// Additional services (gift wrapping …) are products from the `sluzby` category.
// The cart API returns product.categories as nested arrays ([[{…}, {…}]]),
// so flatten them before looking for the services category.
export const isCartServiceItem = item =>
  some(
    flattenDeep([item?.product?.categories ?? []]),
    category => category?.urlName === CART_SERVICES_CATEGORY,
  );

export default isCartServiceItem;
