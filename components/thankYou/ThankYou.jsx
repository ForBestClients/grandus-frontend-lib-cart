import {isEmpty} from "lodash";
import getOrder from "@/grandus-utils/fetches/ssr/order/OrderByAccessToken";
import EmptyState from "@/components/order/EmptyState";
import ThankYouPageContent from "@/components/order/ThankYouPageContent";
import MainPageLink from "@/components/order/MainPageLink";

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
