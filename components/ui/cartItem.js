import find from 'lodash/find';
import first from 'lodash/first';
import get from 'lodash/get';
import size from 'lodash/size';
import toNumber from 'lodash/toNumber';

// Slovak decimal comma, like the prices ('0,5 kg', not '0.5 kg')
const weightFormatter = new Intl.NumberFormat('sk-SK', { maximumFractionDigits: 3 });
const formatWeight = weight => {
  const value = toNumber(weight);

  return Number.isNaN(value) ? weight : weightFormatter.format(value);
};

// the store (size / scent option) chosen for this cart item
export const getItemStore = item =>
  find(get(item, 'product.store', []), s => s?.id === get(item, 'store.id')) ??
  first(get(item, 'product.store', []));

// unit for the "Balenie" column: a single store option is the unit itself
// ("KS"); with more options (scents) the store name is the chosen option, which
// the meta line already shows, so fall back to the measure unit
export const getItemMeasureUnit = item => {
  const fallback = item?.measureUnit || get(item, 'product.measureUnit') || 'KS';

  if (size(get(item, 'product.store')) > 1) {
    return fallback;
  }

  return get(getItemStore(item), 'name') || get(item, 'store.name') || fallback;
};

// meta line under the product name: chosen option (only when the product has
// more options, e.g. a scent), EAN and the weight of the chosen option
export const getItemInfos = (item, t) => {
  const store = getItemStore(item);
  const infos = [];
  const optionName = get(item, 'store.name') || get(store, 'name');

  if (size(get(item, 'product.store')) > 1 && optionName) {
    infos.push(optionName);
  }

  if (item?.product?.ean) {
    infos.push(item.product.ean);
  }

  if (get(store, 'weight')) {
    infos.push(
      t('cart_summary_items.weight', { weight: formatWeight(get(store, 'weight')) }),
    );
  }

  return infos;
};
