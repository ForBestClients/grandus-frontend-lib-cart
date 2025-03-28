"use client"
import {Suspense, useState} from "react";
import CartHeader from "@/modules/cart/components/header/CartHeader";
import CartTitle from "@/modules/cart/components/CartTitle";
import {CartSummarySection} from "@/modules/cart/components/CartSummarySection";
import useCart from "@/grandus-lib/hooks/useCart";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import EmptyCart from "@/modules/cart/components/EmptyCart";
import LoadingCart from "@/modules/cart/components/LoadingCart";
import ProcessingOrder from "@/modules/cart/components/processingOrder/ProcessingOrder";

const CartLayout = ({ children }) => {
    const { cart, isLoading } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);

    const componentIsLoading = isLoading || isProcessing;

    if (isProcessing) {
        return <ProcessingOrder />;
    }

    if (isEmpty(get(cart, 'items', [])) && isLoading) {
        return <LoadingCart />;
    }

    if (isEmpty(get(cart, 'items', [])) && !componentIsLoading) {
        return <EmptyCart />;
    }

    return (
        <Suspense fallback={<LoadingCart />}>
            <CartHeader />
            <div className="grid grid-cols-6 gap-6 py-8">
                <div className="col col-span-full md:col-span-4">
                    <Suspense>
                        {children}
                    </Suspense>
                </div>
                <div className="col col-span-full md:col-span-2 flex flex-col gap-6">
                    <CartSummarySection setIsProcessing={setIsProcessing} />
                </div>
            </div>
        </Suspense>
    )
}

export default CartLayout;
