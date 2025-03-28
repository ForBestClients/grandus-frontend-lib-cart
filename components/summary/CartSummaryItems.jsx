'use client';

import map from "lodash/map";
import CartSummaryItem from "@/modules/cart/components/summary/CartSummaryItem";
import Divider from "@/components/_other/divider/Divider";
import {useTranslation} from "@/app/i18n/client";

const CartSummaryItems = ({cart}) => {
  const {t} = useTranslation();

  return (
      <div className="grid grid-cols-4 items-center">
        {map(cart?.items, (item, i) => {
          return <CartSummaryItem key={`cart-item-${i}`} item={item}/>
        })}
      </div>
  )
}

export default CartSummaryItems;
