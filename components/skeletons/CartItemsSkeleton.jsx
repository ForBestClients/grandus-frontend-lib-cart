import Divider from "@/components/_other/divider/Divider";

const BAR = 'rounded-[8px] bg-brand-soft';

const ItemSkeleton = () => {
    return (
        <>
            <div className="col col-span-3 flex h-full items-center gap-4 py-2 pe-2">
                <div className="h-[60px] w-[50px] flex-shrink-0 rounded-[10px] bg-brand-soft sm:h-[100px] sm:w-20 sm:rounded-[12px]"></div>
                <div className="w-full">
                    <div className={`${BAR} h-5 w-full`}></div>
                    <div className={`${BAR} mt-3 h-4 w-2/3`}></div>
                </div>
            </div>
            <div className="col p-2 text-center">
                <div className={`${BAR} h-5 w-full`}></div>
            </div>

            <div className="col p-2 text-center">
                <div className={`${BAR} h-5 w-full`}></div>
            </div>
        </>
    )
};

const CartItemsSkeleton = () => {
    return (
        <div className="grid animate-pulse grid-cols-5 items-center text-left" aria-hidden="true">
            <div className="col col-span-3 py-2 pe-2 text-left">
                <div className={`${BAR} h-7 w-full max-w-[200px]`}></div>
            </div>
            <div className="col p-2 text-center">
                <div className={`${BAR} h-7 w-full`}></div>
            </div>
            <div className="col p-2 text-center">
                <div className={`${BAR} h-7 w-full`}></div>
            </div>

            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />

            <div className="col-span-full">
                <Divider/>
            </div>
        </div>
    )
}

export default CartItemsSkeleton;
