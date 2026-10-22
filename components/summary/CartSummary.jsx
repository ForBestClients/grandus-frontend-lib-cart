'use client';

import useCart from '@/grandus-lib/hooks/useCart';
import Box from "@/components/_other/box/Box";
import CartSummaryItems from '@/modules/cart/components/summary/CartSummaryItems';
import CartSummaryPrices from '@/modules/cart/components/summary/CartSummaryPrices';
import {useTranslation} from "@/app/i18n/client";
import CartMessages from '@/modules/cart/components/messages/CartMessages';
import { useCheckoutSelection } from '@/modules/cart/components/delivery/CheckoutSelection';

const CartSummary = ({isFirstStep}) => {
  const {t} = useTranslation();
  const {cart} = useCart();
  // a delivery or payment change is being saved: the totals are recalculated
  const isSaving = Boolean(useCheckoutSelection()?.selection?.isSaving);

  return (
    <>
      <CartMessages />
      <Box isLoading={isSaving}>
        <h2 className="mb-3 text-lg font-medium leading-snug text-ink md:text-xl">
          {t('cart_summary.title')}
        </h2>
        {!isFirstStep ? <CartSummaryItems cart={cart}/> : ""}
        <CartSummaryPrices cart={cart}/>
      </Box>
    </>
  )
}

export default CartSummary;
