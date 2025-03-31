'use client';

import useCart from "@/grandus-lib/hooks/useCart";
import {useState} from "react";
import isEmpty from "lodash/isEmpty";
import Box from "@/components/_other/box/Box";
import map from "lodash/map";
import Alert from "@/components/_other/alert/Alert";
import CartSummaryItems from '@/modules/cart/components/summary/CartSummaryItems';
import CartSummaryPrices from '@/modules/cart/components/summary/CartSummaryPrices';
import {useTranslation} from "@/app/i18n/client";

const OMIT_ERROR_FIELDS = [
  'deliveryType',
];

const CartSummary = ({isFirstStep}) => {
  const {t} = useTranslation();

  const [errors, setErrors] = useState({});

  const {cart, isLoading} = useCart();



  return (
    <>
      <Box>
        <h5 className={"mb-2"}>{t('cart_summary.title')}</h5>
        {!isFirstStep ? <CartSummaryItems cart={cart}/> : ""}
        <CartSummaryPrices cart={cart}/>

      {!isEmpty(errors) ? (
        <>
          {map(errors, (error, index) => (
            <Alert
              key={`order-error-${index}`}
              message={error}
              className='mt-2'
            />
          ))}
        </>
      ) : null}
      </Box>
    </>
  )
}

export default CartSummary;
