'use client';
import Box from "@/components/_other/box/Box";
import SectionHeading from "@/components/content/SectionHeading";
import { CheckStroke } from "@/components/_other/icons/StrokeIcons";
import map from "lodash/map";
import Price from "@/components/price/Price";
import get from "lodash/get";
import Divider from "@/components/_other/divider/Divider";
import {useTranslation} from "@/app/i18n/client";
import {useSearchParams} from "next/navigation";
import Alert from "@/components/_other/alert/Alert";
import BankTransferInfo from "./BankTransferInfo";

const Row = ({ label, children, className = '' }) => (
  <div className={`flex items-start justify-between gap-4 py-1.5 ${className}`}>
    <div className="min-w-0">{label}</div>
    <div className="shrink-0 whitespace-nowrap text-right text-base">{children}</div>
  </div>
);

const ThankYouPageContent = ({order, bankSettings = null}) => {
  const {t} = useTranslation();
  const searchParams = useSearchParams();

  return (
      <>
        <div className="flex flex-col items-center text-center">
          <span className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-brand-soft text-brand-deep">
            <CheckStroke className="size-8" strokeWidth={2} />
          </span>
          <SectionHeading
            as="h1"
            size="md"
            kicker={t('order.thank_you.kicker')}
            title={t('order.thank_you.title')}
            className="mb-6"
          />
          <span className="inline-flex items-center rounded-full bg-brand-soft px-4 py-1.5 text-sm font-medium text-brand-deep">
            {t('order.thank_you.order_no')} {order.orderNumber}
          </span>
        </div>

        {searchParams.get('status') === '0' && searchParams.get('message') ? <Alert type="error" message={searchParams.get('message')} /> : null }

        <Box>
          <h2 className="mb-4 text-lg font-medium leading-snug text-ink md:text-xl">
            {t('cart_summary.title')}
          </h2>

          <div className={'grid grid-cols-4 gap-2 pb-2 text-sm text-ink-muted'}>
            <div className={'col-span-2'}>{t('order.thank_you.products')}</div>
            <div className={'col text-center'}>{t('order.thank_you.count')}</div>
            <div className={'col text-end'}>{t('order.thank_you.price')}</div>
          </div>

          {map(order.orderItems, (orderItem, index) => {
            return (<div key={`order-item-${index}`} className={'grid grid-cols-4 items-start gap-2 py-1.5'}>
              <div className={'col-span-2 text-[15px] leading-snug text-ink'}>
                {orderItem.name}
              </div>

              <div className={'col text-center text-[15px] text-ink-muted'}>
                {orderItem.count} {orderItem.size}
              </div>

              <div className={'col text-end text-base'}>
                <Price priceData={orderItem.totalPriceData}/>
              </div>
            </div>)
          })}

          <Divider />

          {map(order?.coupons, (coupon, i) => {
            return (
              <Row
                key={`order-coupon-${i}`}
                label={<span className="text-[15px] font-medium text-ink">{coupon.hash}</span>}
              >
                <span className="font-bold text-price tabular-nums">−</span>
                <Price priceData={coupon.discountData} />
              </Row>
            )
          })}

          {get(order, 'deliveryPriceData.price', 0) !== null
            ? (
              <Row
                label={
                  <>
                    <span className="block text-sm text-ink-muted">{t('order.thank_you.delivery')}</span>
                    <span className="block text-[15px] text-ink">{order?.delivery}</span>
                  </>
                }
              >
                <Price priceData={order.deliveryPriceData}/>
              </Row>
            )
            : ''
          }

          {get(order, 'paymentPriceData.price', 0) !== null
            ? (
              <Row
                label={
                  <>
                    <span className="block text-sm text-ink-muted">{t('order.thank_you.payment')}</span>
                    <span className="block text-[15px] text-ink">{order?.payment}</span>
                  </>
                }
              >
                <Price priceData={order.paymentPriceData}/>
              </Row>
            )
            : ''
          }

          <Divider />

          <div className={'flex items-center justify-between gap-4'}>
            <span className={'text-lg font-bold text-ink md:text-xl'}>
              {t('order.thank_you.total')}
            </span>
            <span className={'text-lg md:text-xl'}>
              <Price priceData={order.totalSumData}/>
            </span>
          </div>
        </Box>

        <BankTransferInfo order={order} settings={bankSettings} />
      </>
  )
}

export default ThankYouPageContent;
