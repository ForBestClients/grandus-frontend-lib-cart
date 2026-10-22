'use client';

import Price from "@/components/price/Price";
import Link from 'next/link';
import CartThumb from "@/modules/cart/components/ui/CartThumb";

const CartSummaryItem = ({item}) => {
  return (
    <li className="group relative flex items-center gap-4">
      <Link
        href={`/produkt/${item.product.urlTitle}`}
        aria-label={item?.product?.name}
        className="absolute inset-0 z-[1] rounded-[10px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-deep"
      />
      <CartThumb
        photo={item?.product?.photo}
        alt={item?.product?.name ?? 'product'}
        title={item?.product?.name}
        size="sm"
      />
      <p className="mb-0 min-w-0 flex-1 text-[15px] leading-snug text-ink transition-colors group-hover:text-brand-deep">
        {item?.product?.name}
      </p>
      <span className="shrink-0 text-base">
        <Price
          priceData={item.priceTotalData}
          standartPriceData={item?.product?.standardPriceData}
          count={item.count}
        />
      </span>
    </li>
  )
}

export default CartSummaryItem;
