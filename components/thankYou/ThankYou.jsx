import {get, isEmpty} from "lodash";
import getOrder from "@/grandus-utils/fetches/ssr/order/OrderByAccessToken";
import getWebInstance from "@/grandus-utils/fetches/ssr/WebInstance";
import EmptyState from "@/modules/cart/components/thankYou/EmptyState";
import ThankYouPageContent from "@/modules/cart/components/thankYou/ThankYouPageContent";
import MainPageLink from "@/modules/cart/components/thankYou/MainPageLink";

const ThankYou = async ({ orderToken }) => {
    const [order, webInstance] = await Promise.all([
        getOrder(orderToken),
        getWebInstance(),
    ]);

    return (
        <>
            {isEmpty(order)
                ? <EmptyState/>
                : <ThankYouPageContent order={order} bankSettings={get(webInstance, 'globalSettings')}/>
            }
            <div className="text-center mt-8">
                <MainPageLink/>
            </div>
        </>
    );
}

export default ThankYou;
