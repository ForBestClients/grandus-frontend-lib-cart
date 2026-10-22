'use client';

import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import reject from "lodash/reject";
import useCart from '@/grandus-lib/hooks/useCart';
import {useTranslation} from "@/app/i18n/client";
import MiniCartItem from '@/modules/cart/components/minicart/MiniCartItem';
import {isCartServiceItem} from "@/modules/cart/components/ui/cartServices";
import { CartStroke } from '@/components/_other/icons/StrokeIcons';

const MiniCartItemsSkeleton = () => (
  <ul className="m-0 list-none divide-y divide-line p-0" aria-hidden="true">
    {[0, 1].map(i => (
      <li key={i} className="flex animate-pulse gap-3 py-4">
        <div className="h-20 w-16 shrink-0 rounded-[12px] bg-brand-soft" />
        <div className="flex-1">
          <div className="h-4 w-3/4 rounded-[8px] bg-brand-soft" />
          <div className="mt-2 h-3 w-1/2 rounded-[8px] bg-brand-soft" />
          <div className="mt-3 h-9 w-28 rounded-full bg-brand-soft" />
        </div>
      </li>
    ))}
  </ul>
);

const MiniCartItems = () => {
  const { cart, isLoading } = useCart()
  const {t} = useTranslation();

  if (isLoading && isEmpty(cart?.items)) {
    return <MiniCartItemsSkeleton />
  }

  // Doplnkové služby (kategória `sluzby`) skryjeme zo zoznamu položiek –
  // spravujú sa cez checkbox v <Services/> nižšie v mini-košíku.
  const items = reject(cart?.items, isCartServiceItem);

  // empty state as on /kosik: icon and copy (the way back to the shop is the
  // drawer's button)
  if (isEmpty(items)) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <span className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-brand-soft text-brand-deep">
          <CartStroke className="h-9 w-9" strokeWidth={1.5} />
        </span>
        <p className="mb-0 max-w-xs text-lg font-medium leading-snug text-ink">
          {t('cart.empty')}
        </p>
      </div>
    );
  }

  return (
    <ul className="m-0 list-none divide-y divide-line p-0">
      {map(items, (item, i) => {
        return <MiniCartItem key={`cart-item-${item?.id ?? i}`} item={item}/>
      })}
    </ul>
  )
}

export default MiniCartItems;
