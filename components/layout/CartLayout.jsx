"use client"
import {Suspense, useState} from "react";
import CartHeader from "@/modules/cart/components/header/CartHeader";
import {CartSummarySection} from "@/modules/cart/components/CartSummarySection";
import useCart from '@/grandus-lib/hooks/useCart';
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import EmptyCart from "@/modules/cart/components/EmptyCart";
import LoadingCart from "@/modules/cart/components/LoadingCart";
import ProcessingOrder from "@/modules/cart/components/processingOrder/ProcessingOrder";
import {useCartStep} from "@/utils/cart";
import {CheckoutSelectionProvider} from "@/modules/cart/components/delivery/CheckoutSelection";

const CartLayout = ({ children, contact }) => {
    const { cart, isLoading } = useCart();
    const step = useCartStep();
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

    // delivery & payment: wider options column once the container is 1420px
    // wide (below that the summary would be too narrow for the order button)
    const leftColSpan = step === 2 ? 'md:col-span-3 min-[1420px]:col-span-4' : 'md:col-span-3'
    const rightColSpan = step === 2 ? 'md:col-span-3 min-[1420px]:col-span-2' : 'md:col-span-3'

    return (
        <Suspense fallback={<LoadingCart />}>
            <CheckoutSelectionProvider>
                <CartHeader />
                {step === 0 ? children : (
                    <div className="grid grid-cols-6 gap-6 pt-8 md:pt-12">
                        <div className={`col col-span-full ${leftColSpan}`}>
                            <Suspense>
                                {children}
                            </Suspense>
                        </div>
                        <div className={`col col-span-full ${rightColSpan} flex flex-col gap-6`}>
                            <CartSummarySection setIsProcessing={setIsProcessing} contact={contact} />
                        </div>
                    </div>
                )}
            </CheckoutSelectionProvider>
        </Suspense>
    )
}

export default CartLayout;
