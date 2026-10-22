import useCart from '@/grandus-lib/hooks/useCart';
import { useOptimistic, useTransition } from 'react';
import Image from '@/grandus-utils/wrappers/image/Image';
import Price from '@/components/price/Price';
import DeliveryProvider from '@/modules/cart/components/delivery/provider/DeliveryProvider';
import find from 'lodash/find';
import RadioInput from '@/components/_other/form/RadioInput';
import OptionCard from '@/modules/cart/components/ui/OptionCard';

const ShippingItem = ({
  delivery,
  countries,
  handleChange,
  selected = false,
  children,
}) => {
  const { cart } = useCart();
  const [isPending, startTransition] = useTransition();
  const [optimisticIsSelected, setOptimisticIsSelected] = useOptimistic(
    selected,
    (_, newState) => newState,
  );

  // RadioInput renders the input with the id `${id}-${value}` (value '')
  const radioId = `delivery-${delivery.id}`;

  const onChange = e => {
    startTransition(async () => {
      setOptimisticIsSelected(true);
      handleChange(delivery);
    });
  };

  // the whole row is the radio's label: a click anywhere selects it once
  // (natively) and gives the radio its accessible name
  return (
    <OptionCard selected={optimisticIsSelected}>
      <label
        htmlFor={`${radioId}-`}
        className={'flex cursor-pointer items-start gap-2 p-4 md:gap-3'}
      >
        <RadioInput
          inputProps={{
            id: radioId,
            name: 'cart-delivery',
            className: '!mb-0 mt-px shrink-0',
            onChange: onChange,
            checked: optimisticIsSelected,
          }}
        />
        {delivery?.photo ? (
          <div className="h-[60px] w-[50px] flex-shrink-0 overflow-hidden rounded-[8px]">
            <Image
              width={50}
              height={60}
              className={'h-full w-full object-contain'}
              photo={{
                ...delivery?.photo,
                path: `${delivery?.photo?.path}/${delivery?.photo.id}`,
              }}
              type={'jpg'}
              title={delivery?.name}
              alt={delivery?.name ?? 'product'}
            />
          </div>
        ) : (
          ''
        )}
        <div className={'min-w-0 flex-grow'}>
          <span className="mb-1 inline-block text-[15px] font-semibold leading-snug text-ink">
            {delivery?.name}{' '}
          </span>
          <div
            className={'text-sm leading-snug text-ink-muted [&_p]:mb-0 [&_p]:text-sm [&_p]:leading-snug'}
            dangerouslySetInnerHTML={{ __html: delivery?.description }}
          />
        </div>
        <div className={'shrink-0 whitespace-nowrap text-[15px]'}>
          <Price priceData={delivery.priceData} />
        </div>
      </label>
      <DeliveryProvider
        delivery={delivery}
        selected={optimisticIsSelected}
        country={find(countries, { id: cart?.countryId })}
        className="px-4 pb-4 md:ps-14"
      />
      {children}
    </OptionCard>
  );
};

export default ShippingItem;
