'use client';

import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import CartListingItem from '@/modules/cart/components/CartListingItem';
import useCart from '@/grandus-lib/hooks/useCart';
import Divider from '@/components/_other/divider/Divider';
import CartItemsSkeleton from '@/modules/cart/components/skeletons/CartItemsSkeleton';
import { useTranslation } from '@/app/i18n/client';
import filter from 'lodash/filter';
import { CART_ITEM_TYPE_VIRTUAL } from '@/constants/AppConstants';
import CartListingItemVirtual from '@/modules/cart/components/CartListingItemVirtual';

const CartListingItems = () => {
  const { cart, isLoading } = useCart();
  const { t } = useTranslation();

  if (isLoading) {
    return <CartItemsSkeleton />;
  }

  if (isEmpty(cart?.items)) {
    return <div className={'pt-4'}>{t('cart_summary_items.empty')}</div>;
  }

  const cartItems = filter(
    cart?.items,
    item => item?.type !== CART_ITEM_TYPE_VIRTUAL,
  );

  const cartItemsVirtual = filter(
    cart?.items,
    item => item?.type === CART_ITEM_TYPE_VIRTUAL,
  );

  return (
    <>
      <div className="grid grid-cols-5 sm:grid-cols-6 items-center text-left">
        <div className="col col-span-3 md:col-span-2 p-2 pl-2.5 ps-0 text-left">
          <h5>{t('cart_summary_items.products')}</h5>
        </div>
        <div className="hidden sm:block col text-center p-2">
          <h5>{t('cart_summary_items.count')}</h5>
        </div>
        <div className="hidden md:block col text-center p-2">
          <h5>{t('cart_summary_items.package')}</h5>
        </div>
        <div className="col col-span-2 sm:col-span-1 text-right sm:text-center p-2">
          <h5>{t('cart_summary_items.price')}</h5>
        </div>
        <div className={'hidden sm:block'} />

        {map(cartItems, (item, i) => {
          return <CartListingItem key={`cart-item-${i}`} item={item} />;
        })}

        {map(cartItemsVirtual, (item, i) => {
          return (
            <CartListingItemVirtual
              key={`cart-virtual-item-${i}`}
              item={item}
            />
          );
        })}
        <div className="col-span-full">
          <Divider />
        </div>
      </div>
    </>
  );
};

export default CartListingItems;
