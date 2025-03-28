'use client';

import find from "lodash/find";
import debounce from "lodash/debounce";
import useCart from "@/grandus-lib/hooks/useCart";
import { startTransition, useCallback, useEffect, useOptimistic, useState } from 'react';
import AmountInputCart from "@/modules/cart/components/AmountInputCart";
import Price from "@/components/price/Price";
import Image from '@/grandus-utils/wrappers/image/Image';
import Link from 'next/link';
import Button from '@/components/_other/button/Button';

const ItemCountInput = ({item}) => {
  const {product, store, count} = item;

  const {itemUpdate, isLoading} = useCart();
  const [amount, setAmount] = useState(count);

  useEffect(() => {
    setAmount(count)
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
          itemUpdate(item?.id, {count: newCount}, cart => {
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

const CartSummaryItem = ({item}) => {
  return (
    <>
      <div className="col col-span-3 p-2 ps-0 flex gap-4 items-center h-full relative">
        <Link href={`/produkt/${item.product.urlTitle}`} className="absolute w-full h-full" />
        <div className="w-[50px] h-[60px] bg-grey flex-shrink-0">
        {item?.product?.photo ? (
          <Image
            width={100}
            height={120}
            photo={item?.product?.photo}
            type={'jpg'}
            title={item?.product?.name}
            alt={item?.product?.name ?? 'product'}
          />
        ) : (
          ''
        )}
      </div>
        <p>
          {item?.product?.name}
        </p>
      </div>

      <div className="col text-right p-2">
        <span className={'lg:text-lg font-bold'}>
          <Price
            priceData={item.priceTotalData}
            standartPriceData={item?.product?.standardPriceData}
            count={item.count}
          />
        </span>
      </div>
    </>
  )
}

export default CartSummaryItem;
