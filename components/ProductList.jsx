'use client';

import useCart from 'grandus-lib/hooks/useCart';
import find from "lodash/find";
import first from "lodash/first";
import LoadingIcon from "components/_other/icons/LoadingIcon";
import map from "lodash/map";
import {useState, useEffect} from "react";
import Price from "components/price/Price";
import Image from "@/grandus-utils/wrappers/image/Image";

const ProductListItem = ({product}) => {
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
      });
    } else if (item) {
      itemRemove(item.id, (cartData) => {
        setIsLoading(false);
      });
    }
  }

  let background = 'border-grey3 bg-background'

  if (isChecked) {
    background = 'border-black bg-background'
  }

  if (isLoading) {
    background = 'border-grey3 bg-grey3'
  }

  return (
    <div
      className={`p-2 mb-2 rounded border ${background}`}>
      <label
        htmlFor={`product-${product.id}`}
        className={`flex items-center gap-3 ${!isLoading ? 'hover:cursor-pointer' : 'pointer-events-none'}`}
      >
        <input
          type='checkbox'
          onChange={onChange}
          name={`product-${product.id}`}
          id={`product-${product.id}`}
          checked={isChecked}
          className="flex-shrink-0"
          value={product.id}
        />
        {product?.photo ? (
          <div className="w-[50px] h-[60px] flex-shrink-0">
            <Image
              width={50}
              height={60}
              photo={product.photo}
              type={'jpg'}
              title={product.name}
              alt={product.name ?? 'service'}
            />
          </div>
        ) : null}
        <div className='flex-grow'>
          <div className="font-bold">{product.name}</div>
          {product?.shortDescription ? (
            <div className="text-xs opacity-80">{product.shortDescription}</div>
          ) : null}
        </div>
        <div className={isLoading ? 'block flex-shrink-0' : 'hidden'}>
          <LoadingIcon className={'h-1 text-font'}/>
        </div>
        <div className={'flex-shrink-0 text-right'}>
          <strong>
            <Price priceData={product.finalPriceData}/>
          </strong>
        </div>
      </label>
    </div>
  );
}


const ProductList = ({products}) => {
  return (
    <div className={'mt-4'}>
      {map(products, (product, i) => {
        return (
          <ProductListItem product={product} key={`product-${i}`}/>
        )
      })}
    </div>
  );
}

export default ProductList;
