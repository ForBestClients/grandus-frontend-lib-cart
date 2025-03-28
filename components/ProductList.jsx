'use client';

import useCart from "grandus-lib/hooks/useCart";
import find from "lodash/find";
import first from "lodash/first";
import LoadingIcon from "components/_other/icons/LoadingIcon";
import map from "lodash/map";
import {useState, useEffect} from "react";
import Price from "components/price/Price";

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
    background = 'border-primary bg-primary text-background'
  }

  if (isLoading) {
    background = 'border-grey3 bg-grey3'
  }

  return (
    <div
      className={`p-2 mb-2 rounded border ${background}`}>
      <div className="flex items-center gap-2">
        <div className='flex-grow'>
          <label
            htmlFor={`product-${product.id}`}
            className={`flex items-center justify-start ${!isLoading ? 'hover:cursor-pointer' : 'pointer-events-none'}`}
          >
            <input
              type='checkbox'
              onChange={onChange}
              name={`product-${product.id}`}
              id={`product-${product.id}`}
              checked={isChecked}
              className="me-2"
              value={product.id}
            />
            {product.name}
          </label>
        </div>
        <div className={isLoading ? 'block' : 'hidden'}>
          <LoadingIcon className={`h-1 ${isChecked && !isLoading ? 'text-background' : 'text-font'}`}/>
        </div>
        <div className={'flex-end'}>
          <strong>
            <Price priceData={product.finalPriceData}/>
          </strong>
        </div>
      </div>
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