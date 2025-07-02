'use client';

import Price from '@/components/price/Price';
import Image from '@/grandus-utils/wrappers/image/Image';
import Link from 'next/link';
import { useTranslation } from '@/app/i18n/client';

const CartExtraSummaryItem = ({ item }) => {
  const { t } = useTranslation();
  if (!item?.product) {
    return '';
  }

  return (
    <>
      <div className="col col-span-3 p-2 ps-0 flex gap-4 items-center h-full relative">
        <Link
          href={`/produkt/${item.product.urlTitle}`}
          className="absolute w-full h-full"
        />
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
        <p>{item?.product?.name}</p>
      </div>

      <div className="col text-right p-2">
        <span className={'lg:text-base font-bold'}>
          {t('cart_summary_items.free')}
        </span>
      </div>
    </>
  );
};

export default CartExtraSummaryItem;
