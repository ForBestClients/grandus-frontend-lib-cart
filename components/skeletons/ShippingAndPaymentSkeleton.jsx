const ShippingAndPaymentSkeleton = () => {
    return (
        <div className="animate-pulse">
            <div className="w-full bg-grey max-w-[400px] h-6"></div>

            <div className={'mt-4 flex justify-center items-center'}>
                <div className="w-[50px] h-[60px] bg-grey flex-shrink-0 me-3"></div>
                <div className={'flex-grow'}>
                    <div className="w-full bg-grey max-w-[300px] h-4"></div>
                    <div className="w-full bg-grey h-9 max-w-[300px] mt-3"></div>
                </div>
                <div className="w-full bg-grey h-6 max-w-[100px]"></div>
            </div>
        </div>
    )
}

export default ShippingAndPaymentSkeleton;
