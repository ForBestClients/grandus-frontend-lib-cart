'use client';

import find from 'lodash/find';
import debounce from 'lodash/debounce';
import useCart from '@/grandus-lib/hooks/useCart';
import { useCallback, useEffect, useState } from 'react';
import AmountInputCart from '@/modules/cart/components/AmountInputCart';
import Image from '@/grandus-utils/wrappers/image/Image';
import IconRemove from '@/components/_other/icons/IconRemove';
import Button from '@/components/_other/button/Button';
import Link from 'next/link';
import PriceDynamic from '@/components/price/PriceDynamic';
import BundleInfo from '@/components/product/BundleInfo';
import PlaceHolderImage from '@/components/_other/placeholder/PlaceHolderImage';
import get from 'lodash/get';

const ItemRemoveButton = ({ item, className }) => {
  const { itemRemove, isLoading } = useCart();

  return (
    <Button
      type={'text'}
      color={'secondary'}
      onClick={() => itemRemove(item?.id)}
      loading={isLoading}
      className={className}
    >
      <IconRemove className={'h-6'} />
    </Button>
  );
};

const ItemBundleInfo = ({ item }) => {
  const measureUnit =
    get(item, 'product.store[0].name', item?.measureUnit) ?? 'ks';
  const piecesInBundle = get(item, 'product.store[0].piecesInBundle', 1);

  if (piecesInBundle > 1) {
    return `${item.count} bal (${item.count * piecesInBundle} ${measureUnit})`;
  }

  return `${item.count} ${measureUnit}`;
};

const CartListingItemVirtual = ({ item }) => {
  return (
    <>
      <div className="col col-span-3 md:col-span-2 p-2 ps-0 flex gap-4 items-center h-full relative">
        <div className="w-[50px] h-[60px] sm:w-[80px] sm:h-[100px] bg-grey flex-shrink-0">
          <PlaceHolderImage
            width={80}
            height={100}
            type={'jpg'}
            title={get(item, 'parameters.name', 'Virtual item')}
            alt={get(item, 'parameters.name', 'Virtual item')}
          />
        </div>
        <p className="text-left">
          {get(item, 'parameters.name', 'Virtual item')}
        </p>
      </div>

      <div className="col hidden sm:block text-center p-2 whitespace-nowrap"></div>

      <div className={'col hidden text-center md:block col-span-1 p-2'}>
        <span className={'text-sm'}>spolu:</span> <br />
        <ItemBundleInfo item={item} />
      </div>

      <div className="col col-span-2 sm:col-span-1 text-right sm:text-center p-2 whitespace-nowrap">
        <strong>
          <PriceDynamic
            priceData={item.priceTotalData}
            standartPriceData={item.priceTotalData}
            count={item.count}
          />
        </strong>
      </div>

      <div className="col col-span-3 block sm:hidden p-2"></div>

      <div className="col col-span-2 sm:col-span-1 p-2 text-right block">
        <ItemRemoveButton item={item} />
      </div>
    </>
  );
};

export default CartListingItemVirtual;
