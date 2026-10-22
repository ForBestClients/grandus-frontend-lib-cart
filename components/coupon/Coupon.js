'use client';

import {useState} from 'react';
import useCart from 'grandus-lib/hooks/useCart';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import Button from 'components/_other/button/Button';
import TextInput from 'components/_other/form/TextInput';
import {useTranslation} from "@/app/i18n/client";

// The API rejects an unknown code with status false and the message 'Prosím
// preverte správnosť vášho kupón' (sic): that one gets our own text, any other
// rejection keeps the API message.
const INVALID_COUPON_MESSAGE = /preverte\s+správnosť/i;

const Coupon = ({}) => {
  const {cart, mutateCart, isLoading, applyCoupon, removeCoupon} = useCart();
  const {t} = useTranslation();
  const cartCoupon = get(cart, 'coupon.hash', '');
  const cartHasCoupon = !isEmpty(cartCoupon);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(cartHasCoupon);
  const [value, setValue] = useState(cartCoupon);

  const hasError = touched && error;

  const handleChange = async e => {
    setValue(e.target.value);
    setTouched(true);
    setError(null);
  };

  const handleBlur = e => {
    setValue(e.target.value);
    setTouched(true);
  };

  const onApplyCouponClick = async e => {
    e.preventDefault();
    setTouched(true);
    setError(null);

    if (!value) {
      setError(t('coupon.error.set_code'));
      return;
    }

    const response = await applyCoupon(value);
    if (!get(response, 'status', true)) {
      const message = get(response, 'message');
      setError(
        !message || INVALID_COUPON_MESSAGE.test(message)
          ? t('coupon.error.invalid')
          : message,
      );
    }

    mutateCart(get(response, 'data'), false);
  };

  const onRemoveCouponClick = async e => {
    e.preventDefault();
    setTouched(true);
    setError(null);
    setValue('');

    await removeCoupon();
    mutateCart();
  };

  return (
    <form
      action="#"
      onSubmit={onApplyCouponClick}
      noValidate
    >
      {/* items-start keeps the button level with the field when an error shows */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-4">
        <TextInput
          required
          label={''}
          error={hasError ? error : ''}
          inputProps={{
            id: 'discountCode',
            name: 'discountCode',
            onChange: handleChange,
            onBlur: handleBlur,
            groupClassName: '!mb-0 w-full min-w-0 flex-1',
            value: value,
            autoComplete: 'off',
            placeholder: t('coupon.code.placeholder'),
          }}
        />
        <div className={'w-full shrink-0 md:w-auto'}>
          {cartHasCoupon ? (
            <Button
              type="outline"
              onClick={onRemoveCouponClick}
              loading={isLoading}
              fullWidth={true}
              className="md:min-w-[160px]"
            >
              <span>{t('coupon.remove')}</span>
            </Button>
          ) : (
            <Button
              type="dark"
              htmlType="submit"
              loading={isLoading}
              fullWidth={true}
              className="md:min-w-[160px]"
            >
              <span>{t('coupon.apply')}</span>
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default Coupon;
