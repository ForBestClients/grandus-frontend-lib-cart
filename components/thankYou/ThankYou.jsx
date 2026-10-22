import {get, isEmpty, pick} from "lodash";
import getOrder from "@/grandus-utils/fetches/ssr/order/OrderByAccessToken";
import getWebInstance from "@/grandus-utils/fetches/ssr/WebInstance";
import EmptyState from "@/modules/cart/components/thankYou/EmptyState";
import ThankYouPageContent from "@/modules/cart/components/thankYou/ThankYouPageContent";
import MainPageLink from "@/modules/cart/components/thankYou/MainPageLink";
import OrderAnalytics from "@/app/components/cart/OrderAnalytics";

// Fields the purchase tracking needs (utils/ecommerce purchaseG4); no contact data
const ORDER_TRACKING_FIELDS = ['id', 'orderNumber', 'totalSumData', 'deliveryPriceData', 'paymentPriceData', 'coupons', 'orderItems'];

const ThankYou = async ({ orderToken }) => {
    const [order, webInstance] = await Promise.all([
        getOrder(orderToken),
        getWebInstance(),
    ]);

    return (
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6">
            {isEmpty(order)
                ? <EmptyState/>
                : <>
                    <OrderAnalytics order={pick(order, ORDER_TRACKING_FIELDS)}/>
                    <ThankYouPageContent order={order} bankSettings={get(webInstance, 'globalSettings')}/>
                  </>
            }
            <div className="flex justify-center pt-2">
                <MainPageLink/>
            </div>
        </div>
    );
}

export default ThankYou;
