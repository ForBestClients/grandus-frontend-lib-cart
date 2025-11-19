'use client';

import useCart from '@/grandus-lib/hooks/useCart';
import DeliveryAndPaymentFormInner from '@/modules/cart/components/DeliveryAndPaymentFormInner';
import ShippingAndPaymentSkeleton from '@/modules/cart/components/skeletons/ShippingAndPaymentSkeleton';

const DeliveryAndPaymentForm = ({ countries }) => {
  const { cart, isLoading, cartUpdate } = useCart();

  if (isLoading && !cart) {
    return <ShippingAndPaymentSkeleton />;
  }

  return (
    <DeliveryAndPaymentFormInner
      countries={countries}
      cart={cart}
      cartUpdate={cartUpdate}
      isLoading={isLoading}
    />
  )
}

export default DeliveryAndPaymentForm;
