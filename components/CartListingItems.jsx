'use client';

import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import reject from "lodash/reject";
import CartListingItem from '@/modules/cart/components/CartListingItem';
import useCart from '@/grandus-lib/hooks/useCart';
import Divider from "@/components/_other/divider/Divider";
import CartItemsSkeleton from "@/modules/cart/components/skeletons/CartItemsSkeleton";
import {useTranslation} from "@/app/i18n/client";
import {isCartServiceItem} from "@/modules/cart/components/ui/cartServices";

const HEADER_CELL = 'text-base font-medium leading-snug text-ink md:text-xl';

const CartListingItems = () => {
  const { cart, isLoading } = useCart()
  const {t} = useTranslation();

  // skeleton only for the first load; revalidations keep the list in place
  if (isLoading && isEmpty(cart?.items)) {
    return <CartItemsSkeleton />
  }

  // Doplnkové služby (napr. darčekové balenie) sú produkty z kategórie `sluzby`.
  // V zozname položiek ich skryjeme – spravujú sa cez checkbox v <Services/>.
  const items = reject(cart?.items, isCartServiceItem);

  if (isEmpty(items)) {
    return <p className={'mb-0 pt-2 text-ink-muted'}>{t('cart_summary_items.empty')}</p>;
  }

  return (
    <div className="grid grid-cols-5 items-center text-left sm:grid-cols-6">
      <div className="col col-span-3 py-2 pe-2 md:col-span-2">
        <span className={HEADER_CELL}>{t('cart_summary_items.products')}</span>
      </div>
      <div className="col hidden p-2 text-center sm:block">
        <span className={HEADER_CELL}>{t('cart_summary_items.count')}</span>
      </div>
      <div className="col hidden p-2 text-center md:block">
        <span className={HEADER_CELL}>{t('cart_summary_items.package')}</span>
      </div>
      <div className="col col-span-2 py-2 ps-2 text-right sm:col-span-1 sm:px-2 sm:text-center">
        <span className={HEADER_CELL}>{t('cart_summary_items.price')}</span>
      </div>
      <div className={"hidden sm:block"}/>

      {map(items, (item, i) => {
        return <CartListingItem key={`cart-item-${item?.id ?? i}`} item={item}/>
      })}
      <div className="col-span-full">
        <Divider />
      </div>
    </div>
  )
}

export default CartListingItems;
