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

const ItemCountInput = ({ item }) => {
  const { product, store, count } = item;

  const { itemUpdate, isLoading } = useCart();
  const [amount, setAmount] = useState(count);

  useEffect(() => {
    setAmount(count);
  }, [count]);

  const selectedStore = find(
    product?.store,
    productStore => productStore?.id === store?.id,
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCountChange = useCallback(
    debounce(value => {
      try {
        const oldCount = +item?.count || 1;
        let newCount = +value || 1;
        if (newCount !== oldCount) {
          itemUpdate(item?.id, { count: newCount }, cart => {
            const newItem = find(cart?.items, { id: item?.id });
            if (newCount !== newItem?.count) {
              setAmount(newItem?.count);
            }
          });
        }
      } catch {
        console.log('error');
      }
    }, 500),
  );

  return (
    <AmountInputCart
      size={selectedStore}
      amount={amount}
      setAmount={setAmount}
      afterChange={handleCountChange}
      loading={isLoading}
      item={item}
    />
  );
};

const ItemRemoveButton = ({ item, className }) => {
  const { itemRemove, isLoading } = useCart();

  return <Button
    type={'text'}
    color={'secondary'}
    onClick={() => itemRemove(item?.id)} loading={isLoading}
    className={className}>
    <IconRemove className={'h-6'} />
  </Button>;
};

const ItemBundleInfo = ({ item }) => {
  const measureUnit = get(item, 'product.store[0].name', item?.measureUnit) ?? 'ks';
  const piecesInBundle = get(item, 'product.store[0].piecesInBundle', 1);

  if (piecesInBundle > 1) {
    return `${item.count} bal (${item.count * piecesInBundle} ${measureUnit})`
  }

  return `${item.count} ${measureUnit}`;
}

const CartListingItem = ({ item }) => {

  const itemInfos = [];

  if (item?.product?.ean) {
    itemInfos.push(item.product.ean);
  }

  if (get(item, 'product.store[0].weight')) {
    itemInfos.push(`Hmotnosť: ${get(item, 'product.store[0].weight')} kg`);
  }

  return (
    <>
      <div className="col col-span-3 md:col-span-2 p-2 ps-0 flex gap-4 items-center h-full relative">
        <Link href={`/produkt/${item.product.urlTitle}`} className="absolute w-full h-full" />
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
          <br/>
          <span className={'text-sm'}>{itemInfos.join(' | ')}</span>
        </p>
      </div>

      <div className="col hidden sm:block text-center p-2 whitespace-nowrap">
        <ItemCountInput item={item} className={'justify-center'} />
        <BundleInfo product={item?.product} className="ms-2" />
      </div>

      <div className={'col hidden text-center md:block col-span-1 p-2'}>
        <span className={'text-sm'}>spolu:</span> <br/>
        <ItemBundleInfo item={item} />
      </div>

      <div className="col col-span-2 sm:col-span-1 text-right sm:text-center p-2 whitespace-nowrap">
        <strong>
          <PriceDynamic
            priceData={item.priceTotalData}
            standartPriceData={item?.product?.standardPriceData}
            count={item.count}
          />
        </strong>
      </div>

      <div className="col col-span-3 block sm:hidden p-2">
        <ItemCountInput item={item} />
      </div>

      <div className="col col-span-2 sm:col-span-1 p-2 text-right block">
        <ItemRemoveButton item={item} />
      </div>
    </>
  );
};

export default CartListingItem;
