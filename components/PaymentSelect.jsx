'use client';

import useCart from 'grandus-lib/hooks/useCart';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { useOptimistic, useTransition } from 'react';
import Price from 'components/price/Price';
import Image from '@/grandus-utils/wrappers/image/Image';
import ShippingAndPaymentSkeleton from '@/modules/cart/components/skeletons/ShippingAndPaymentSkeleton';
import { useTranslation } from '@/app/i18n/client';
import RadioInput from '@/components/_other/form/RadioInput';

const PaymentItem = ({ payment, handleChange, selected = false }) => {
  const [isPending, startTransition] = useTransition();
  const [optimisticIsSelected, setOptimisticIsSelected] = useOptimistic(
    selected,
    (_, newState) => newState,
  );

  const onChange = e => {
    startTransition(async () => {
      setOptimisticIsSelected(true);
      handleChange(payment);
    });
  };

  return (
    <div className={'mt-4'}>
      <label
        htmlFor={`payment-${payment.id}`}
        className={'flex items-start justify-start gap-4'}
        onClick={onChange}
      >
        <RadioInput
          inputProps={{
            id: `payment-${payment.id}`,
            name: `payment`,
            className: 'me-2',
            onChange: onChange,
            checked: optimisticIsSelected,
          }}
        />
        {payment?.photo ? (
          <div className="w-[50px] h-[60px] flex-shrink-0">
            <Image
              width={50}
              height={60}
              className={'w-full h-auto'}
              photo={payment?.photo}
              type={'jpg'}
              title={payment?.name}
              alt={payment?.name ?? 'product'}
            />
          </div>
        ) : (
          ''
        )}
        <div className={'flex-grow'}>
          <span className="font-bold text-font inline-block mb-1">
            {payment?.name}{' '}
          </span>
          <p
            className="text-sm text-grey3"
            dangerouslySetInnerHTML={{ __html: payment?.description }}
          />
        </div>
        <div className={'font-semibold'}>
          <Price priceData={payment.priceData} />
        </div>
      </label>
    </div>
  );
};

const PaymentSelect = ({ options, selected, handleChange }) => {
  const { cart, isLoading } = useCart();
  const { t } = useTranslation();

  if (isEmpty(cart) && isLoading) {
    return <ShippingAndPaymentSkeleton />;
  }

  return (
    <div>
      <h3 className="text-lg mb-3">{t('cart_form.payment.title')}</h3>
      {isEmpty(options) ? (
        <p>
          {t(
            cart?.delivery === null
              ? 'payment_select.select_delivery'
              : 'payment_select.empty',
          )}
        </p>
      ) : (
        <>
          {map(options, (payment, i) => {
            return (
              <PaymentItem
                key={`payment-item-${i}`}
                payment={payment}
                selected={selected?.id === payment.id}
                handleChange={handleChange}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default PaymentSelect;
