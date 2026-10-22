'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import Box from '@/components/_other/box/Box';
import ShippingSelect from '@/modules/cart/components/ShippingSelect';
import PaymentSelect from '@/modules/cart/components/PaymentSelect';
import useCart from '@/grandus-lib/hooks/useCart';
import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';
import { PACKETERY_TYPE } from '@/grandus-lib/components/v2/delivery/provider';
import { useCheckoutSelection } from '@/modules/cart/components/delivery/CheckoutSelection';
export const reducer = (state, action) => {
  const data = action?.payload;
  switch (action?.type) {
    case 'CART_DELIVERY':
      return {
        deliveryGroup: data?.delivery?.group,
        delivery: data?.delivery,
        // kept when the new delivery offers it too (see setSelectedDeliveryToState)
        payment: data?.payment ?? null,
        specificPayment: null,
        specificDeliveryType: null,
      };
    case 'CART_DELIVERY_GROUP':
      return {
        deliveryGroup: data,
        delivery: null,
        payment: null,
        specificPayment: null,
        specificDeliveryType: null,
      };
    case 'CART_PAYMENT':
      return {
        ...state,
        ...{ payment: data, specificPayment: null, specificDeliveryType: null },
      };
    case 'CART_SPECIFIC_PAYMENT':
      return { ...state, ...{ specificPayment: data } };
    case 'CART_ALL':
      return { ...state, ...data };
  }

  return state;
};

export const initialState = {
  deliveryGroup: null,
  delivery: null,
  payment: null,
  specificPayment: null,
};

// the delivery and payment saved in the cart
const getCartChoice = cart => ({
  deliveryGroup: cart?.delivery?.group,
  delivery: cart?.delivery,
  payment: cart?.payment,
  specificPayment: cart?.specificPaymentType,
});

const DeliveryAndPaymentForm = ({ countries }) => {
  const { cart, isLoading, cartUpdate, mutateCart } = useCart();
  // starts from the cart, so the order button does not flash a missing choice
  const [state, dispatch] = useReducer(reducer, cart, initialCart => ({
    ...initialState,
    ...getCartChoice(initialCart),
  }));
  const setSelection = useCheckoutSelection()?.setSelection;
  const saveQueue = useRef(Promise.resolve());
  const [pendingSaves, setPendingSaves] = useState(0);
  const isSaving = pendingSaves > 0;
  const deliveryId = state?.delivery?.id ?? null;
  const paymentId = state?.payment?.id ?? null;

  useEffect(() => {
    dispatch({ type: 'CART_ALL', payload: getCartChoice(cart) });
  }, [cart]);

  // the order button and the summary wait until this choice is in the cart
  useEffect(() => {
    setSelection?.({ deliveryId, paymentId, isSaving });
  }, [setSelection, deliveryId, paymentId, isSaving]);

  useEffect(() => () => setSelection?.(null), [setSelection]);

  // cart updates run one after another, so the last choice is the one saved
  const saveToCart = data => {
    setPendingSaves(count => count + 1);
    const save = saveQueue.current.then(async () => {
      let isSaved = false;
      await cartUpdate(data, result => {
        isSaved = Boolean(result?.success);
      });

      // a rejected update (422) leaves the error as the cart data: reload the
      // cart, so the form, the summary and the order button follow it again
      if (!isSaved) {
        await mutateCart();
      }
    });
    saveQueue.current = save.catch(() => null);

    return save.finally(() => setPendingSaves(count => count - 1));
  };

  const setSelectedDeliveryGroupToState = delivery => {
    dispatch({ type: 'CART_DELIVERY_GROUP', payload: delivery });
  };

  const setSelectedDeliveryToState = delivery => {
    // keep the chosen payment when the new delivery offers it too
    const payment = state?.payment
      ? find(delivery?.payments, { id: state.payment.id }) ?? null
      : null;
    dispatch({ type: 'CART_DELIVERY', payload: { delivery, payment } });

    // save the delivery right away: the summary, the total and the order use
    // the cart (a new delivery without a payment clears the payment there)
    return saveToCart({
      deliveryType: delivery?.id,
      paymentType: payment?.id ?? null,
      specificPaymentType: null,
      specificDeliveryType: null,
    });
  };

  const setSelectedPaymentToState = async payment => {
    dispatch({ type: 'CART_PAYMENT', payload: payment });

    const isDeliverySet = !isEmpty(state?.delivery);
    const isPaymentSet = !isEmpty(payment);
    const paymentHasSpecificPayment = !isEmpty(payment?.options);

    if (isDeliverySet && isPaymentSet) {
      const cartData = {
        deliveryType: state?.delivery?.id,
        paymentType: payment?.id,
        specificPaymentType: null,
      };

      if (state?.delivery?.serviceProviderType !== PACKETERY_TYPE) {
        cartData.specificDeliveryType = null;
      }

      if (!paymentHasSpecificPayment) {
        await saveToCart(cartData);
      }
    }
  };

  return (
    <div className={'flex flex-col gap-6'}>
      <Box isLoading={isLoading}>
        <ShippingSelect
          countries={countries}
          selected={state?.delivery}
          selectedGroup={state?.deliveryGroup}
          handleChange={setSelectedDeliveryToState}
          handleGroupChange={setSelectedDeliveryGroupToState}
        />
      </Box>
      <Box isLoading={isLoading}>
        <PaymentSelect
          options={state?.delivery?.payments}
          selected={state?.payment}
          handleChange={setSelectedPaymentToState}
        />
      </Box>
    </div>
  );
};

export default DeliveryAndPaymentForm;
