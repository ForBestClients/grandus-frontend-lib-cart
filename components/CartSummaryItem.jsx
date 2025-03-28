'use client';

import find from "lodash/find";
import debounce from "lodash/debounce";
import useCart from "grandus-lib/hooks/useCart";
import {useCallback, useState} from "react";
import AmountInputCart from "@/modules/cart/components/AmountInputCart";
import Price from "components/price/Price";

const ItemCountInput = ({item}) => {
  const {product, store, count} = item;

  const {itemUpdate, isLoading} = useCart();
  const [amount, setAmount] = useState(count);

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
      <div className="col col-span-2 p-2 ps-0">
        {item.product.name}
      </div>

      <div className="col text-center p-2">
        <ItemCountInput item={item}/>
      </div>

      <div className="col text-right p-2">
        <strong><Price priceData={item.priceTotalData}/></strong>
      </div>
    </>
  )
}

export default CartSummaryItem;
