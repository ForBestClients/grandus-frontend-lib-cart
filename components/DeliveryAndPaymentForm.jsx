'use client';

import { useEffect, useReducer } from 'react';
import Box from '@/components/_other/box/Box';
import ShippingSelect from '@/modules/cart/components/ShippingSelect';
import PaymentSelect from '@/modules/cart/components/PaymentSelect';
import useCart from '@/grandus-lib/hooks/useCart';
import isEmpty from 'lodash/isEmpty';
import { PACKETERY_TYPE } from '@/grandus-lib/components/v2/delivery/provider';
export const reducer = (state, action) => {
  const data = action?.payload;
  switch (action?.type) {
    case 'CART_DELIVERY':
      return {
        deliveryGroup: data?.group,
        delivery: data,
        payment: null,
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

const DeliveryAndPaymentForm = ({ countries }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cart, isLoading, cartUpdate } = useCart();
  const { deliveryOptions } = cart;

  useEffect(() => {
    dispatch({
      type: 'CART_ALL',
      payload: {
        deliveryGroup: cart?.delivery?.group,
        delivery: cart?.delivery,
        payment: cart?.payment,
        specificPayment: cart?.specificPaymentType,
      },
    });
  }, [cart]);

  const setSelectedDeliveryGroupToState = delivery => {
    dispatch({ type: 'CART_DELIVERY)GROUP', payload: delivery });
  };

  const setSelectedDeliveryToState = delivery => {
    dispatch({ type: 'CART_DELIVERY', payload: delivery });
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
        await cartUpdate(cartData, data => {});
      }
    }
  };

  return (
    <div className={'flex flex-col gap-6 rela'}>
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
