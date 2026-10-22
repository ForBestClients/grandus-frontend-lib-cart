'use client';

import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import CartSummaryItem from "@/modules/cart/components/summary/CartSummaryItem";

const CartSummaryItems = ({cart}) => {
  if (isEmpty(cart?.items)) {
    return null;
  }

  return (
    <ul className="m-0 flex list-none flex-col gap-3 p-0 pb-4 pt-1">
      {map(cart?.items, (item, i) => {
        return <CartSummaryItem key={`cart-item-${item?.id ?? i}`} item={item}/>
      })}
    </ul>
  )
}

export default CartSummaryItems;
