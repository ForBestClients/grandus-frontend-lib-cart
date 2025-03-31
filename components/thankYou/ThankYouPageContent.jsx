'use client';
import Box from "@/components/content/Box";
import Badge from "@/components/content/Badge";
import map from "lodash/map";
import Price from "@/components/price/Price";
import get from "lodash/get";
import Divider from "@/components/_other/divider/Divider";
import {useTranslation} from "@/app/i18n/client";
import {useSearchParams} from "next/navigation";
import Alert from "@/components/_other/alert/Alert";
import {useEffect} from "react";
import TagManager from "@/grandus-lib/utils/gtag";
import EnhancedEcommerce from "@/grandus-lib/utils/ecommerce";
import useUser from "@/grandus-lib/hooks/useUser";

const ThankYouPageContent = ({order}) => {
  const {t} = useTranslation();
  const searchParams = useSearchParams();
  const { user, isLoading: userIsLoading } = useUser();

  useEffect(() => {
    if (order && !userIsLoading) {
      TagManager.push(EnhancedEcommerce.purchaseG4(order, user));
    }
  }, [order, user, userIsLoading]);

  return (
      <>
        <Box className="bg-white text-center mb-16 py-0">
          <h1 className="mb-4 text-xl">{t('order.thank_you.title')}</h1>

          <Badge>
            {t('order.thank_you.order_no')} {order.orderNumber}
          </Badge>
        </Box>

        <div className="flex justify-center">
          <div className={'w-[100%] max-w-[550px]'}>
            {searchParams.get('status') === '0' && searchParams.get('message') ? <Alert type="error" message={searchParams.get('message')} className="mb-6" /> : null }

            <Box>
              <div className={'grid grid-cols-4 gap-2 pb-3 text-lg md:text-xl'}>
                <div className={'col-span-2'}>
                  <strong>{t('order.thank_you.products')}</strong>
                </div>

                <div className={'col text-center'}>
                  <strong>{t('order.thank_you.count')}</strong>
                </div>

                <div className={'col text-end'}>
                  <strong>{t('order.thank_you.price')}</strong>
                </div>
              </div>
              {map(order.orderItems, (orderItem, index) => {
                return (<div key={`order-item-${index}`} className={'grid grid-cols-4 gap-2 pb-3'}>
                  <div className={'col-span-2'}>
                    {orderItem.name}
                  </div>

                  <div className={'col text-center'}>
                    {orderItem.count} {orderItem.size}
                  </div>

                  <div className={'col text-end'}>
                    <span className={'md:text-lg font-bold'}>
                      <Price priceData={orderItem.totalPriceData}/>
                    </span>
                  </div>
                </div>)
              })}

              <Divider />

              {map(order?.coupons, (coupon, i) => {
                return (
                  <div key={`order-coupon-${i}`} className={'grid grid-cols-4 gap-2 pb-1'}>
                    <div className={'col-span-3'}>
                      <strong>
                        {coupon.hash}
                      </strong>
                    </div>
                    <div className="col-span-1 text-end">
                      <span className={'md:text-lg font-bold'}>
                        -<Price priceData={coupon.discountData} />
                      </span>
                    </div>
                  </div>
                )
              })}

              {get(order, 'deliveryPriceData.price', 0) !== null
                ?
                <div className={'grid grid-cols-4 gap-2 pb-2'}>
                  <div className={'col-span-3 flex flex-col'}>
                    <strong>
                      {t('order.thank_you.delivery')}
                    </strong>
                    <span>{order?.delivery}</span>
                  </div>
                  <div className="col-span-1 text-end">
                    <span className={'md:text-lg font-bold'}><Price priceData={order.deliveryPriceData}/></span>
                  </div>
                </div>
                : ''
              }

              {get(order, 'paymentPriceData.price', 0) !== null
                ? <div className={'grid grid-cols-4 gap-2 pb-1'}>
                  <div className={'col-span-3 flex flex-col'}>
                    <strong>
                      {t('order.thank_you.payment')}
                    </strong>
                    <span>{order?.payment}</span>
                  </div>
                  <div className="col-span-1 text-end">
                    <span className={'md:text-lg font-bold'}><Price priceData={order.paymentPriceData}/></span>
                  </div>
                </div>
                : ''
              }

              <Divider />

              <div className={'grid grid-cols-4 gap-2 mt-4 text-lg'}>
                <div className={'col-span-3'}>
                  <span className={'text-lg md:text-xl font-bold text-primary'}>
                    {t('order.thank_you.total')}
                  </span>
                </div>
                <div className="col-span-1 text-end">
                  <span className={'text-lg md:text-xl font-bold text-primary'}><Price priceData={order.totalSumData}/></span>
                </div>
              </div>
            </Box>
          </div>
        </div>
      </>
  )
}

export default ThankYouPageContent;
