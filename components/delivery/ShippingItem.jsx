import useCart from '@/grandus-lib/hooks/useCart';
import { useOptimistic, useTransition } from 'react';
import Image from '@/grandus-utils/wrappers/image/Image';
import Price from '@/components/price/Price';
import DeliveryProvider from '@/modules/cart/components/delivery/provider/DeliveryProvider';
import find from 'lodash/find';
import RadioInput from '@/components/_other/form/RadioInput';

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

  const onChange = e => {
    startTransition(async () => {
      setOptimisticIsSelected(true);
      handleChange(delivery);
    });
  };

  return (
    <div className={'mt-4'}>
      <div>
        <label
          htmlFor={`delivery-${delivery.id}`}
          className={'flex items-start justify-start gap-4'}
          onClick={onChange}
        >
          <RadioInput
            inputProps={{
              id: `delivery-${delivery.id}`,
              name: `delivery-${delivery.id}`,
              className: 'me-2',
              onChange: onChange,
              checked: optimisticIsSelected,
            }}
          />
          {delivery?.photo ? (
            <div className="w-[50px] h-[60px] flex-shrink-0">
              <Image
                width={50}
                height={60}
                className={'w-full h-auto'}
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
          <div className={'flex-grow'}>
            <span className="font-bold text-font inline-block mb-1">
              {delivery?.name}{' '}
            </span>
            <p
              className={'text-sm text-grey3'}
              dangerouslySetInnerHTML={{ __html: delivery?.description }}
            />
          </div>
          <div className={'font-semibold'}>
            <Price priceData={delivery.priceData} />
          </div>
        </label>
      </div>
      <DeliveryProvider
        delivery={delivery}
        selected={optimisticIsSelected}
        country={find(countries, { id: cart?.countryId })}
      />
      {children}
    </div>
  );
};

export default ShippingItem;
