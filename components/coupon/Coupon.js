'use client';

import {useState} from 'react';
import useCart from 'grandus-lib/hooks/useCart';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import Button from 'components/_other/button/Button';
import TextInput from 'components/_other/form/TextInput';
import {useTranslation} from "@/app/i18n/client";

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
    }

    const response = await applyCoupon(value);
    if (!get(response, 'status', true) && get(response, 'message')) {
      setError(get(response, 'message'));
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
    <div className="mt-2">
      <form
        action="#"
        onSubmit={onApplyCouponClick}
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <TextInput
              required
              label={''}
              error={hasError ? error : ''}
              inputProps={{
                id: 'discountCode',
                name: 'discountCode',
                onChange: handleChange,
                onBlur: handleBlur,
                groupClassName:"!mb-0 w-full flex-shrink",
                value: value,
                placeholder: t('coupon.code.placeholder'),
              }}
            />
          <div className={"w-full md:w-fit"}>
            {cartHasCoupon ? (
              <Button
                size={"smallWithNormalText"}
                onClick={onRemoveCouponClick}
                fullWidth={true}
                round
              >
                <span>{t('coupon.remove')}</span>
              </Button>
            ) : (
              <Button
                size={"smallWithNormalText"}
                onClick={onApplyCouponClick}
                disabled={!value}
                loading={isLoading}
                fullWidth={true}
                round
              >
                <span>{t('coupon.apply')}</span>
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Coupon;
