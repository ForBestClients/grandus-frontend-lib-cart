'use client';

import find from 'lodash/find';
import debounce from 'lodash/debounce';
import useCart from '@/grandus-lib/hooks/useCart';
import { Fragment, useCallback, useEffect, useState } from 'react';
import AmountInputCart from '@/modules/cart/components/AmountInputCart';
import IconRemove from '@/components/_other/icons/IconRemove';
import IconButton from '@/components/_other/button/IconButton';
import Link from 'next/link';
import PriceDynamic from 'components/price/PriceDynamic';
import BundleInfo from '@/components/product/BundleInfo';
import CartThumb from '@/modules/cart/components/ui/CartThumb';
import { trackAddToCart, trackRemoveFromCart } from '@/utils/tracking';
import { useTranslation } from '@/app/i18n/client';
import { getItemInfos } from '@/modules/cart/components/ui/cartItem';

// The rows only write: they must not refetch the cart when the drawer opens,
// and their loaders show only while their own change is saved (useCart's
// isLoading is also true during every cart revalidation).
const ROW_CART_OPTIONS = { revalidateOnMount: false, revalidateIfStale: false };

const ItemCountInput = ({ item }) => {
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
          pillSize="sm"
      />
  );
};

const ItemRemoveButton = ({ item, className = '' }) => {
  const { itemRemove } = useCart(false, ROW_CART_OPTIONS);
  const [isRemoving, setIsRemoving] = useState(false);
  const { t } = useTranslation();

  const removeItemFromCart = async () => {
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
      onClick={removeItemFromCart}
      loading={isRemoving}
      className={`group ${className}`}
    >
      <IconRemove className="h-4 w-4 text-ink transition-colors group-hover:text-brand-deep" />
    </IconButton>
  );
};

const MiniCartItem = ({ item }) => {
  const { t } = useTranslation();
  // chosen option (scent), EAN and weight of the chosen store
  const itemInfos = getItemInfos(item, t);
  const productUrl = `/produkt/${item.product.urlTitle}`;

  return (
      <li className="flex gap-3 py-4 sm:gap-4">
        <Link href={productUrl} tabIndex={-1} aria-hidden="true" className="shrink-0">
          <CartThumb
              photo={item?.product?.photo}
              alt={item?.product?.name ?? 'product'}
              title={item?.product?.name}
              size="md"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 pt-0.5">
              <Link
                  href={productUrl}
                  className="text-[15px] font-medium leading-snug text-ink transition-colors hover:text-brand-deep"
              >
                {item?.product?.name}
              </Link>
              {itemInfos.length ? (
                  <p className="mb-0 mt-0.5 text-xs leading-snug text-ink-muted">
                    {itemInfos.map((info, index) => (
                        <Fragment key={`info-${index}`}>
                          {index ? ' | ' : ''}
                          <span className="whitespace-nowrap">{info}</span>
                        </Fragment>
                    ))}
                  </p>
              ) : null}
            </div>
            <ItemRemoveButton item={item} className="-me-2 -mt-1.5" />
          </div>

          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ItemCountInput item={item} />
              <BundleInfo product={item?.product} className="text-xs text-ink-muted" />
            </div>
            <div className="whitespace-nowrap text-right text-[15px]">
              <PriceDynamic
                  priceData={item.priceTotalData}
                  standartPriceData={item?.product?.standardPriceData}
                  count={item.count}
              />
            </div>
          </div>
        </div>
      </li>
  );
};

export default MiniCartItem;
