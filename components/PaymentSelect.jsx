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
import OptionCard from '@/modules/cart/components/ui/OptionCard';

const PaymentItem = ({ payment, handleChange, selected = false }) => {
  const [isPending, startTransition] = useTransition();
  const [optimisticIsSelected, setOptimisticIsSelected] = useOptimistic(
    selected,
    (_, newState) => newState,
  );

  // RadioInput renders the input with the id `${id}-${value}` (value '')
  const radioId = `payment-${payment.id}`;

  const onChange = e => {
    startTransition(async () => {
      setOptimisticIsSelected(true);
      handleChange(payment);
    });
  };

  // the whole row is the radio's label: a click anywhere selects it once
  // (natively, one cart update) and gives the radio its accessible name
  return (
    <OptionCard selected={optimisticIsSelected}>
      <label
        htmlFor={`${radioId}-`}
        className={'flex cursor-pointer items-start gap-2 p-4 md:gap-3'}
      >
        <RadioInput
          inputProps={{
            id: radioId,
            name: 'cart-payment',
            className: '!mb-0 mt-px shrink-0',
            onChange: onChange,
            checked: optimisticIsSelected,
          }}
        />
        {payment?.photo ? (
          <div className="h-[60px] w-[50px] flex-shrink-0 overflow-hidden rounded-[8px]">
            <Image
              width={50}
              height={60}
              className={'h-full w-full object-contain'}
              photo={payment?.photo}
              type={'jpg'}
              title={payment?.name}
              alt={payment?.name ?? 'product'}
            />
          </div>
        ) : (
          ''
        )}
        <div className={'min-w-0 flex-grow'}>
          <span className="mb-1 inline-block text-[15px] font-semibold leading-snug text-ink">
            {payment?.name}{' '}
          </span>
          <div
            className="text-sm leading-snug text-ink-muted [&_p]:mb-0 [&_p]:text-sm [&_p]:leading-snug"
            dangerouslySetInnerHTML={{ __html: payment?.description }}
          />
        </div>
        <div className={'shrink-0 whitespace-nowrap text-[15px]'}>
          <Price priceData={payment.priceData} />
        </div>
      </label>
    </OptionCard>
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
      <h2 id="cart-payment-title" className="mb-4 text-lg font-medium leading-snug text-ink md:text-xl">
        {t('cart_form.payment.title')}
      </h2>
      {isEmpty(options) ? (
        <p className="mb-0 text-[15px] text-ink-muted">
          {t(
            cart?.delivery === null
              ? 'payment_select.select_delivery'
              : 'payment_select.empty',
          )}
        </p>
      ) : (
        <div className="flex flex-col gap-3" role="radiogroup" aria-labelledby="cart-payment-title">
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
        </div>
      )}
    </div>
  );
};

export default PaymentSelect;
