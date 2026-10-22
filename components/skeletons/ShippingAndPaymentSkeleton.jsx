const ShippingAndPaymentSkeleton = () => {
    return (
        <div className="animate-pulse" aria-hidden="true">
            <div className="h-6 w-full max-w-[260px] rounded-[8px] bg-brand-soft"></div>

            <div className={'mt-4 flex items-center gap-4 rounded-input border border-line-card p-4'}>
                <div className="h-5 w-5 flex-shrink-0 rounded-full bg-brand-soft"></div>
                <div className={'flex-grow'}>
                    <div className="h-4 w-full max-w-[220px] rounded-[8px] bg-brand-soft"></div>
                    <div className="mt-3 h-4 w-full max-w-[320px] rounded-[8px] bg-brand-soft"></div>
                </div>
                <div className="h-5 w-full max-w-[64px] rounded-[8px] bg-brand-soft"></div>
            </div>
        </div>
    )
}

export default ShippingAndPaymentSkeleton;
