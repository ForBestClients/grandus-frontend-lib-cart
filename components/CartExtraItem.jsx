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
import { useTranslation } from '@/app/i18n/client';

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

const CartExtraItem = ({ item }) => {
  const { t } = useTranslation();
  if (!item?.product) {
    return '';
  }

  //const itemInfos = [];

  {
    /*if (item?.product?.ean) {
    itemInfos.push(item.product.ean);
  }*/
  }

  return (
    <>
      <div className="col col-span-3 md:col-span-2 p-2 ps-0 flex gap-4 items-center h-full relative">
        <Link
          href={`/produkt/${item.product.urlTitle}`}
          className="absolute w-full h-full"
        />
        <div className="w-[50px] h-[60px] sm:w-[80px] sm:h-[100px] bg-grey flex-shrink-0">
          {item?.product?.photo ? (
            <Image
              width={80}
              height={100}
              photo={item?.product?.photo}
              type={'jpg'}
              title={item?.product?.name}
              alt={item?.product?.name ?? 'product'}
            />
          ) : (
            <PlaceHolderImage
              width={80}
              height={100}
              type={'jpg'}
              title={item?.product?.name}
              alt={item?.product?.name ?? 'product'}
            />
          )}
        </div>
        <p className="text-left">
          {item?.product?.name}
          <br />
          <span className={'text-sm'}>{item?.cartHook?.name}</span>
        </p>
      </div>
      <div className="col hidden sm:block text-center p-2 whitespace-nowrap"></div>

      <div className={'col hidden text-center md:block col-span-1 p-2'}></div>
      <div className="col col-span-2 sm:col-span-1 text-right sm:text-center p-2 whitespace-nowrap">
        <strong>{t('cart_summary_items.free')}</strong>
      </div>
    </>
  );
};

export default CartExtraItem;
