'use client';

import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import CartSummaryItem from "@/modules/cart/components/CartSummaryItem";
import Price from "components/price/Price";
import {useTranslation} from "@/app/i18n/client";

const CartSummaryItems = ({cart}) => {
  const {t} = useTranslation();

  if (isEmpty(cart?.items)) {
    return <div className={'pt-4'}>{t('cart_summary_items.empty')}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-4">
        <div className="col col-span-2 p-2 ps-0">
          <strong>{t('cart_summary_items.products')}</strong>
        </div>
        <div className="col text-center p-2">
          <strong>{t('cart_summary_items.count')}</strong>
        </div>
        <div className="col text-right p-2">
          <strong>{t('cart_summary_items.price')}</strong>
        </div>

        {map(cart?.items, (item, i) => {
          return <CartSummaryItem key={`cart-item-${i}`} item={item}/>
        })}

        {cart?.coupon
          ? (
            <>
              <div className="col col-span-3 p-2 ps-0">
                <strong>{cart.coupon.hash}</strong>
              </div>
              <div className="col text-center p-2">
                <strong>-<Price priceData={cart.coupon.discountData}/></strong>
              </div>
            </>
          )
          : ''}

        {cart?.delivery
          ? (
            <>
              <div className="col col-span-3 p-2 ps-0">
                <strong>{t('cart_summary_items.delivery')}</strong>
              </div>
              <div className="col text-center p-2">
                <strong><Price priceData={cart?.delivery.priceData}/></strong>
              </div>
            </>
          )
          : ''}

        {cart?.payment
          ? (
            <>
              <div className="col col-span-3 p-2 ps-0">
                <strong>{t('cart_summary_items.payment')}</strong>
              </div>
              <div className="col text-center p-2">
                <strong><Price priceData={cart?.payment.priceData}/></strong>
              </div>
            </>
          )
          : ''}

        <div className="col col-span-3 p-2 ps-0">
          <strong>{t('cart_summary_items.total')}</strong>
        </div>
        <div className="col text-center p-2">
          <strong><Price priceData={cart.sumData}/></strong>
        </div>
      </div>
    </>
  )
}

export default CartSummaryItems;
