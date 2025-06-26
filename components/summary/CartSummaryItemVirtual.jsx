'use client';

import Price from '@/components/price/Price';
import get from 'lodash/get';
import PlaceHolderImage from '@/components/_other/placeholder/PlaceHolderImage';

const CartSummaryItemVirtual = ({ item }) => {
  return (
    <>
      <div className="col col-span-3 p-2 ps-0 flex gap-4 items-center h-full relative">
        <div className="w-[50px] h-[60px] bg-grey flex-shrink-0">
          <PlaceHolderImage
            width={100}
            height={120}
            type={'jpg'}
            title={get(item, 'parameters.name', 'Virtual item')}
            alt={get(item, 'parameters.name', 'Virtual item')}
          />
        </div>
        <p>{get(item, 'parameters.name', 'Virtual item')}</p>
      </div>

      <div className="col text-right p-2">
        <span className={'lg:text-lg font-bold'}>
          <Price
            priceData={item.priceTotalData}
            standartPriceData={item.priceTotalData}
            count={item.count}
          />
        </span>
      </div>
    </>
  );
};

export default CartSummaryItemVirtual;
