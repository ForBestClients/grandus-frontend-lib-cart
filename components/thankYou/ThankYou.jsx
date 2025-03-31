import {isEmpty} from "lodash";
import getOrder from "@/grandus-utils/fetches/ssr/order/OrderByAccessToken";
import EmptyState from "@/modules/cart/components/thankYou/EmptyState";
import ThankYouPageContent from "@/modules/cart/components/thankYou/ThankYouPageContent";
import MainPageLink from "@/modules/cart/components/thankYou/MainPageLink";

const ThankYou = async ({ orderToken }) => {
    const order = await getOrder(orderToken);

    return (
        <>
            {isEmpty(order)
                ? <EmptyState/>
                : <ThankYouPageContent order={order}/>
            }
            <div className="text-center mt-8">
                <MainPageLink/>
            </div>
        </>
    );
}

export default ThankYou;
