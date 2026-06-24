'use client';

import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import filter from "lodash/filter";
import some from "lodash/some";
import useCart from '@/grandus-lib/hooks/useCart';
import CartItemsSkeleton from "@/modules/cart/components/skeletons/CartItemsSkeleton";
import {useTranslation} from "@/app/i18n/client";
import MiniCartItem from '@/modules/cart/components/minicart/MiniCartItem';
import {CART_SERVICES_CATEGORY} from "@/constants/AppConstants";

const MiniCartItems = () => {
  const { cart, isLoading } = useCart()
  const {t} = useTranslation();

  if (isLoading) {
    return <CartItemsSkeleton />
  }

  // Doplnkové služby (kategória `sluzby`) skryjeme zo zoznamu položiek –
  // spravujú sa cez checkbox v <Services/> nižšie v mini-košíku.
  const items = filter(
    cart?.items,
    item => !some(item?.product?.categories, c => c?.urlName === CART_SERVICES_CATEGORY),
  );

  if (isEmpty(items)) {
    return <div className={'pt-4'}>{t('cart_summary_items.empty')}</div>;
  }

  return (
      <>
        <div className="grid grid-cols-5 xs:grid-cols-6 items-center text-left">
          <div className="col col-span-3 p-2 pl-2.5 ps-0 text-left">
            <h5>{t('cart_summary_items.products')}</h5>
          </div>
          <div className="hidden xs:block col text-center p-2">
            <h5>{t('cart_summary_items.count')}</h5>
          </div>
          <div className="col col-span-2 xs:col-span-1 text-right xs:text-center p-2">
            <h5>{t('cart_summary_items.price')}</h5>
          </div>
          <div className={"hidden xs:block"}/>

          {map(items, (item, i) => {
            return <MiniCartItem key={`cart-item-${i}`} item={item}/>
          })}
        </div>
      </>
  )
}

export default MiniCartItems;
