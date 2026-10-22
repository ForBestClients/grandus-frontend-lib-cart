'use client';
import useCart from 'grandus-lib/hooks/useCart';
import { useEffect, useState } from 'react';
import Coupon from '@/modules/cart/components/coupon/Coupon';
import Isic from '@/modules/cart/components/isic/Isic';
import Box from "@/components/_other/box/Box";
import Button from '@/components/_other/button/Button';
import { useTranslation } from '@/app/i18n/client';
import useWebInstance from 'grandus-lib/hooks/useWebInstance';
import toNumber from 'lodash/toNumber';

const DiscountForm = () => {
  const { cart, removeCoupon } = useCart();
  const { t } = useTranslation();
  const { settings } = useWebInstance();

  const isIsicEnabled = toNumber(settings?.isic_active) ? true : false;

  const onChange = value => {
    if (value === 'isic' && cart?.couponHash) {
      removeCoupon();
    }
  };

  return (
    <>
      {isIsicEnabled ? (
        <Box>
          <div className="flex">
            <div className="flex-grow">
              <label
                htmlFor={`discount-isic`}
                className={'flex items-center justify-start'}
              >
                <Button
                  type={'text'}
                  size="smallWithNormalText"
                  onClick={() => onChange('isic')}
                  name={`discount-isic`}
                  id={`discount-isic`}
                  value={'isic'}
                  className={'!text-left'}
                >
                  {t('discount_form.isic.label.on')}
                </Button>
              </label>
            </div>
          </div>

          <div>
            <Isic />
          </div>
        </Box>
      ) : (
        ''
      )}

      <Box className={isIsicEnabled ? 'mt-4' : ''}>
        {/* visible label of the coupon field (#discountCode in Coupon) */}
        <label
          htmlFor="discountCode"
          className="mb-6 block text-base font-medium leading-snug tracking-[0.02em] text-ink md:mb-8 md:mt-3 md:text-lg"
        >
          {t('discount_form.coupon.label.on')}
        </label>

        <Coupon />
      </Box>
    </>
  );
};

export default DiscountForm;
