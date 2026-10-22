'use client';

import find from 'lodash/find';
import debounce from 'lodash/debounce';
import useCart from '@/grandus-lib/hooks/useCart';
import { Fragment, useCallback, useEffect, useState } from 'react';
import AmountInputCart from '@/modules/cart/components/AmountInputCart';
import IconRemove from '@/components/_other/icons/IconRemove';
import IconButton from '@/components/_other/button/IconButton';
import Link from 'next/link';
import PriceDynamic from '@/components/price/PriceDynamic';
import BundleInfo from '@/components/product/BundleInfo';
import CartThumb from '@/modules/cart/components/ui/CartThumb';
import get from 'lodash/get';
import { trackAddToCart, trackRemoveFromCart } from '@/utils/tracking';
import { useTranslation } from '@/app/i18n/client';
import { getItemInfos, getItemMeasureUnit } from '@/modules/cart/components/ui/cartItem';

// The rows only write: they must not refetch the cart when they mount, and
// their loaders show only while their own change is saved (useCart's isLoading
// is also true during every cart revalidation).
const ROW_CART_OPTIONS = { revalidateOnMount: false, revalidateIfStale: false };

const ItemCountInput = ({ item, wide = false }) => {
  const { product, store, count } = item;

  const { itemUpdate } = useCart(false, ROW_CART_OPTIONS);
  const [isUpdating, setIsUpdating] = useState(false);
  const [amount, setAmount] = useState(count);

  useEffect(() => {
    setAmount(count);
  }, [count]);

  const selectedStore = find(
    product?.store,
    productStore => productStore?.id === store?.id,
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCountChange = useCallback(
    debounce(async value => {
      try {
        const oldCount = +item?.count || 1;
        let newCount = +value || 1;
        if (newCount !== oldCount) {
          setIsUpdating(true);
          await itemUpdate(item?.id, { count: newCount }, cart => {
            const newItem = find(cart?.items, { id: item?.id });
            if (newCount !== newItem?.count) {
              setAmount(newItem?.count);
            }

            const itemsDifference = newItem?.count - oldCount;
            if (itemsDifference < 0) {
              trackRemoveFromCart(item, Math.abs(itemsDifference));
            } else if (itemsDifference > 0) {
              // GA4 add_to_cart + Meta AddToCart
              trackAddToCart(item, itemsDifference);
            }
          });
        }
      } catch {
        console.log('error');
      }
      setIsUpdating(false);
    }, 500),
  );

  return (
    <AmountInputCart
      size={selectedStore}
      amount={amount}
      setAmount={setAmount}
      afterChange={handleCountChange}
      loading={isUpdating}
      item={item}
      inputClassName={wide ? 'md:!w-20' : ''}
    />
  );
};

const ItemRemoveButton = ({ item, className = '' }) => {
  const { itemRemove } = useCart(false, ROW_CART_OPTIONS);
  const [isRemoving, setIsRemoving] = useState(false);
  const { t } = useTranslation();

  const handleRemove = async e => {
    e.preventDefault();
    setIsRemoving(true);
    const removing = itemRemove(item?.id);
    trackRemoveFromCart(item, item?.count);
    try {
      await removing;
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <IconButton
      variant="ghost"
      size="md"
      label={`${t('cart.remove_item')}: ${item?.product?.name ?? ''}`}
      onClick={handleRemove}
      loading={isRemoving}
      className={`group ${className}`}
    >
      <IconRemove className="h-[18px] w-[18px] text-ink transition-colors group-hover:text-brand-deep" />
    </IconButton>
  );
};

const ItemBundleInfo = ({ item }) => {
  const selectedStore = find(
    get(item, 'product.store', []),
    s => s?.id === get(item, 'store.id'),
  );
  const measureUnit = getItemMeasureUnit(item);
  const piecesInBundle = get(selectedStore, 'piecesInBundle', 1);

  if (piecesInBundle > 1) {
    return `${item.count} bal (${item.count * piecesInBundle} ${measureUnit})`
  }

  return `${item.count} ${measureUnit}`;
}

const CartListingItem = ({ item }) => {
  const { t } = useTranslation();
  const itemInfos = getItemInfos(item, t);

  return (
    <>
      <div className="col group relative col-span-3 flex h-full items-center gap-3 py-2 pe-2 sm:gap-4 md:col-span-2">
        <Link
          href={`/produkt/${item.product.urlTitle}`}
          aria-label={item?.product?.name}
          className="absolute inset-0 z-[1] rounded-[12px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-deep"
        />
        <CartThumb
          photo={item?.product?.photo}
          alt={item?.product?.name ?? 'product'}
          title={item?.product?.name}
          size="lg"
        />
        <div className="min-w-0 text-left">
          <p className="mb-0 text-[15px] leading-snug text-ink transition-colors group-hover:text-brand-deep">
            {item?.product?.name}
          </p>
          {itemInfos.length ? (
            <p className="mb-0 mt-1 text-xs leading-snug text-ink sm:text-sm">
              {itemInfos.map((info, index) => (
                <Fragment key={`info-${index}`}>
                  {index ? ' | ' : ''}
                  <span className="whitespace-nowrap">{info}</span>
                </Fragment>
              ))}
            </p>
          ) : null}
        </div>
      </div>

      <div className="col hidden flex-col items-center p-2 sm:flex">
        <ItemCountInput item={item} wide />
        <BundleInfo product={item?.product} className="mt-1 text-xs text-ink-muted" />
      </div>

      <div className={'col hidden p-2 text-center leading-snug text-ink md:block'}>
        <span className={'text-sm'}>{t('cart_summary_items.package_total')}</span>
        <br />
        <span className={'text-[15px]'}>
          <ItemBundleInfo item={item} />
        </span>
      </div>

      <div className="col col-span-2 whitespace-nowrap py-2 ps-2 text-right text-[15px] sm:col-span-1 sm:px-2 sm:text-center">
        <PriceDynamic
          priceData={item.priceTotalData}
          standartPriceData={item?.product?.standardPriceData}
          count={item.count}
        />
      </div>

      <div className="col col-span-3 block pb-3 sm:hidden">
        <ItemCountInput item={item} />
      </div>

      <div className="col col-span-2 flex justify-end pb-3 sm:col-span-1 sm:py-2">
        <ItemRemoveButton item={item} className="-me-2" />
      </div>
    </>
  );
};

export default CartListingItem;
