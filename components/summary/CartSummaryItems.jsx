'use client';

import map from 'lodash/map';
import CartSummaryItem from '@/modules/cart/components/summary/CartSummaryItem';
import { useTranslation } from '@/app/i18n/client';
import filter from 'lodash/filter';
import { CART_ITEM_TYPE_VIRTUAL } from '@/constants/AppConstants';
import CartSummaryItemVirtual from '@/modules/cart/components/summary/CartSummaryItemVirtual';

const CartSummaryItems = ({ cart }) => {
  const { t } = useTranslation();

  const cartItems = filter(
    cart?.items,
    item => item?.type !== CART_ITEM_TYPE_VIRTUAL,
  );

  const cartItemsVirtual = filter(
    cart?.items,
    item => item?.type === CART_ITEM_TYPE_VIRTUAL,
  );

  return (
    <div className="grid grid-cols-4 items-center">
      {map(cartItems, (item, i) => {
        return <CartSummaryItem key={`cart-item-${i}`} item={item} />;
      })}

      {map(cartItemsVirtual, (item, i) => {
        return <CartSummaryItemVirtual key={`cart-item-${i}`} item={item} />;
      })}
    </div>
  );
};

export default CartSummaryItems;
