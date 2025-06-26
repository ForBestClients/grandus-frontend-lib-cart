'use client';

import Price from '@/components/price/Price';
import Divider from '@/components/_other/divider/Divider';
import { useTranslation } from '@/app/i18n/client';
import { formatter } from '@/utils/price';

const CartSummaryItems = ({ cart }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-4 items-center">
      <div className="col col-span-2 p-2 ps-0">
        <p>{t('cart_summary_items.totalProducts')}</p>
      </div>
      <div className="col col-span-2 p-2 text-end">
        <span className={'whitespace-nowrap text-lg lg:text-xl font-bold '}>
          <Price priceData={cart.sumData} className={'!items-end'} />
        </span>
      </div>

      {cart?.coupon ? (
        <>
          <div className="col col-span-2 p-2 ps-0">{cart.coupon.hash}</div>
          <div className="col col-span-2 p-2 text-end">
            <span className={'whitespace-nowrap lg:text-lg font-bold '}>
              <Price
                priceData={cart.coupon.discountData}
                isDiscount
                className={'!items-end'}
              />
            </span>
          </div>
        </>
      ) : (
        ''
      )}

      {cart?.delivery ? (
        <>
          <div className="col col-span-2 p-2 ps-0">{cart.delivery.name}</div>
          <div className="col col-span-2 p-2 text-end">
            <span className={'whitespace-nowrap lg:text-lg font-bold '}>
              <Price
                priceData={cart?.delivery.priceData}
                className={'!items-end'}
              />
            </span>
          </div>
        </>
      ) : (
        ''
      )}

      {cart?.payment ? (
        <>
          <div className="col col-span-2 p-2 ps-0">{cart.payment.name}</div>
          <div className="col col-span-2 p-2 text-end">
            <span className={'whitespace-nowrap lg:text-lg font-bold '}>
              <Price
                priceData={cart?.payment.priceData}
                className={'!items-end'}
              />
            </span>
          </div>
        </>
      ) : (
        ''
      )}

      <div className="col-span-full">
        <Divider />
      </div>

      <div className="col col-span-2 p-2 ps-0">
        <p>{t('cart_summary_items.totalWithoutVAT')}</p>
      </div>
      <div className="col col-span-2 p-2 text-end">
        <span className={'lg:text-lg font-bold whitespace-nowrap'}>
          <Price priceData={cart.sumData} withVat={false} />
        </span>
      </div>

      <div className="col col-span-2 p-2 ps-0">
        <p>{t('cart_summary_items.VAT')}</p>
      </div>
      <div className="col col-span-2 p-2 text-end">
        <span className={'whitespace-nowrap font-bold lg:text-lg'}>
          {formatter.format(cart.sumData.vatFraction)}
        </span>
      </div>

      <div className="col col-span-2 p-2 ps-0">
        <span className={'text-primary text-xl font-bold whitespace-nowrap'}>
          {t('cart_summary_items.total')}
        </span>
      </div>
      <div className="col col-span-2 p-2 text-end">
        <span className={'text-primary text-xl font-bold whitespace-nowrap'}>
          {cart?.sumData?.priceFormatted ?? ''}
        </span>
      </div>
    </div>
  );
};

export default CartSummaryItems;
