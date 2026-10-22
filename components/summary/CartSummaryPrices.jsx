'use client';

import Price from '@/components/price/Price';
import Divider from "@/components/_other/divider/Divider";
import {useTranslation} from "@/app/i18n/client";
import { formatter } from '@/utils/price';
import useWebInstance from '@/grandus-lib/hooks/useWebInstance';
import { getCartProductsTotal } from '@/modules/cart/components/ui/cartTotals';
import find from 'lodash/find';

const Row = ({ label, children, valueClassName = 'text-base lg:text-lg' }) => (
  <div className="flex items-center justify-between gap-4 py-2">
    <span className="min-w-0 text-[15px] leading-snug text-ink">{label}</span>
    <span className={`shrink-0 whitespace-nowrap text-right ${valueClassName}`}>{children}</span>
  </div>
);

const CartSummaryItems = ({cart}) => {
  const {t} = useTranslation();
  const { settings } = useWebInstance();
  const isVatPayer = settings && String(settings?.vat_payer ?? '1') !== '0';

  // "Spolu za produkty" = the cart lines only (sumData is the grand total
  // incl. delivery and payment once they are chosen)
  const productsTotal = getCartProductsTotal(cart);

  // the name of the option the customer picked ('Kuriér'); cart.delivery.name
  // can be the admin name of its price tier ('Kuriér do 50 euro')
  const deliveryName =
    find(cart?.deliveryOptions, { id: cart?.delivery?.id })?.name ??
    cart?.delivery?.groupName ??
    cart?.delivery?.name;

  return (
    <div>
      <Row label={t('cart_summary_items.totalProducts')} valueClassName="text-lg">
        <span className="whitespace-nowrap font-bold text-price tabular-nums">
          {formatter.format(productsTotal)}
        </span>
      </Row>

      {cart?.coupon ? (
        <Row label={cart.coupon.hash}>
          <span className="font-bold text-price tabular-nums">−</span>
          <Price priceData={cart.coupon.discountData} isDiscount />
        </Row>
      ) : null}

      {cart?.delivery ? (
        <Row label={deliveryName}>
          <Price priceData={cart?.delivery.priceData} />
        </Row>
      ) : null}

      {cart?.payment ? (
        <Row label={cart.payment.name}>
          <Price priceData={cart?.payment.priceData} />
        </Row>
      ) : null}

      <Divider />

      {isVatPayer ? (
        <>
          <Row label={t('cart_summary_items.totalWithoutVAT')}>
            <Price priceData={cart?.sumData} withVat={false} />
          </Row>
          <Row label={t('cart_summary_items.VAT')}>
            <span className="whitespace-nowrap font-bold text-price tabular-nums">
              {formatter.format(cart?.sumData?.vatFraction ?? 0)}
            </span>
          </Row>
        </>
      ) : null}

      <div className="flex items-center justify-between gap-4 py-2">
        <span className="text-lg font-bold leading-snug text-ink">
          {t('cart_summary_items.total')}
        </span>
        <span className="whitespace-nowrap text-lg font-bold text-price tabular-nums">
          {cart?.sumData?.priceFormatted ?? ""}
        </span>
      </div>
    </div>
  )
}

export default CartSummaryItems;
