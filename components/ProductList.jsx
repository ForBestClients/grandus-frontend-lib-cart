'use client';

import useCart from 'grandus-lib/hooks/useCart';
import find from "lodash/find";
import first from "lodash/first";
import LoadingIcon from "components/_other/icons/LoadingIcon";
import map from "lodash/map";
import {useState, useEffect} from "react";
import Price from "components/price/Price";
import CartThumb from "@/modules/cart/components/ui/CartThumb";
import { trackAddToCart, trackRemoveFromCart } from "@/utils/tracking";
import { findCartItem } from "@/app/components/cart/addToCart/storeOptions";

const ProductListItem = ({product, compact = false}) => {
  const {cart, itemsAdd, itemRemove} = useCart();
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const item = find(cart?.items, ['product.id', product.id]);

    setIsChecked(!!item);

  }, [cart]);


  const onChange = (e) => {
    if (isLoading) {
      e.preventDefault();
      return;
    }

    //e.preventDefault();
    setIsLoading(true);

    const checked = e.target.checked;
    setIsChecked(checked);
    const store = first(product?.store);
    const item = find(cart?.items, ['product.id', product.id]);

    if (checked && !item) {
      itemsAdd([{productId: product.id, sizeId: store.id, count: 1}], (cartData) => {
        setIsLoading(false);
        if (cartData?.success) {
          // GA4 add_to_cart + Meta AddToCart for the service (gift wrapping…)
          trackAddToCart(findCartItem(cartData, product.id, store.id), 1);
        }
      });
    } else if (item) {
      itemRemove(item.id, (cartData) => {
        setIsLoading(false);
      });
      trackRemoveFromCart(item, item?.count);
    }
  }

  // card: white with #E3EEED border; checked = brand border + light brand-soft fill
  let state = 'border-line-card bg-white hover:border-brand/60';

  if (isChecked) {
    state = 'border-brand bg-brand-soft/40';
  }

  if (isLoading) {
    state = `${isChecked ? 'border-brand' : 'border-line-card'} bg-brand-soft/40 opacity-70`;
  }

  const inputId = `product-${product.id}${compact ? '-compact' : ''}`;

  return (
    <div
      className={`border transition-colors duration-150 ${state} ${
        compact ? 'rounded-input px-3 py-2.5' : 'rounded-card px-4 py-3 md:px-5'
      }`}
    >
      <label
        htmlFor={inputId}
        className={`flex items-center gap-3 ${!isLoading ? 'cursor-pointer' : 'pointer-events-none'}`}
      >
        <input
          type='checkbox'
          onChange={onChange}
          name={`product-${product.id}`}
          id={inputId}
          checked={isChecked}
          className="ac-checkbox"
          value={product.id}
        />
        {product?.photo ? (
          <CartThumb
            photo={product.photo}
            alt={product.name ?? 'service'}
            title={product.name}
            size="square"
            className={compact ? '!h-11 !w-11' : ''}
          />
        ) : null}
        <span className='min-w-0 flex-grow'>
          <span className={`block leading-snug text-ink ${compact ? 'text-sm font-semibold' : 'text-base font-bold'}`}>
            {product.name}
          </span>
          {product?.shortDescription ? (
            <span className={`mt-0.5 text-xs leading-snug text-ink-muted ${compact ? 'line-clamp-2' : 'block'}`}>
              {product.shortDescription}
            </span>
          ) : null}
        </span>
        {isLoading ? (
          <span className={'flex-shrink-0'}>
            <LoadingIcon className={'h-3 w-6 text-brand-deep'}/>
          </span>
        ) : null}
        <span className={`flex-shrink-0 text-right ${compact ? 'text-sm' : 'text-[15px]'}`}>
          <Price priceData={product.finalPriceData}/>
        </span>
      </label>
    </div>
  );
}


const ProductList = ({products, compact = false}) => {
  return (
    <div className={compact ? 'flex flex-col gap-2' : 'flex flex-col gap-2 pb-2'}>
      {map(products, (product, i) => {
        return (
          <ProductListItem product={product} compact={compact} key={`product-${product?.id ?? i}`}/>
        )
      })}
    </div>
  );
}

export default ProductList;
