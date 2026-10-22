import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import toNumber from 'lodash/toNumber';

// "Spolu za produkty": the sum of the cart lines (products and services such as
// the gift wrap), without delivery and payment. cart.sumData is the grand total
// and includes them once they are chosen in step 3, so it must not be used here.
// Shared by the order summary, the mini cart and the header cart pill.
export const getCartProductsTotal = cart => {
  const total = isEmpty(cart?.items)
    ? toNumber(cart?.sum ?? 0)
    : sumBy(cart.items, item => toNumber(get(item, 'priceTotalData.price', 0)));

  // round to cents (float sums such as 9.9 + 2)
  return Math.round((total || 0) * 100) / 100;
};

export default getCartProductsTotal;
